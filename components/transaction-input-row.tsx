"use client"

import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useTransactions, Transaction } from "@/context/transaction-context"
import type { CheckedState } from "@radix-ui/react-checkbox"

interface TransactionInputRowProps {
  onSave?: (transaction: Transaction) => void
  onCancel?: () => void
}

export function TransactionInputRow({ onSave, onCancel }: TransactionInputRowProps) {
  const { addTransaction } = useTransactions()
  const [isSelected, setIsSelected] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    account: "Default Account",
    payee: "",
    category: "",
    memo: "",
    outflow: "",
    inflow: ""
  })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rowRef.current && !rowRef.current.contains(event.target as Node)) {
        onCancel?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onCancel])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    const outflow = parseFloat(formData.outflow) || 0
    const inflow = parseFloat(formData.inflow) || 0
    
    const newTransaction: Omit<Transaction, "id" | "cleared"> = {
      date: formData.date,
      account: formData.account,
      payee: formData.payee || 'Need Input',
      category: formData.category || '',
      memo: formData.memo || '',
      outflow: outflow,
      inflow: inflow
    }

    addTransaction(newTransaction)
    
    if (onSave) {
      onSave({
        ...newTransaction,
        id: Math.floor(Math.random() * 1000000),
        cleared: false
      })
    }

    // Reset form
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      account: "Default Account",
      payee: "",
      category: "",
      memo: "",
      outflow: "",
      inflow: ""
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      onCancel?.()
    }
  }

  return (
    <div className="relative" ref={rowRef}>
      <div className="flex h-[42px] bg-blue-100 hover:bg-blue-200 border-b border-gray-200">
        <div className="w-[50px] shrink-0 flex items-center justify-center border-r-2 border-gray-200">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked: CheckedState) => setIsSelected(checked as boolean)}
            disabled
          />
        </div>
        <div className="w-[50px] shrink-0 flex items-center justify-center border-r-2 border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
          >
            <div className="h-2 w-2 rounded-full mx-auto bg-gray-300" />
          </Button>
        </div>
        <div className="w-[180px] shrink-0 flex items-center px-4 border-r-2 border-gray-200">
          <span className="font-medium whitespace-nowrap">Default Account</span>
        </div>
        <div className="w-[140px] shrink-0 flex items-center px-4 border-r-2 border-gray-200">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full h-8 px-2 justify-start text-left text-sm bg-background",
                  "border-input hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-1 focus:ring-ring",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <span className="truncate">
                  {formData.date ? format(new Date(formData.date), "MM/dd/yyyy") : "Pick a date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover" align="start">
              <Calendar
                mode="single"
                selected={formData.date ? new Date(formData.date) : undefined}
                onSelect={(date) => {
                  if (date) {
                    handleInputChange('date', format(date, 'yyyy-MM-dd'))
                  }
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-[220px] shrink-0 flex items-center px-4 border-r-2 border-gray-200">
          <Input
            placeholder="Payee"
            value={formData.payee}
            onChange={(e) => handleInputChange('payee', e.target.value)}
            className="h-8 font-medium"
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="w-[220px] shrink-0 flex items-center px-4 border-r-2 border-gray-200">
          <Input
            placeholder="Category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="h-8 font-medium"
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="w-[220px] shrink-0 flex items-center px-4 border-r-2 border-gray-200">
          <Input
            placeholder="Memo"
            value={formData.memo}
            onChange={(e) => handleInputChange('memo', e.target.value)}
            className="h-8 text-sm"
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="w-[160px] shrink-0 flex items-center px-4 border-r-2 border-gray-200">
          <Input
            type="number"
            placeholder="0.00"
            value={formData.outflow}
            onChange={(e) => handleInputChange('outflow', e.target.value)}
            className={cn(
              "h-8 text-sm text-right w-full",
              formData.outflow && "text-red-600"
            )}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="w-[160px] shrink-0 flex items-center px-4 border-r-2 border-gray-200">
          <Input
            type="number"
            placeholder="0.00"
            value={formData.inflow}
            onChange={(e) => handleInputChange('inflow', e.target.value)}
            className={cn(
              "h-8 text-sm text-right w-full",
              formData.inflow && "text-green-600"
            )}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="w-[50px] shrink-0" />
      </div>

      <div className="border-b border-gray-200">
        <div className="py-2 px-4 flex justify-end gap-2 bg-blue-100">
          <Button 
            variant="default"
            onClick={handleSave}
            className="h-8 px-3 text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              handleSave()
              // Keep focus on date input for next entry
              const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement
              if (dateInput) dateInput.focus()
            }}
            className="h-8 px-3 text-sm font-semibold rounded-md border-gray-200 hover:bg-blue-50"
          >
            Save and Add Another
          </Button>
          <Button 
            variant="ghost"
            onClick={() => onCancel?.()}
            className="h-8 px-3 text-sm font-semibold rounded-md hover:bg-gray-100"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}