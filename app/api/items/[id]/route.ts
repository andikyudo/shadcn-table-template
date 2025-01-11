import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

async function getAuthUser() {
  try {
    const headersList = headers()
    const authHeader = headersList.get('Authorization')
    
    if (!authHeader) {
      return null
    }

    const authData = JSON.parse(authHeader)
    return authData?.user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.status || body.amount === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate status enum
    const validStatus = ['Active', 'Pending', 'Inactive']
    if (!validStatus.includes(body.status)) {
      return NextResponse.json(
        { message: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Validate amount
    const amount = parseFloat(body.amount)
    if (isNaN(amount)) {
      return NextResponse.json(
        { message: 'Invalid amount value' },
        { status: 400 }
      )
    }

    // Check if item exists and belongs to user
    const existingItem = await prisma.item.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingItem) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      )
    }

    // Update item
    const updatedItem = await prisma.item.update({
      where: {
        id: params.id
      },
      data: {
        name: body.name,
        status: body.status,
        amount: amount
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if item exists and belongs to user
    const existingItem = await prisma.item.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingItem) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      )
    }

    // Delete item
    await prisma.item.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
