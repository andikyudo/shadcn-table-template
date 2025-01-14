"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTransactions, Transaction } from "@/context/transaction-context"

const formSchema = z.object({
  account: z.string({
    required_error: "Please select an account.",
  }),
  date: z.string({
    required_error: "Please select a date.",
  }),
  payee: z.string({
    required_error: "Please enter a payee.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  memo: z.string().optional(),
  outflow: z.string().optional(),
  inflow: z.string().optional(),
}).refine(data => {
  return data.outflow || data.inflow
}, {
  message: "Either outflow or inflow must be provided",
  path: ["outflow"]
}).refine(data => {
  return !(data.outflow && data.inflow)
}, {
  message: "Cannot have both outflow and inflow",
  path: ["outflow"]
})

interface EditTransactionDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTransactionDialog({ 
  transaction, 
  open, 
  onOpenChange 
}: EditTransactionDialogProps) {
  const { editTransaction } = useTransactions()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: "",
      date: "",
      payee: "",
      category: "",
      memo: "",
      outflow: "",
      inflow: "",
    },
  })

  // Reset form when transaction changes
  React.useEffect(() => {
    if (transaction) {
      form.reset({
        account: transaction.account || "",
        date: transaction.date || "",
        payee: transaction.payee || "",
        category: transaction.category || "",
        memo: transaction.memo || "",
        outflow: transaction.outflow?.toString() || "",
        inflow: transaction.inflow?.toString() || "",
      })
    }
  }, [transaction, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!transaction) return

    editTransaction(transaction.id, {
      account: values.account,
      date: values.date,
      payee: values.payee,
      category: values.category,
      memo: values.memo || "",
      outflow: values.outflow ? parseFloat(values.outflow) : undefined,
      inflow: values.inflow ? parseFloat(values.inflow) : undefined,
      cleared: transaction.cleared,
    })
    onOpenChange(false)
  }

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Edit the details of this transaction.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entah">Entah</SelectItem>
                      <SelectItem value="oke-ini">Oke ini</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payee</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter payee name" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
                      <SelectItem value="utilities">⚡ Utilities</SelectItem>
                      <SelectItem value="phone">📱 Phone</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Add a memo (optional)" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="outflow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outflow</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Rp0" 
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e)
                          if (e.target.value) {
                            form.setValue("inflow", "")
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inflow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inflow</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Rp0" 
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e)
                          if (e.target.value) {
                            form.setValue("outflow", "")
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
