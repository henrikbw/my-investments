/**
 * Portfolio Context - Global state management for investments and loans
 * Uses useReducer for complex state logic
 */

import React, { createContext, useReducer, useEffect, ReactNode } from 'react'
import { Investment, Loan, PortfolioState, PortfolioAction } from '@/types'
import { storageService } from '@/services/storage'

// Initial state
const initialState: PortfolioState = {
  investments: [],
  loans: [],
  loading: true,
  error: null,
}

// Reducer function
function portfolioReducer(
  state: PortfolioState,
  action: PortfolioAction
): PortfolioState {
  switch (action.type) {
    case 'SET_INVESTMENTS':
      return {
        ...state,
        investments: action.payload,
        loading: false,
      }

    case 'ADD_INVESTMENT':
      return {
        ...state,
        investments: [...state.investments, action.payload],
      }

    case 'UPDATE_INVESTMENT': {
      const { id, updates } = action.payload
      return {
        ...state,
        investments: state.investments.map((inv) =>
          inv.id === id
            ? ({ ...inv, ...updates, updatedAt: new Date().toISOString() } as Investment)
            : inv
        ),
      }
    }

    case 'DELETE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.filter((inv) => inv.id !== action.payload),
      }

    case 'SET_LOANS':
      return {
        ...state,
        loans: action.payload,
      }

    case 'ADD_LOAN':
      return {
        ...state,
        loans: [...state.loans, action.payload],
      }

    case 'UPDATE_LOAN': {
      const { id, updates } = action.payload
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === id
            ? ({ ...loan, ...updates, updatedAt: new Date().toISOString() } as Loan)
            : loan
        ),
      }
    }

    case 'DELETE_LOAN':
      return {
        ...state,
        loans: state.loans.filter((loan) => loan.id !== action.payload),
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    default:
      return state
  }
}

// Context interface
interface PortfolioContextValue {
  state: PortfolioState
  dispatch: React.Dispatch<PortfolioAction>
  addInvestment: (investment: Investment) => void
  updateInvestment: (id: string, updates: Partial<Investment>) => void
  deleteInvestment: (id: string) => void
  addLoan: (loan: Loan) => void
  updateLoan: (id: string, updates: Partial<Loan>) => void
  deleteLoan: (id: string) => void
}

// Create context
export const PortfolioContext = createContext<PortfolioContextValue | undefined>(
  undefined
)

// Provider component
interface PortfolioProviderProps {
  children: ReactNode
}

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState)

  // Load investments and loans from localStorage on mount
  useEffect(() => {
    try {
      const investments = storageService.getInvestments()
      const loans = storageService.getLoans()
      dispatch({ type: 'SET_INVESTMENTS', payload: investments })
      dispatch({ type: 'SET_LOANS', payload: loans })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' })
    }
  }, [])

  // Sync investments to localStorage whenever they change
  useEffect(() => {
    if (!state.loading) {
      storageService.saveInvestments(state.investments)
    }
  }, [state.investments, state.loading])

  // Sync loans to localStorage whenever they change
  useEffect(() => {
    if (!state.loading) {
      storageService.saveLoans(state.loans)
    }
  }, [state.loans, state.loading])

  // Investment helper functions
  const addInvestment = (investment: Investment) => {
    const now = new Date().toISOString()
    const newInvestment = {
      ...investment,
      createdAt: now,
      updatedAt: now,
    }
    dispatch({ type: 'ADD_INVESTMENT', payload: newInvestment })
  }

  const updateInvestment = (id: string, updates: Partial<Investment>) => {
    dispatch({ type: 'UPDATE_INVESTMENT', payload: { id, updates } })
  }

  const deleteInvestment = (id: string) => {
    dispatch({ type: 'DELETE_INVESTMENT', payload: id })
  }

  // Loan helper functions
  const addLoan = (loan: Loan) => {
    const now = new Date().toISOString()
    const newLoan = {
      ...loan,
      createdAt: now,
      updatedAt: now,
    }
    dispatch({ type: 'ADD_LOAN', payload: newLoan })
  }

  const updateLoan = (id: string, updates: Partial<Loan>) => {
    dispatch({ type: 'UPDATE_LOAN', payload: { id, updates } })
  }

  const deleteLoan = (id: string) => {
    dispatch({ type: 'DELETE_LOAN', payload: id })
  }

  const value: PortfolioContextValue = {
    state,
    dispatch,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addLoan,
    updateLoan,
    deleteLoan,
  }

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}
