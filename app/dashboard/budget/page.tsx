"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Undo2, 
  Redo2, 
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { EditTransactionDialog } from "@/components/edit-transaction-dialog"
import { ImportTransactionsDialog } from "@/components/import-transactions-dialog"
import { TransactionActionsMenu } from "@/components/transaction-actions-menu"
import { TransactionBulkActions } from "@/components/transaction-bulk-actions"
import { TransactionFilters, TransactionFilters as ITransactionFilters } from "@/components/transaction-filters"
import { TransactionSort, SortConfig } from "@/components/transaction-sort"
import { useTransactions, Transaction } from "@/context/transaction-context"
import { useHistory } from "@/context/history-context"
import { TransactionContextMenu } from "@/components/transaction-context-menu"
import { TransactionInputRow } from "@/components/transaction-input-row"

export default function BudgetPage() {
  const { transactions, toggleCleared } = useTransactions()
  const { canUndo, canRedo, undo, redo, addToHistory } = useHistory()
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [filters, setFilters] = useState<ITransactionFilters>({})
  const [sort, setSort] = useState<SortConfig | null>(null)
  const [showAddTransaction, setShowAddTransaction] = useState(false)

  // Get unique accounts and categories for filters
  const accounts = useMemo(() => {
    return Array.from(new Set(transactions.map(t => t.account)))
  }, [transactions])

  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map(t => t.category)))
  }, [transactions])

  // Apply filters and sort to transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions.filter(transaction => {
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
        let aValue = a[sort.field]
        let bValue = b[sort.field]

        // Handle special cases
        if (sort.field === "date") {
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
        } else if (sort.field === "outflow" || sort.field === "inflow") {
          aValue = Number(a[sort.field]) || 0
          bValue = Number(b[sort.field]) || 0
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

  const handleRowClick = (id: string) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(selectedTransactions.filter(t => t !== id))
    } else {
      setSelectedTransactions([...selectedTransactions, id])
    }
  }

  const handleApprove = (id: string) => {
    // Implement approve logic
  }

  const handleReject = (id: string) => {
    // Implement reject logic
  }

  const handleMarkCleared = (id: string) => {
    toggleCleared(id)
  }

  const handleMarkUncleared = (id: string) => {
    toggleCleared(id)
  }

  const handleMatch = (id: string) => {
    // Implement match logic
  }

  const handleUnmatch = (id: string) => {
    // Implement unmatch logic
  }

  const handleDuplicate = (id: string) => {
    // Implement duplicate logic
  }

  const handleMakeRepeating = (id: string) => {
    // Implement make repeating logic
  }

  const handleFlag = (id: string) => {
    // Implement flag logic
  }

  const handleCategorize = (id: string) => {
    // Implement categorize logic
  }

  const handleMoveToAccount = (id: string) => {
    // Implement move to account logic
  }

  const handleExport = (id: string) => {
    // Implement export logic
  }

  const handleDelete = (id: string) => {
    // Implement delete logic
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-[2000px] mx-auto w-full">
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
      <div className="w-full min-w-[1200px]">
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
            <ImportTransactionsDialog />
            <Button 
              variant="outline" 
              size="icon" 
              className="border-gray-300"
              onClick={undo}
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
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
        <div 
          className="rounded-md border-2"
        >
          <Table>
            <TableHeader>
              <TableRow 
                className={cn(
                  "h-[45px] border-b-2 border-gray-200",
                  "hover:bg-transparent",
                  "transition-all duration-200"
                )}
              >
                <TableHead className="w-[50px] bg-gray-50/80 font-semibold">
                  <Checkbox 
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[50px] bg-gray-50/80" />
                <TableHead className="w-[200px] bg-gray-50/80">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">ACCOUNT</span>
                    <div className="flex-1" />
                  </div>
                </TableHead>
                <TableHead className="w-[200px] bg-gray-50/80">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">DATE</span>
                    <div className="flex-1" />
                  </div>
                </TableHead>
                <TableHead className="w-[250px] bg-gray-50/80">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">PAYEE</span>
                    <div className="flex-1" />
                  </div>
                </TableHead>
                <TableHead className="w-[250px] bg-gray-50/80">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">CATEGORY</span>
                    <div className="flex-1" />
                  </div>
                </TableHead>
                <TableHead className="min-w-[300px] bg-gray-50/80">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">MEMO</span>
                    <div className="flex-1" />
                  </div>
                </TableHead>
                <TableHead className="w-[200px] text-right bg-gray-50/80">
                  <div className="flex items-center justify-end space-x-4">
                    <span className="font-semibold">OUTFLOW</span>
                    <div className="flex-1" />
                  </div>
                </TableHead>
                <TableHead className="w-[200px] text-right bg-gray-50/80">
                  <div className="flex items-center justify-end space-x-4">
                    <span className="font-semibold">INFLOW</span>
                    <div className="flex-1" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:not(:last-child)]:border-b-[1.5px] [&_tr:not(:last-child)]:border-gray-200">
              {showAddTransaction && (
                <TransactionInputRow 
                  onSave={() => {
                    setShowAddTransaction(false)
                  }}
                />
              )}
              {filteredAndSortedTransactions.map((transaction) => (
                <TransactionContextMenu
                  key={transaction.id}
                  transaction={transaction}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onMarkCleared={handleMarkCleared}
                  onMarkUncleared={handleMarkUncleared}
                  onMatch={handleMatch}
                  onUnmatch={handleUnmatch}
                  onDuplicate={handleDuplicate}
                  onMakeRepeating={handleMakeRepeating}
                  onFlag={handleFlag}
                  onCategorize={handleCategorize}
                  onMoveToAccount={handleMoveToAccount}
                  onExport={handleExport}
                  onDelete={handleDelete}
                >
                  <TableRow 
                    onClick={() => handleRowClick(transaction.id)}
                    className={cn(
                      "h-[42px] transition-all duration-200",
                      selectedTransactions.includes(transaction.id) 
                        ? "bg-blue-50/50 hover:bg-blue-100/50" 
                        : "hover:bg-gray-50/80",
                      "animate-in fade-in-0 duration-200"
                    )}
                  >
                    <TableCell className="py-1 font-medium">
                      <Checkbox 
                        checked={selectedTransactions.includes(transaction.id)}
                        onCheckedChange={(checked) => 
                          handleSelectTransaction(checked as boolean, transaction.id)
                        }
                      />
                    </TableCell>
                    <TableCell className="py-1 text-center">
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
                    </TableCell>
                    <TableCell className="py-1">
                      <span className="font-medium whitespace-nowrap">{transaction.account}</span>
                    </TableCell>
                    <TableCell className="py-1">
                      <span className="whitespace-nowrap">{transaction.date}</span>
                    </TableCell>
                    <TableCell className="py-1">
                      <span className="whitespace-nowrap">{transaction.payee}</span>
                    </TableCell>
                    <TableCell className="py-1">
                      <span className="whitespace-nowrap">{transaction.category}</span>
                    </TableCell>
                    <TableCell className="py-1">
                      <span className="truncate block max-w-[300px]">{transaction.memo}</span>
                    </TableCell>
                    <TableCell className="text-right py-1">
                      <span className="font-medium text-red-600 whitespace-nowrap">
                        {transaction.outflow ? `Rp${transaction.outflow}` : ""}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-1">
                      <span className="font-medium text-green-600 whitespace-nowrap">
                        {transaction.inflow ? `Rp${transaction.inflow}` : ""}
                      </span>
                    </TableCell>
                    <TableCell className="py-1">
                      <div className="opacity-0 group-hover:opacity-100">
                        <TransactionActionsMenu 
                          transaction={transaction}
                          onEdit={setEditingTransaction}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </TransactionContextMenu>
              ))}
            </TableBody>
          </Table>
        </div>

        <EditTransactionDialog
          transaction={editingTransaction}
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
        />
      </div>
    </div>
  )
}
