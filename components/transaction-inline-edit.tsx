"use client"

import { useState } from "react"
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

interface TransactionInlineEditProps {
  transaction: Transaction
  onSave?: (transaction: Transaction) => void
  onCancel?: () => void
}

export function TransactionInlineEdit({
  transaction,
  onSave,
  onCancel,
}: TransactionInlineEditProps) {
  const { editTransaction } = useTransactions()

  const [isExiting, setIsExiting] = useState(false)
  const [formData, setFormData] = useState({
    date: transaction.date,
    account: transaction.account,
    payee: transaction.payee,
    category: transaction.category,
    memo: transaction.memo,
    outflow: transaction.outflow?.toString() || '',
    inflow: transaction.inflow?.toString() || ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsExiting(true)
    // Tunggu animasi selesai sebelum memanggil onSave
    setTimeout(() => {
      const outflow = parseFloat(formData.outflow) || 0
      const inflow = parseFloat(formData.inflow) || 0
      const updatedTransaction: Omit<Transaction, "id"> = {
        date: formData.date,
        account: formData.account,
        payee: formData.payee || 'Need Input',
        category: formData.category || '',
        memo: formData.memo || '',
        outflow: outflow,
        inflow: inflow,
        cleared: transaction.cleared
      }

      editTransaction(transaction.id, updatedTransaction)
      
      if (onSave) {
        onSave({
          ...updatedTransaction,
          id: transaction.id
        })
      }
    }, 150)
  }

  const handleCancel = () => {
    setIsExiting(true)
    // Tunggu animasi selesai sebelum memanggil onCancel
    if (onCancel) {
      setTimeout(onCancel, 150)
    }
  }

  return (
    <form 
      onSubmit={handleSave}
      className={cn(
        "transition-all duration-200 ease-in-out bg-blue-100/50",
        isExiting ? "opacity-0 scale-98 -translate-y-1" : "animate-in slide-in-from-top-2 duration-200"
      )}
    >
      {/* Main Row */}
      <div className="flex h-[42px] border-b border-blue-200 items-center transition-colors duration-200 ease-in-out">
        {/* Checkbox placeholder */}
        <div className="w-[48px] flex justify-center">
          <Checkbox 
            checked={false}
            disabled
            className="w-4 h-4"
          />
        </div>
        {/* Status placeholder */}
        <div className="w-[48px] flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
          >
            <div className={cn(
              "h-2 w-2 rounded-full mx-auto",
              transaction.cleared ? "bg-green-500" : "bg-gray-300"
            )} />
          </Button>
        </div>
        {/* Account */}
        <div className="w-[12%] px-4">
          <Input
            type="text"
            value={formData.account}
            onChange={(e) => handleInputChange('account', e.target.value)}
            placeholder="Account"
            className="h-8 w-full bg-white/90 hover:bg-white transition-colors"
          />
        </div>
        {/* Date */}
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
        {/* Payee */}
        <div className="w-[15%] px-4">
          <Input
            type="text"
            value={formData.payee}
            onChange={(e) => handleInputChange('payee', e.target.value)}
            placeholder="Payee"
            className="h-8 w-full bg-white/90 hover:bg-white transition-colors"
          />
        </div>
        {/* Category */}
        <div className="w-[15%] px-4">
          <Input
            type="text"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            placeholder="Category"
            className="h-8 w-full bg-white/90 hover:bg-white transition-colors"
          />
        </div>
        {/* Memo */}
        <div className="flex-1 px-4">
          <Input
            type="text"
            value={formData.memo}
            onChange={(e) => handleInputChange('memo', e.target.value)}
            placeholder="Memo"
            className="h-8 w-full bg-white/90 hover:bg-white transition-colors"
          />
        </div>
        {/* Outflow */}
        <div className="w-[12%] px-4">
          <Input
            type="number"
            value={formData.outflow}
            onChange={(e) => handleInputChange('outflow', e.target.value)}
            placeholder="0.00"
            className={cn(
              "h-8 text-sm text-right w-full bg-white/90 hover:bg-white transition-colors",
              formData.outflow && "text-red-600"
            )}
          />
        </div>
        {/* Inflow */}
        <div className="w-[12%] px-4">
          <Input
            type="number"
            value={formData.inflow}
            onChange={(e) => handleInputChange('inflow', e.target.value)}
            placeholder="0.00"
            className={cn(
              "h-8 text-sm text-right w-full bg-white/90 hover:bg-white transition-colors",
              formData.inflow && "text-green-600"
            )}
          />
        </div>
        {/* Action buttons placeholder */}
        <div className="w-[48px]" />
      </div>
      
      {/* Action buttons in a separate row */}
      <div className="flex justify-end py-2 pr-[52px] space-x-2 border-b border-blue-200 animate-in fade-in duration-200">
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
