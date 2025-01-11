'use client'

import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { EditItemDialog } from './edit-item-dialog'
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"

export type Status = 'Active' | 'Pending' | 'Inactive'

export interface DataItem {
  id: string
  name: string
  status: Status
  amount: number
}

export interface Column<T extends DataItem> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface DataTableProps<T extends DataItem> {
  data: ReadonlyArray<T>
  columns: Array<Column<T>>
  onItemUpdated?: (updatedItem: T) => void
  onItemDeleted?: (deletedItemId: string) => void
}

export function DataTable<T extends DataItem>({ 
  data: initialData, 
  columns,
  onItemUpdated,
  onItemDeleted
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<Status | ''>('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [data, setData] = React.useState(initialData)
  const itemsPerPage = 5
  const { toast } = useToast()
  const { user } = useAuth()

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Filter data based on search term and status
  const filteredData = React.useMemo(() => {
    return data.filter(item => {
      const matchesSearch = Object.entries(item).some(
        ([key, value]) => {
          if (key === 'amount') {
            return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          }
          return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        }
      )

      const matchesStatus = !statusFilter || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [data, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleItemUpdated = (updatedItem: T) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    )
    onItemUpdated?.(updatedItem)
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': JSON.stringify({ user })
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete item')
      }

      setData(prevData => prevData.filter(item => item.id !== itemId))
      onItemDeleted?.(itemId)
      
      toast({
        title: "Success",
        description: "Item deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting item:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete item"
      })
    }
  }

  const renderCell = (column: Column<T>, row: T) => {
    const value = row[column.key]
    if (column.render) {
      return column.render(value, row)
    }
    if (typeof value === 'number') {
      return value.toString()
    }
    if (typeof value === 'string') {
      return value
    }
    return ''
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-8"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | '')}
            className="h-10 w-32 rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key.toString()}>{column.label}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.key.toString()}>
                    {renderCell(column, row)}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-2">
                    <EditItemDialog 
                      item={row} 
                      onItemUpdated={handleItemUpdated} 
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteItem(row.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
