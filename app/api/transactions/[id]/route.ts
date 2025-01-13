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

    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
      include: {
        account: true
      }
    })

    if (!existingTransaction) {
      return NextResponse.json(
        { message: 'Transaction not found' },
        { status: 404 }
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

    // Start transaction to update both transaction and account balances
    const transaction = await prisma.$transaction(async (tx) => {
      // Revert old account balance
      const oldBalanceChange = existingTransaction.type === 'INCOME' 
        ? -existingTransaction.amount 
        : existingTransaction.amount

      if (existingTransaction.accountId === body.accountId) {
        // Same account, just update the balance difference
        const newBalanceChange = body.type === 'INCOME' ? amount : -amount
        const balanceChange = newBalanceChange - (existingTransaction.type === 'INCOME' ? existingTransaction.amount : -existingTransaction.amount)
        
        await tx.account.update({
          where: { id: body.accountId },
          data: {
            balance: {
              increment: balanceChange
            }
          }
        })
      } else {
        // Different account, revert old account and update new account
        await tx.account.update({
          where: { id: existingTransaction.accountId },
          data: {
            balance: {
              increment: oldBalanceChange
            }
          }
        })

        const newBalanceChange = body.type === 'INCOME' ? amount : -amount
        await tx.account.update({
          where: { id: body.accountId },
          data: {
            balance: {
              increment: newBalanceChange
            }
          }
        })
      }

      // Update transaction
      const updatedTransaction = await tx.transaction.update({
        where: {
          id: params.id
        },
        data: {
          date: new Date(body.date),
          amount,
          description: body.description || '',
          type: body.type,
          categoryId: body.categoryId,
          accountId: body.accountId
        },
        include: {
          category: true,
          account: true
        }
      })

      return updatedTransaction
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to update transaction' },
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

    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingTransaction) {
      return NextResponse.json(
        { message: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Start transaction to update both transaction and account balance
    await prisma.$transaction(async (tx) => {
      // Revert account balance
      const balanceChange = existingTransaction.type === 'INCOME' 
        ? -existingTransaction.amount 
        : existingTransaction.amount

      await tx.account.update({
        where: { id: existingTransaction.accountId },
        data: {
          balance: {
            increment: balanceChange
          }
        }
      })

      // Delete transaction
      await tx.transaction.delete({
        where: {
          id: params.id
        }
      })
    })

    return NextResponse.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}
