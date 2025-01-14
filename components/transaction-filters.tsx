"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TransactionFilters {
  startDate?: string
  endDate?: string
  category?: string
  account?: string
  search?: string
}

interface TransactionFiltersProps {
  filters: TransactionFilters
  onFiltersChange: (filters: TransactionFilters) => void
  accounts: string[]
  categories: string[]
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  accounts,
  categories,
}: TransactionFiltersProps) {
  const [open, setOpen] = React.useState(false)

  const handleFilterChange = (key: keyof TransactionFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
    setOpen(false)
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "border-gray-300",
            activeFiltersCount > 0 && "border-blue-500 bg-blue-50"
          )}
        >
          View
          {activeFiltersCount > 0 && (
            <span className="ml-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Filter your transactions by date, category, account, or search terms.
            </p>
          </div>
          <div className="grid gap-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="date"
                  placeholder="Start date"
                  value={filters.startDate || ""}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="date"
                  placeholder="End date"
                  value={filters.endDate || ""}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => handleFilterChange("category", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.filter(Boolean).map((category) => (
                  <SelectItem key={`category-${category}`} value={category || "uncategorized"}>
                    {category || "Uncategorized"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Account</Label>
            <Select
              value={filters.account || "all"}
              onValueChange={(value) => handleFilterChange("account", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.filter(Boolean).map((account) => (
                  <SelectItem key={`account-${account}`} value={account || "no-account"}>
                    {account || "No Account"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Search</Label>
            <Input
              placeholder="Search by payee or memo"
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="text-destructive border-destructive/50 hover:bg-destructive/10"
              onClick={clearFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
            <Button onClick={() => setOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
