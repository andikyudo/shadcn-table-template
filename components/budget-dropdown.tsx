"use client"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ChevronDown, Plus } from "lucide-react"
import { useState } from "react"

interface Budget {
  id: string
  name: string
  amount: number
  isMain?: boolean
}

export function BudgetDropdown() {
  const [isOpen, setIsOpen] = useState(true)
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: "1", name: "BUDGET", amount: -910890, isMain: true },
    { id: "2", name: "Suami", amount: -904700 },
    { id: "3", name: "Istri", amount: -6190 },
  ])

  const addAccount = () => {
    const newBudget: Budget = {
      id: (budgets.length + 1).toString(),
      name: `Account ${budgets.length}`,
      amount: 0
    }
    setBudgets([...budgets, newBudget])
  }

  const formatAmount = (amount: number) => {
    const prefix = amount < 0 ? "-" : ""
    return `${prefix}Rp${Math.abs(amount).toLocaleString("id-ID")}`
  }

  return (
    <div className="w-full space-y-1">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-between px-2 hover:bg-accent hover:text-accent-foreground",
              isOpen && "bg-accent/50"
            )}
          >
            <div className="flex items-center gap-2">
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen ? "rotate-0" : "-rotate-90"
              )}/>
              <span className="text-base font-medium">
                {budgets[0].name}
              </span>
            </div>
            <span className="text-red-500 font-medium">
              {formatAmount(budgets[0].amount)}
            </span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {budgets.slice(1).map((budget) => (
            <Button
              key={budget.id}
              variant="ghost"
              className="w-full justify-between px-8 hover:bg-accent hover:text-accent-foreground"
            >
              <span className="text-base">{budget.name}</span>
              <span className="text-red-500">
                {formatAmount(budget.amount)}
              </span>
            </Button>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start px-8 text-base hover:bg-accent hover:text-accent-foreground"
            onClick={addAccount}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
