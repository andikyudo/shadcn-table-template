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

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id
      },
      include: {
        category: true,
        account: true
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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
    if (!body.date || !body.amount || !body.categoryId || !body.type || !body.accountId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate amount
    const amount = parseFloat(body.amount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { message: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Validate category exists and matches type
    const category = await prisma.category.findFirst({
      where: {
        id: body.categoryId,
        type: body.type
      }
    })

    if (!category) {
      return NextResponse.json(
        { message: 'Invalid category' },
        { status: 400 }
      )
    }

    // Validate account exists and belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: body.accountId,
        userId: user.id
      }
    })

    if (!account) {
      return NextResponse.json(
        { message: 'Invalid account' },
        { status: 400 }
      )
    }

    // Start transaction to update both transaction and account balance
    const transaction = await prisma.$transaction(async (tx) => {
      // Create transaction
      const newTransaction = await tx.transaction.create({
        data: {
          date: new Date(body.date),
          amount,
          description: body.description || '',
          type: body.type,
          categoryId: body.categoryId,
          accountId: body.accountId,
          userId: user.id
        },
        include: {
          category: true,
          account: true
        }
      })

      // Update account balance
      const balanceChange = body.type === 'INCOME' ? amount : -amount
      await tx.account.update({
        where: { id: body.accountId },
        data: {
          balance: {
            increment: balanceChange
          }
        }
      })

      return newTransaction
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
