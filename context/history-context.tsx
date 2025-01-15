"use client"

import React, { createContext, useContext, useReducer, useCallback } from "react"
import { Transaction, initialTransactions } from "./transaction-context"

type HistoryState = {
  past: Transaction[][]
  present: Transaction[]
  future: Transaction[][]
}

type HistoryAction =
  | { type: "PUSH"; newPresent: Transaction[] }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "CLEAR" }

const HISTORY_LIMIT = 10

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  const { past, present, future } = state

  switch (action.type) {
    case "PUSH":
      if (JSON.stringify(present) === JSON.stringify(action.newPresent)) {
        return state
      }
      return {
        past: [...past, present].slice(-HISTORY_LIMIT),
        present: action.newPresent,
        future: []
      }
    case "UNDO": {
      if (past.length === 0) return state

      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)

      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      }
    }
    case "REDO": {
      if (future.length === 0) return state

      const next = future[0]
      const newFuture = future.slice(1)

      return {
        past: [...past, present],
        present: next,
        future: newFuture
      }
    }
    case "CLEAR":
      return {
        past: [],
        present: initialTransactions,
        future: []
      }
    default:
      return state
  }
}

interface HistoryContextType {
  transactions: Transaction[]
  canUndo: boolean
  canRedo: boolean
  pushHistory: (transactions: Transaction[]) => void
  undo: () => void
  redo: () => void
  clearHistory: () => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialTransactions,
    future: []
  })

  const pushHistory = useCallback((newPresent: Transaction[]) => {
    dispatch({ type: "PUSH", newPresent })
  }, [])

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: "REDO" })
  }, [])

  const clearHistory = useCallback(() => {
    dispatch({ type: "CLEAR" })
  }, [])

  const value = {
    transactions: state.present,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    pushHistory,
    undo,
    redo,
    clearHistory
  }

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider')
  }
  return context
}
