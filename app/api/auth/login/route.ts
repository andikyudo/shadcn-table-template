import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // In a real app, we would verify the password here
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      return NextResponse.json({ 
        user: { 
          id: user.id, 
          email: user.email 
        }
      })
    }

    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
