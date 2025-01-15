"use client"

import React, { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Undo2, 
  Redo2, 
  Plus,
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TransactionInlineEdit } from "@/components/transaction-inline-edit"
import { TransactionBulkActions } from "@/components/transaction-bulk-actions"
import { TransactionFilters, TransactionFilters as ITransactionFilters } from "@/components/transaction-filters"
import { TransactionSort, SortConfig } from "@/components/transaction-sort"
import { useTransactions } from "@/context/transaction-context"
import { useHistory } from "@/context/history-context"
import { TransactionInputRow } from "@/components/transaction-input-row"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"

export default function BudgetPage() {
  const { transactions, addTransaction, toggleCleared, editTransaction, deleteTransaction, reorderTransaction } = useTransactions()
  const { canUndo, canRedo, undo, redo } = useHistory()
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [filters, setFilters] = useState<ITransactionFilters>({})
  const [sort, setSort] = useState<SortConfig | null>(null)

  // Get unique accounts and categories for filters
  const accounts = useMemo(() => {
    return Array.from(new Set(transactions.map(t => t.account)))
  }, [transactions])

  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map(t => t.category)))
  }, [transactions])

  // Apply filters and sort to transactions
  const filteredAndSortedTransactions = useMemo(() => {
    const result = transactions.filter(transaction => {
      // Date range filter
      if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
        return false
      }
      if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
        return false
      }

      // Category filter
      if (filters.category && transaction.category !== filters.category) {
        return false
      }

      // Account filter
      if (filters.account && transaction.account !== filters.account) {
        return false
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const payeeMatch = transaction.payee.toLowerCase().includes(searchTerm)
        const memoMatch = transaction.memo?.toLowerCase().includes(searchTerm) || false
        if (!payeeMatch && !memoMatch) {
          return false
        }
      }

      return true
    })

    // Apply sorting
    if (sort) {
      result.sort((a, b) => {
        let aValue: string | number
        let bValue: string | number

        // Handle special cases
        if (sort.field === "date") {
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
        } else if (sort.field === "outflow" || sort.field === "inflow") {
          aValue = Number(a[sort.field]) || 0
          bValue = Number(b[sort.field]) || 0
        } else {
          // For other fields, convert to string for comparison
          aValue = String(a[sort.field] || '')
          bValue = String(b[sort.field] || '')
        }

        if (aValue < bValue) return sort.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sort.direction === "asc" ? 1 : -1
        return 0
      })
    }

    return result
  }, [transactions, filters, sort])

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedTransactions(filteredAndSortedTransactions.map(t => t.id))
    } else {
      setSelectedTransactions([])
    }
  }

  const handleSelectTransaction = (checked: boolean, transactionId: number) => {
    if (checked) {
      setSelectedTransactions(prev => [...prev, transactionId])
    } else {
      setSelectedTransactions(prev => prev.filter(id => id !== transactionId))
    }
  }

  const clearSelection = () => {
    setSelectedTransactions([])
    setSelectAll(false)
  }

  // Calculate balances from filtered transactions
  const clearedBalance = filteredAndSortedTransactions.reduce((sum, t) => {
    if (t.cleared) {
      return sum + (t.inflow || 0) - (t.outflow || 0)
    }
    return sum
  }, 0)

  const unclearedBalance = filteredAndSortedTransactions.reduce((sum, t) => {
    if (!t.cleared) {
      return sum + (t.inflow || 0) - (t.outflow || 0)
    }
    return sum
  }, 0)

  const workingBalance = clearedBalance + unclearedBalance

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
        tolerance: 5,
        delay: 0,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  )

  const modifiers = [
    restrictToVerticalAxis,
    restrictToParentElement,
  ]

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = transactions.findIndex((t) => t.id === active.id)
    const newIndex = transactions.findIndex((t) => t.id === over.id)
    reorderTransaction(oldIndex, newIndex)
  }

  const TransactionRow = ({ transaction, isEditing, onEdit, onCancel, onSave }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ 
      id: transaction.id,
      disabled: isEditing 
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      cursor: isDragging ? 'grabbing' : 'grab',
      touchAction: 'none',
    }

    if (isEditing) {
      return (
        <div className="relative" style={style}>
          <TransactionInlineEdit
            transaction={transaction}
            onSave={onSave}
            onCancel={onCancel}
          />
        </div>
      )
    }

    const handleCheckboxChange = (checked) => {
      setSelectedTransactions(prev => {
        if (checked) {
          return [...prev, transaction.id]
        } else {
          return prev.filter(id => id !== transaction.id)
        }
      })
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex h-[42px] hover:bg-gray-50/80 border-b border-gray-200",
          selectedTransactions.includes(transaction.id) && "bg-blue-100"
        )}
      >
        <div className="w-[50px] shrink-0 flex items-center justify-center">
          <Checkbox
            checked={selectedTransactions.includes(transaction.id)}
            onCheckedChange={(checked) => handleSelectTransaction(checked as boolean, transaction.id)}
          />
        </div>
        <div className="w-[50px] shrink-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => toggleCleared(transaction.id)}
          >
            <div className={cn(
              "h-2 w-2 rounded-full mx-auto",
              transaction.cleared ? "bg-green-500" : "bg-gray-300"
            )} />
          </Button>
        </div>
        <div 
          className="flex-1 flex items-center"
          {...attributes}
          {...listeners}
          onDoubleClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onEdit()
          }}
        >
          <div className="w-[180px] shrink-0 flex items-center px-4">
            <span className="font-medium whitespace-nowrap">{transaction.account}</span>
          </div>
          <div className="w-[140px] shrink-0 flex items-center px-4">
            <span className="font-medium">{transaction.date}</span>
          </div>
          <div className="w-[220px] shrink-0 flex items-center px-4">
            <span className="font-medium">{transaction.payee}</span>
          </div>
          <div className="w-[220px] shrink-0 flex items-center px-4">
            <span className="font-medium">{transaction.category}</span>
          </div>
          <div className="flex-1 min-w-[250px] flex items-center px-4">
            <span className="font-medium">{transaction.memo}</span>
          </div>
          <div className="w-[160px] shrink-0 flex items-center px-4">
            <span className={cn(
              "font-medium",
              transaction.outflow && "text-red-600"
            )}>
              {transaction.outflow ? `Rp${transaction.outflow}` : ''}
            </span>
          </div>
          <div className="w-[160px] shrink-0 flex items-center px-4">
            <span className={cn(
              "font-medium",
              transaction.inflow && "text-green-600"
            )}>
              {transaction.inflow ? `Rp${transaction.inflow}` : ''}
            </span>
          </div>
        </div>
        <div className="w-[50px] shrink-0 flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onClick={() => onEdit()}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleCleared(transaction.id)}
              >
                {transaction.cleared ? 'Mark as Uncleared' : 'Mark as Cleared'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  deleteTransaction(transaction.id)
                  if (selectedTransactions.includes(transaction.id)) {
                    setSelectedTransactions(prev => prev.filter(id => id !== transaction.id))
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Overview Balance */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-muted-foreground">
                Cleared Balance
              </span>
            </div>
            <span className={cn(
              "text-2xl font-bold",
              clearedBalance >= 0 ? "text-green-500" : "text-red-500"
            )}>
              Rp{Math.abs(clearedBalance)}
            </span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-gray-500"></span>
              <span className="text-sm font-medium text-muted-foreground">
                Uncleared Balance
              </span>
            </div>
            <span className={cn(
              "text-2xl font-bold",
              unclearedBalance >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {unclearedBalance >= 0 ? "+" : "-"}Rp{Math.abs(unclearedBalance)}
            </span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-muted-foreground">
                Working Balance
              </span>
            </div>
            <span className={cn(
              "text-2xl font-bold",
              workingBalance >= 0 ? "text-green-500" : "text-red-500"
            )}>
              Rp{Math.abs(workingBalance)}
            </span>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="border-gray-300"
              onClick={() => setShowAddTransaction(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
            <Button
              variant="outline"
              className="border-gray-300"
              onClick={undo}
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-gray-300"
              onClick={redo}
              disabled={!canRedo}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <TransactionBulkActions 
              selectedIds={selectedTransactions}
              onClearSelection={clearSelection}
            />
            <TransactionFilters
              filters={filters}
              onFiltersChange={setFilters}
              accounts={accounts}
              categories={categories}
            />
            <TransactionSort
              sort={sort}
              onSortChange={setSort}
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-md border overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={filteredAndSortedTransactions.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col overflow-x-auto">
                {/* Table header */}
                <div className="sticky top-0 z-20 bg-gray-50/80 border-b border-gray-200">
                  <div className="flex h-10">
                    <div className="w-[50px] shrink-0 flex items-center justify-center">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                    </div>
                    <div className="w-[50px] shrink-0 flex items-center justify-center">
                      <span className="sr-only">Status</span>
                    </div>
                    <div className="w-[180px] shrink-0 flex items-center px-4">
                      <span className="font-semibold tracking-wider">ACCOUNT</span>
                    </div>
                    <div className="w-[140px] shrink-0 flex items-center px-4">
                      <span className="font-semibold tracking-wider">DATE</span>
                    </div>
                    <div className="w-[220px] shrink-0 flex items-center px-4">
                      <span className="font-semibold tracking-wider">PAYEE</span>
                    </div>
                    <div className="w-[220px] shrink-0 flex items-center px-4">
                      <span className="font-semibold tracking-wider">CATEGORY</span>
                    </div>
                    <div className="flex-1 min-w-[250px] flex items-center px-4">
                      <span className="font-semibold tracking-wider">MEMO</span>
                    </div>
                    <div className="w-[160px] shrink-0 flex items-center px-4">
                      <span className="font-semibold tracking-wider">OUTFLOW</span>
                    </div>
                    <div className="w-[160px] shrink-0 flex items-center px-4">
                      <span className="font-semibold tracking-wider">INFLOW</span>
                    </div>
                    <div className="w-[50px] shrink-0 flex items-center justify-center">
                      <span className="sr-only">Actions</span>
                    </div>
                  </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-auto">
                  {/* Regular Rows */}
                  <div className="min-h-0">
                    {/* Input Row at the top when shown */}
                    {showAddTransaction && (
                      <div className="relative">
                        <TransactionInputRow 
                          onSave={(transaction) => {
                            addTransaction(transaction)
                            setShowAddTransaction(false)
                          }}
                          onCancel={() => setShowAddTransaction(false)}
                        />
                      </div>
                    )}
                    
                    {/* Transaction Rows */}
                    {filteredAndSortedTransactions.map((transaction) => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                        isEditing={editingId === transaction.id}
                        onEdit={() => setEditingId(transaction.id)}
                        onCancel={() => setEditingId(null)}
                        onSave={(updatedData) => {
                          editTransaction(transaction.id, updatedData)
                          setEditingId(null)
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  )
}
