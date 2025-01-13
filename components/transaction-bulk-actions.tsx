"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Check, X, Trash2 } from "lucide-react"
import { useTransactions } from "@/context/transaction-context"

interface TransactionBulkActionsProps {
  selectedIds: number[]
  onClearSelection: () => void
}

export function TransactionBulkActions({ selectedIds, onClearSelection }: TransactionBulkActionsProps) {
  const { deleteTransaction, toggleCleared } = useTransactions()

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteTransaction(id))
    onClearSelection()
  }

  const handleBulkClear = (cleared: boolean) => {
    selectedIds.forEach(id => toggleCleared(id))
    onClearSelection()
  }

  if (selectedIds.length === 0) return null

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">
        {selectedIds.length} selected
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Actions
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleBulkClear(true)}>
            <Check className="mr-2 h-4 w-4" />
            Mark as Cleared
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBulkClear(false)}>
            <X className="mr-2 h-4 w-4" />
            Mark as Uncleared
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600"
            onClick={handleBulkDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
