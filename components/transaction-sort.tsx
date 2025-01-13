"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowDownWideNarrow, ArrowUpNarrowWide, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type SortField = 
  | "date"
  | "account"
  | "payee"
  | "category"
  | "outflow"
  | "inflow"

export interface SortConfig {
  field: SortField
  direction: "asc" | "desc"
}

interface TransactionSortProps {
  sort: SortConfig | null
  onSortChange: (sort: SortConfig | null) => void
}

const SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: "Date", value: "date" },
  { label: "Account", value: "account" },
  { label: "Payee", value: "payee" },
  { label: "Category", value: "category" },
  { label: "Outflow", value: "outflow" },
  { label: "Inflow", value: "inflow" },
]

export function TransactionSort({
  sort,
  onSortChange,
}: TransactionSortProps) {
  const handleSortSelect = (field: SortField) => {
    if (sort?.field === field) {
      // Toggle direction if same field
      if (sort.direction === "asc") {
        onSortChange({ field, direction: "desc" })
      } else {
        // Clear sort if already desc
        onSortChange(null)
      }
    } else {
      // New field, start with asc
      onSortChange({ field, direction: "asc" })
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sort?.field !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sort.direction === "asc" ? (
      <ArrowUpNarrowWide className="h-4 w-4" />
    ) : (
      <ArrowDownWideNarrow className="h-4 w-4" />
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "border-gray-300",
            sort && "border-blue-500 bg-blue-50"
          )}
        >
          Sort
          {sort && (
            <span className="ml-2 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
              1
            </span>
          )}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortSelect(option.value)}
            className="flex items-center justify-between"
          >
            {option.label}
            {getSortIcon(option.value)}
          </DropdownMenuItem>
        ))}
        {sort && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onSortChange(null)}
              className="text-destructive focus:text-destructive"
            >
              Clear Sort
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
