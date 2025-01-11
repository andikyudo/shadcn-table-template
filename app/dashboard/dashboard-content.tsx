'use client'

import { useState, useEffect } from 'react'
import { DataTable, type DataItem, type Column } from '@/components/data-table'
import { AddItemForm } from '@/components/add-item-form'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'

interface ExtendedDataItem extends DataItem {
  userId: string
}

const columns: Column<ExtendedDataItem>[] = [
  { 
    key: 'name', 
    label: 'Name',
    render: (value: string | number) => value.toString()
  },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string | number) => value.toString()
  },
  { 
    key: 'amount', 
    label: 'Amount',
    render: (value: string | number) => `$${Number(value).toFixed(2)}`
  }
]

export function DashboardContent() {
  const [items, setItems] = useState<ExtendedDataItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    const fetchItems = async () => {
      try {
        const res = await fetch('/api/items', {
          headers: {
            'Authorization': JSON.stringify({ user })
          }
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.message || 'Failed to fetch items')
        }
        const data = await res.json()
        setItems(data)
      } catch (error) {
        console.error('Error fetching items:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch items"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [isAuthenticated, user, router, toast])

  const handleAddItem = async (values: { name: string; status: string; amount: string }) => {
    try {
      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to add items"
        })
        return
      }

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': JSON.stringify({ user })
        },
        body: JSON.stringify({
          name: values.name,
          status: values.status,
          amount: parseFloat(values.amount)
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to add item')
      }
      
      const newItem = await response.json()
      setItems(prevItems => [...prevItems, newItem])
      
      toast({
        title: "Success",
        description: "Item added successfully"
      })
    } catch (error) {
      console.error('Error adding item:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add item"
      })
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="mb-8">
        <AddItemForm onSubmit={handleAddItem} />
      </div>
      {isLoading ? (
        <div className="text-center">Loading items...</div>
      ) : (
        <DataTable columns={columns} data={items} />
      )}
    </div>
  )
}
