'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { DataTable, type Column, type Status, type DataItem } from '@/components/data-table'

type TableItem = DataItem

const tableData: readonly TableItem[] = [
  { id: '001', name: 'John Doe', status: 'Active', amount: 250.00 },
  { id: '002', name: 'Jane Smith', status: 'Pending', amount: 150.00 },
  { id: '003', name: 'Bob Johnson', status: 'Active', amount: 350.00 },
  { id: '004', name: 'Alice Brown', status: 'Inactive', amount: 450.00 },
  { id: '005', name: 'Charlie Wilson', status: 'Active', amount: 550.00 },
  { id: '006', name: 'Diana Miller', status: 'Pending', amount: 650.00 },
  { id: '007', name: 'Edward Davis', status: 'Inactive', amount: 750.00 },
  { id: '008', name: 'Frank Thomas', status: 'Active', amount: 850.00 },
] as const

const columns: Column<TableItem>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => {
      const status = value as Status
      return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          status === 'Active' ? 'bg-green-100 text-green-800' :
          status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      )
    }
  },
  { 
    key: 'amount', 
    label: 'Amount',
    render: (value) => {
      const amount = value as number
      return `$${amount.toFixed(2)}`
    }
  },
]

export default function DashboardContent() {
  const router = useRouter()
  const isAuthenticated = useAuth(state => state.isAuthenticated)
  const user = useAuth(state => state.user)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.email}</p>
      </div>
      
      <DataTable data={tableData} columns={columns} />
    </div>
  )
}
