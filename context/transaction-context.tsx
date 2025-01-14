"use client"

import React, { createContext, useContext } from "react"
import { useHistory, HistoryProvider } from "./history-context"

export interface Transaction {
  id: number
  account: string
  date: string
  payee: string
  category: string
  memo?: string
  outflow?: number
  inflow?: number
  cleared: boolean
}

interface TransactionContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id" | "cleared">) => void
  editTransaction: (id: number, transaction: Omit<Transaction, "id">) => void
  toggleCleared: (id: number) => void
  deleteTransaction: (id: number) => void
  deleteTransactions: (ids: number[]) => void
  toggleClearedBulk: (ids: number[], cleared: boolean) => void
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

const initialTransactions: Transaction[] = [
  {
    id: 1,
    account: "entah",
    date: "2025-01-12",
    payee: "Pembelian Netflix",
    category: "Wants: 🎬 Entertainment",
    memo: "Sering",
    outflow: 500,
    inflow: 0,
    cleared: false
  },
  {
    id: 2,
    account: "entah",
    date: "2025-01-12",
    payee: "Pembelian Air",
    category: "Bills: ⚡ Utilities",
    memo: "Oke",
    outflow: 400,
    inflow: 0,
    cleared: true
  },
]

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const {
    transactions,
    pushHistory
  } = useHistory()

  const addTransaction = (transaction: Omit<Transaction, "id" | "cleared">) => {
    const newTransaction = {
      ...transaction,
      id: Math.max(0, ...transactions.map(t => t.id)) + 1,
      cleared: false
    }
    const newTransactions = [newTransaction, ...transactions]
    pushHistory(newTransactions)
  }

  const editTransaction = (id: number, transaction: Omit<Transaction, "id">) => {
    const newTransactions = transactions.map(t =>
      t.id === id
        ? { ...transaction, id }
        : t
    )
    pushHistory(newTransactions)
  }

  const toggleCleared = (id: number) => {
    const newTransactions = transactions.map(transaction =>
      transaction.id === id
        ? { ...transaction, cleared: !transaction.cleared }
        : transaction
    )
    pushHistory(newTransactions)
  }

  const deleteTransaction = (id: number) => {
    const newTransactions = transactions.filter(transaction => transaction.id !== id)
    pushHistory(newTransactions)
  }

  const deleteTransactions = (ids: number[]) => {
    const newTransactions = transactions.filter(transaction => !ids.includes(transaction.id))
    pushHistory(newTransactions)
  }

  const toggleClearedBulk = (ids: number[], cleared: boolean) => {
    const newTransactions = transactions.map(transaction =>
      ids.includes(transaction.id)
        ? { ...transaction, cleared }
        : transaction
    )
    pushHistory(newTransactions)
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        editTransaction,
        toggleCleared,
        deleteTransaction,
        deleteTransactions,
        toggleClearedBulk
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}

export function RootTransactionProvider({ children }: { children: React.ReactNode }) {
  return (
    <HistoryProvider initialTransactions={initialTransactions}>
      <TransactionProvider>
        {children}
      </TransactionProvider>
    </HistoryProvider>
  )
}
