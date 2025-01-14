'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/data-table'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  WalletIcon,
} from 'lucide-react'

interface Transaction {
  id: string
  date: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  description: string
  category: {
    id: string
    name: string
    type: 'INCOME' | 'EXPENSE'
  }
}

interface Account {
  id: string
  name: string
  type: string
  balance: number
}

const transactionColumns = [
  { 
    key: 'date', 
    label: 'Tanggal',
    render: (value: string) => new Date(value).toLocaleDateString('id-ID')
  },
  { 
    key: 'category', 
    label: 'Kategori',
    render: (value: { name: string }) => value.name
  },
  { 
    key: 'description', 
    label: 'Keterangan',
    render: (value: string) => value || '-'
  },
  { 
    key: 'amount', 
    label: 'Jumlah',
    render: (value: number, row: Transaction) => {
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(value)
      return row.type === 'EXPENSE' ? `-${formatted}` : formatted
    }
  }
]

export function DashboardContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions', {
        headers: {
          'Authorization': JSON.stringify({ user })
        }
      })
      if (!res.ok) {
        throw new Error('Failed to fetch transactions')
      }
      const data = await res.json()
      setTransactions(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data transaksi"
      })
    }
  }

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts', {
        headers: {
          'Authorization': JSON.stringify({ user })
        }
      })
      if (!res.ok) {
        throw new Error('Failed to fetch accounts')
      }
      const data = await res.json()
      setAccounts(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data akun"
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchTransactions(),
        fetchAccounts()
      ])
      setIsLoading(false)
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = accounts
    .reduce((sum, account) => sum + account.balance, 0)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Saldo
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(totalBalance)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pemasukan
            </CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengeluaran
            </CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-md border">
        <div className="w-full overflow-auto">
          <DataTable 
            columns={transactionColumns}
            data={transactions.slice(0, 5)}
          />
        </div>
      </div>
    </div>
  )
}
