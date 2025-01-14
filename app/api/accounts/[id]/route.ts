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
    
    if (!body.name || !body.type) {
      return NextResponse.json(
        { message: 'Name and type are required' },
        { status: 400 }
      )
    }

    // Check if account exists and belongs to user
    const existingAccount = await prisma.account.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingAccount) {
      return NextResponse.json(
        { message: 'Account not found' },
        { status: 404 }
      )
    }

    // Validate account type
    const validTypes = ['CASH', 'BANK', 'E_WALLET', 'INVESTMENT']
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { message: 'Invalid account type' },
        { status: 400 }
      )
    }

    const account = await prisma.account.update({
      where: {
        id: params.id
      },
      data: {
        name: body.name,
        type: body.type,
        balance: body.balance || existingAccount.balance
      }
    })

    return NextResponse.json(account)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to update account' },
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

    // Check if account exists and belongs to user
    const existingAccount = await prisma.account.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingAccount) {
      return NextResponse.json(
        { message: 'Account not found' },
        { status: 404 }
      )
    }

    // Check if account has any transactions
    const transactionCount = await prisma.transaction.count({
      where: {
        accountId: params.id
      }
    })

    if (transactionCount > 0) {
      return NextResponse.json(
        { message: 'Cannot delete account with transactions' },
        { status: 400 }
      )
    }

    await prisma.account.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
