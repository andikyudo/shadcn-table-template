'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { DataTable, type Column, type Status, type DataItem } from '@/components/data-table'
import { AddItemForm } from '@/components/add-item-form'

type TableItem = DataItem

const initialTableData: TableItem[] = [
  { id: '001', name: 'John Doe', status: 'Active', amount: 250.00 },
  { id: '002', name: 'Jane Smith', status: 'Pending', amount: 150.00 },
  { id: '003', name: 'Bob Johnson', status: 'Active', amount: 350.00 },
  { id: '004', name: 'Alice Brown', status: 'Inactive', amount: 450.00 },
  { id: '005', name: 'Charlie Wilson', status: 'Active', amount: 550.00 },
  { id: '006', name: 'Diana Miller', status: 'Pending', amount: 650.00 },
  { id: '007', name: 'Edward Davis', status: 'Inactive', amount: 750.00 },
  { id: '008', name: 'Frank Thomas', status: 'Active', amount: 850.00 },
]

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

export function DashboardContent() {
  const [tableData, setTableData] = useState<TableItem[]>(initialTableData)
  const router = useRouter()
  const isAuthenticated = useAuth(state => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleAddItem = (values: { name: string; status: Status; amount: string }) => {
    const newItem: TableItem = {
      id: String(tableData.length + 1).padStart(3, '0'),
      name: values.name,
      status: values.status,
      amount: parseFloat(values.amount)
    }
    setTableData([...tableData, newItem])
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <AddItemForm onSubmit={handleAddItem} />
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={tableData} />
      </div>
    </div>
  )
}
