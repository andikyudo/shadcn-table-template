'use client'

import { useState, useEffect } from 'react'
import { DataTable, type DataItem } from '@/components/data-table'
import { AddItemForm } from '@/components/add-item-form'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { 
    key: 'amount', 
    label: 'Amount',
    render: (value: number) => `$${value.toFixed(2)}`
  }
]

export function DashboardContent() {
  const [items, setItems] = useState<DataItem[]>([])
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

  useEffect(() => {
    // Fetch items when component mounts
    fetch('/api/items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error))
  }, [])

  const handleAddItem = async (values: { name: string; status: string; amount: string }) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          amount: parseFloat(values.amount),
          userId: items[0]?.userId || '' // Use the first user's ID for now
        }),
      })

      if (!response.ok) throw new Error('Failed to add item')
      
      const newItem = await response.json()
      setItems(prevItems => [...prevItems, newItem])
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <AddItemForm onSubmit={handleAddItem} />
      </div>
      <div className="container mx-auto py-10">
        <DataTable
          data={items}
          columns={columns}
        />
      </div>
    </div>
  )
}
