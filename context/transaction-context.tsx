"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
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
  accounts: string[]
  categories: string[]
  addTransaction: (transaction: Omit<Transaction, "id" | "cleared">) => void
  editTransaction: (id: number, transaction: Omit<Transaction, "id">) => void
  toggleCleared: (id: number) => void
  deleteTransaction: (id: number) => void
  deleteTransactions: (ids: number[]) => void
  toggleClearedBulk: (ids: number[], cleared: boolean) => void
  reorderTransaction: (fromIndex: number, toIndex: number) => void
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

const accounts = [
  "Cash",
  "Bank BCA",
  "Bank Mandiri",
  "Bank BNI",
  "E-Wallet"
]

const categories = [
  "Needs: 🍚 Food",
  "Needs: 🏠 Housing",
  "Needs: 🚗 Transportation",
  "Needs: 👕 Clothing",
  "Needs: 💊 Healthcare",
  "Bills: ⚡ Utilities",
  "Bills: 📱 Phone",
  "Bills: 🌐 Internet",
  "Bills: 📺 Streaming",
  "Wants: 🎬 Entertainment",
  "Wants: 🎮 Gaming",
  "Wants: 🛍️ Shopping",
  "Wants: 🍽️ Dining Out",
  "Savings: 💰 Emergency Fund",
  "Savings: 🎯 Goals",
  "Income: 💼 Salary",
  "Income: 💸 Freelance",
  "Income: 📈 Investment"
]

export const initialTransactions: Transaction[] = [
  {
    id: 1,
    account: "Bank BCA",
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
    account: "Bank Mandiri",
    date: "2025-01-12",
    payee: "Pembelian Air",
    category: "Bills: ⚡ Utilities",
    memo: "Oke",
    outflow: 400,
    inflow: 0,
    cleared: true
  }
]

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const { transactions, pushHistory } = useHistory()
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([])

  // Sync with history on mount
  useEffect(() => {
    if (transactions.length === 0) {
      pushHistory(initialTransactions)
    } else {
      setLocalTransactions(transactions)
    }
  }, [transactions, pushHistory])

  const addTransaction = (transaction: Omit<Transaction, "id" | "cleared">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.floor(Math.random() * 1000000),
      cleared: false
    }
    
    // Add new transaction at the beginning of the array
    const newTransactions = [newTransaction, ...localTransactions]
    setLocalTransactions(newTransactions)
    pushHistory(newTransactions)
  }

  const editTransaction = (id: number, transaction: Omit<Transaction, "id">) => {
    const newTransactions = localTransactions.map(t => 
      t.id === id ? { ...transaction, id } : t
    )
    setLocalTransactions(newTransactions)
    pushHistory(newTransactions)
  }

  const toggleCleared = (id: number) => {
    const newTransactions = localTransactions.map(t => 
      t.id === id ? { ...t, cleared: !t.cleared } : t
    )
    setLocalTransactions(newTransactions)
    pushHistory(newTransactions)
  }

  const deleteTransaction = (id: number) => {
    const newTransactions = localTransactions.filter(t => t.id !== id)
    setLocalTransactions(newTransactions)
    pushHistory(newTransactions)
  }

  const deleteTransactions = (ids: number[]) => {
    const newTransactions = localTransactions.filter(t => !ids.includes(t.id))
    setLocalTransactions(newTransactions)
    pushHistory(newTransactions)
  }

  const toggleClearedBulk = (ids: number[], cleared: boolean) => {
    const newTransactions = localTransactions.map(t => 
      ids.includes(t.id) ? { ...t, cleared } : t
    )
    setLocalTransactions(newTransactions)
    pushHistory(newTransactions)
  }

  const reorderTransaction = (fromIndex: number, toIndex: number) => {
    const newTransactions = [...localTransactions];
    const [movedItem] = newTransactions.splice(fromIndex, 1);
    newTransactions.splice(toIndex, 0, movedItem);
    setLocalTransactions(newTransactions);
    pushHistory(newTransactions);
  };

  return (
    <TransactionContext.Provider value={{
      transactions: localTransactions,
      accounts,
      categories,
      addTransaction,
      editTransaction,
      toggleCleared,
      deleteTransaction,
      deleteTransactions,
      toggleClearedBulk,
      reorderTransaction
    }}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider')
  }
  return context
}

export function RootTransactionProvider({ children }: { children: React.ReactNode }) {
  return (
    <HistoryProvider>
      <TransactionProvider>
        {children}
      </TransactionProvider>
    </HistoryProvider>
  )
}
