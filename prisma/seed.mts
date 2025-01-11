import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create dummy users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'User One',
      items: {
        create: [
          {
            name: 'Item 1',
            status: 'Active',
            amount: 100.0
          },
          {
            name: 'Item 2', 
            status: 'Pending',
            amount: 200.0
          }
        ]
      }
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'User Two',
      items: {
        create: [
          {
            name: 'Item 3',
            status: 'Inactive',
            amount: 300.0
          }
        ]
      }
    }
  })

  console.log('Seeded data:', { user1, user2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
