import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableCell, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useTransactions } from "@/context/transaction-context"

interface TransactionInputRowProps {
  onSave?: () => void
}

export function TransactionInputRow({ onSave }: TransactionInputRowProps) {
  const { addTransaction } = useTransactions()
  const [isSelected, setIsSelected] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    payee: '',
    category: '',
    memo: '',
    outflow: '',
    inflow: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const transaction = {
      date: formData.date,
      payee: formData.payee,
      category: formData.category,
      memo: formData.memo,
      outflow: parseFloat(formData.outflow) || undefined,
      inflow: parseFloat(formData.inflow) || undefined,
      account: 'Default Account', // You might want to make this dynamic
    }
    
    addTransaction(transaction)
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      payee: '',
      category: '',
      memo: '',
      outflow: '',
      inflow: '',
    })

    // Call onSave if provided
    onSave?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <>
      <TableRow 
        className={cn(
          "h-[42px] transition-all duration-200 data-[state=selected]:bg-muted",
          "bg-blue-50/50 hover:bg-blue-100/50",
          "animate-in fade-in-0 duration-200",
          "border-b-[1.5px] border-gray-200"
        )}
      >
        <TableCell className="py-1 w-[50px]">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => setIsSelected(checked as boolean)}
          />
        </TableCell>
        <TableCell className="py-1 w-[50px] text-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
          >
            <div className="h-2 w-2 rounded-full mx-auto bg-gray-300" />
          </Button>
        </TableCell>
        <TableCell className="py-1 w-[200px]">
          <span className="font-medium whitespace-nowrap">Default Account</span>
        </TableCell>
        <TableCell className="py-1 w-[200px]">
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="h-8 font-medium"
            onKeyDown={handleKeyDown}
          />
        </TableCell>
        <TableCell className="py-1 w-[250px]">
          <Select
            value={formData.payee}
            onValueChange={(value) => handleInputChange('payee', value)}
          >
            <SelectTrigger className="h-8 font-medium">
              <SelectValue placeholder="Select payee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="netflix">Netflix</SelectItem>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="py-1 w-[250px]">
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger className="h-8 font-medium">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="rent">Rent/Mortgage</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="py-1 min-w-[300px]">
          <Input
            placeholder="Memo"
            value={formData.memo}
            onChange={(e) => handleInputChange('memo', e.target.value)}
            className="h-8 font-medium"
            onKeyDown={handleKeyDown}
          />
        </TableCell>
        <TableCell className="py-1 w-[200px]">
          <Input
            type="number"
            placeholder="0.00"
            value={formData.outflow}
            onChange={(e) => handleInputChange('outflow', e.target.value)}
            className="h-8 text-right font-medium"
            onKeyDown={handleKeyDown}
          />
        </TableCell>
        <TableCell className="py-1 w-[200px]">
          <Input
            type="number"
            placeholder="0.00"
            value={formData.inflow}
            onChange={(e) => handleInputChange('inflow', e.target.value)}
            className="h-8 text-right font-medium"
            onKeyDown={handleKeyDown}
          />
        </TableCell>
      </TableRow>
      <TableRow 
        className={cn(
          "border-b-[1.5px] border-gray-200",
          "animate-in fade-in-0 duration-200"
        )}
      >
        <TableCell colSpan={9} className="py-2">
          <div className="flex justify-end gap-2">
            <Button 
              variant="default"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
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
            >
              Save and Add Another
            </Button>
            <Button 
              variant="ghost"
              onClick={() => onSave?.()}
            >
              Cancel
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </>
  )
}
