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

    // Parse the auth data from the Authorization header
    const authData = JSON.parse(authHeader)
    return authData?.user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function GET() {
  try {
    const user = await getAuthUser()
    
    if (!user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only fetch items for the current user
    const items = await prisma.item.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const user = await getAuthUser()
    
    if (!user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

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

    // Create new item
    const newItem = await prisma.item.create({
      data: {
        name: body.name,
        status: body.status,
        amount: amount,
        userId: user.id
      }
    })

    return NextResponse.json(newItem)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to create item' },
      { status: 500 }
    )
  }
}
