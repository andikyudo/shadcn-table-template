"use client"

import React, { useState, useRef, useEffect, useContext } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useTransactions } from "@/context/transaction-context"
import type { Transaction } from "@/context/transaction-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TransactionInputRowProps {
  onSave?: (transaction: Transaction) => void
  onCancel?: () => void
}

export function TransactionInputRow({ onSave, onCancel }: TransactionInputRowProps) {
  const { accounts = [], categories = [], addTransaction } = useTransactions()
  const [isExiting, setIsExiting] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    account: "",
    payee: "",
    category: "",
    memo: "",
    outflow: "",
    inflow: "",
    cleared: false
  })

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!formData.account || !formData.date) return

    setIsExiting(true)
    setTimeout(() => {
      const newTransaction: Omit<Transaction, "id"> = {
        date: formData.date,
        account: formData.account,
        payee: formData.payee || 'Need Input',
        category: formData.category || '',
        memo: formData.memo || '',
        outflow: formData.outflow ? parseFloat(formData.outflow) : 0,
        inflow: formData.inflow ? parseFloat(formData.inflow) : 0,
        cleared: false
      }

      addTransaction(newTransaction)
      
      if (onSave) {
        onSave({
          ...newTransaction,
          id: Math.floor(Math.random() * 1000000)
        })
      }

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        account: "",
        payee: "",
        category: "",
        memo: "",
        outflow: "",
        inflow: "",
        cleared: false
      })
    }, 150)
  }

  const handleCancel = () => {
    setIsExiting(true)
    if (onCancel) {
      setTimeout(onCancel, 150)
    }
  }

  return (
    <form 
      onSubmit={handleSave}
      className={cn(
        "transition-all duration-200 ease-in-out bg-blue-50/50",
        isExiting ? "opacity-0 scale-98 -translate-y-1" : "animate-in slide-in-from-top-2 duration-200"
      )}
    >
      {/* Main Row */}
      <div className="flex h-[42px] border-b border-blue-100 items-center">
        <div className="w-[48px] flex justify-center">
          <Checkbox 
            checked={false}
            onCheckedChange={(checked) => {}}
            disabled
          />
        </div>
        <div className="w-[48px] flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
          >
            <div className="h-2 w-2 rounded-full mx-auto bg-gray-300" />
          </Button>
        </div>
        <div className="w-[12%] px-4">
          <Select
            value={formData.account}
            onValueChange={(value) => setFormData(prev => ({ ...prev, account: value }))}
          >
            <SelectTrigger className="h-8 w-full bg-white/90 hover:bg-white transition-colors">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts?.map((account) => (
                <SelectItem key={account} value={account}>{account}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[10%] px-4">
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
                    setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }))
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
        <div className="w-[15%] px-4">
          <Input
            value={formData.payee}
            onChange={(e) => setFormData(prev => ({ ...prev, payee: e.target.value }))}
            className="h-8 w-full bg-white/90 hover:bg-white transition-colors"
            placeholder="Payee"
          />
        </div>
        <div className="w-[15%] px-4">
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger className="h-8 w-full bg-white/90 hover:bg-white transition-colors">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 px-4">
          <Input
            value={formData.memo}
            onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
            className="h-8 w-full bg-white/90 hover:bg-white transition-colors"
            placeholder="Memo"
          />
        </div>
        <div className="w-[12%] px-4">
          <Input
            type="number"
            value={formData.outflow}
            onChange={(e) => setFormData(prev => ({ ...prev, outflow: e.target.value }))}
            className={cn(
              "h-8 w-full text-right bg-white/90 hover:bg-white transition-colors",
              formData.outflow && "text-red-600"
            )}
            placeholder="0"
          />
        </div>
        <div className="w-[12%] px-4">
          <Input
            type="number"
            value={formData.inflow}
            onChange={(e) => setFormData(prev => ({ ...prev, inflow: e.target.value }))}
            className={cn(
              "h-8 w-full text-right bg-white/90 hover:bg-white transition-colors",
              formData.inflow && "text-green-600"
            )}
            placeholder="0"
          />
        </div>
        <div className="w-[48px]" />
      </div>
      
      {/* Action buttons in a separate row */}
      <div className="flex justify-end py-2 pr-[52px] space-x-2 border-b border-blue-100 animate-in fade-in duration-200">
        <Button
          type="submit"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all"
        >
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="transition-all active:scale-95"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
