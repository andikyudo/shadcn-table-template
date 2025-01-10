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
import { Search, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'

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
}

export function DataTable<T extends DataItem>({ 
  data: initialData, 
  columns 
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<Status | ''>('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5

  // Filter data based on search term and status
  const filteredData = React.useMemo(() => {
    return initialData.filter(item => {
      const matchesSearch = Object.entries(item).some(
        ([key, value]) => {
          if (key === 'amount') {
            return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          }
          return typeof value === 'string' && 
            value.toLowerCase().includes(searchTerm.toLowerCase())
        }
      )
      const matchesStatus = !statusFilter || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [initialData, searchTerm, statusFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
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
