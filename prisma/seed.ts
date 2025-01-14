import { PrismaClient, FlowType, AccountType, CategoryType } from '@prisma/client'

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
      email: 'demo@example.com',
      password: 'demo123',
      name: 'Demo User'
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
    }),
    prisma.account.create({
      data: {
        name: 'E-Wallet',
        type: AccountType.E_WALLET,
        balance: 500000,
        userId: admin.id
      }
    })
  ])

  // Create income categories
  const incomeCategories = [
    // Pendapatan Aktif
    {
      name: 'Pendapatan Aktif',
      type: FlowType.INCOME,
      categoryType: CategoryType.ACTIVE_INCOME,
      children: [
        { name: 'Gaji', icon: '💰' },
        { name: 'Upah/Honor', icon: '💵' },
        { name: 'Tunjangan', icon: '📈' },
        { name: 'Bonus', icon: '🎁' }
      ]
    },
    // Pendapatan Pasif
    {
      name: 'Pendapatan Pasif',
      type: FlowType.INCOME,
      categoryType: CategoryType.PASSIVE_INCOME,
      children: [
        { name: 'Sewa', icon: '🏠' },
        { name: 'Dividen', icon: '📊' },
        { name: 'Bunga Deposito', icon: '🏦' },
        { name: 'Royalti', icon: '📝' }
      ]
    },
    // Pendapatan Lain-lain
    {
      name: 'Pendapatan Lain-lain',
      type: FlowType.INCOME,
      categoryType: CategoryType.OTHER_INCOME,
      children: [
        { name: 'Penjualan Aset', icon: '🏷' },
        { name: 'Warisan', icon: '📜' },
        { name: 'Hadiah', icon: '🎉' },
        { name: 'Pendapatan Sampingan', icon: '💼' }
      ]
    }
  ]

  // Create categories with their children
  for (const category of incomeCategories) {
    const parentCategory = await prisma.category.create({
      data: {
        name: category.name,
        type: category.type,
        categoryType: category.categoryType,
        userId: admin.id
      }
    })

    await Promise.all(
      category.children.map((child) =>
        prisma.category.create({
          data: {
            name: child.name,
            type: category.type,
            categoryType: category.categoryType,
            icon: child.icon,
            parentId: parentCategory.id,
            userId: admin.id
          }
        })
      )
    )
  }

  console.log('Database has been seeded. \n')
  console.log('User credentials:')
  console.log('Email   : demo@example.com')
  console.log('Password: demo123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
