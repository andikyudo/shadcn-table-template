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

    const accounts = await prisma.account.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch accounts' },
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
    
    if (!body.name || !body.type) {
      return NextResponse.json(
        { message: 'Name and type are required' },
        { status: 400 }
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

    const account = await prisma.account.create({
      data: {
        name: body.name,
        type: body.type,
        balance: body.balance || 0,
        userId: user.id
      }
    })

    return NextResponse.json(account)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Failed to create account' },
      { status: 500 }
    )
  }
}
