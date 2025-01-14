import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef } from "react"
import { useTransactions } from "@/context/transaction-context"

export function ImportTransactionsDialog() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addTransaction } = useTransactions()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text) return

      try {
        const transactions = parseCSV(text)
        transactions.forEach(transaction => {
          addTransaction(transaction)
        })
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (error) {
        console.error('Error parsing CSV:', error)
        // Handle error appropriately
      }
    }
    reader.readAsText(file)
  }

  const parseCSV = (text: string) => {
    const [headerRow, ...rows] = text.split('\n')
    const headers = headerRow.split(',')
    
    return rows.filter(row => row.trim()).map(row => {
      const values = row.split(',')
      const rowData = headers.reduce((acc, header, index) => {
        acc[header.trim().toLowerCase()] = values[index]?.trim() || ''
        return acc
      }, {} as Record<string, string>)

      const outflowValue = parseFloat(rowData.outflow)
      const inflowValue = parseFloat(rowData.inflow)

      return {
        account: rowData.account || '',
        date: rowData.date || new Date().toISOString().split('T')[0],
        payee: rowData.payee || '',
        category: rowData.category || '',
        memo: rowData.memo || '',
        outflow: isNaN(outflowValue) ? undefined : outflowValue,
        inflow: isNaN(inflowValue) ? undefined : inflowValue,
      }
    })
  }

  return (
    <Dialog>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import transactions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File
            </Label>
            <Input
              id="file"
              type="file"
              accept=".csv"
              className="col-span-3"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => fileInputRef.current?.click()}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
