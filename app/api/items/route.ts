import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: {
        user: true
      }
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, status, amount, userId } = body

    const newItem = await prisma.item.create({
      data: {
        name,
        status,
        amount,
        userId
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(newItem)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}
