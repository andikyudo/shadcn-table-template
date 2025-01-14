import { PrismaClient, FlowType, AccountType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete existing data
  await prisma.transaction.deleteMany()
  await prisma.category.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin'
    }
  })

  // Create accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        name: 'Cash',
        type: AccountType.CASH,
        balance: 1000000,
        userId: admin.id
      }
    }),
    prisma.account.create({
      data: {
        name: 'Bank BCA',
        type: AccountType.BANK,
        balance: 5000000,
        userId: admin.id
      }
    })
  ])

  // Create categories
  const categories = [
    { name: 'Gaji', type: FlowType.INCOME },
    { name: 'Bonus', type: FlowType.INCOME },
    { name: 'Investasi', type: FlowType.INCOME },
    { name: 'Lainnya', type: FlowType.INCOME },
    { name: 'Makan & Minum', type: FlowType.EXPENSE },
    { name: 'Transport', type: FlowType.EXPENSE },
    { name: 'Belanja', type: FlowType.EXPENSE },
    { name: 'Hiburan', type: FlowType.EXPENSE },
    { name: 'Kesehatan', type: FlowType.EXPENSE },
    { name: 'Pendidikan', type: FlowType.EXPENSE },
    { name: 'Tagihan', type: FlowType.EXPENSE },
    { name: 'Lainnya', type: FlowType.EXPENSE }
  ]

  await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: {
          name: category.name,
          type: category.type,
          userId: admin.id
        }
      })
    )
  )

  console.log('Database has been seeded. \n')
  console.log('User credentials:')
  console.log('Email   : admin@example.com')
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
