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
import { MoreVertical, Pencil, Trash2, Check, X } from "lucide-react"
import { useTransactions } from "@/context/transaction-context"
import { Transaction } from "@/context/transaction-context"

interface TransactionActionsMenuProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
}

export function TransactionActionsMenu({ transaction, onEdit }: TransactionActionsMenuProps) {
  const { deleteTransaction, toggleCleared } = useTransactions()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(transaction)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleCleared(transaction.id)}>
          {transaction.cleared ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Mark as Uncleared
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Mark as Cleared
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600"
          onClick={() => deleteTransaction(transaction.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
