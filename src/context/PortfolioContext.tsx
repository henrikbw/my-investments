/**
 * Portfolio Context - Global state management for investments
 * Uses useReducer for complex state logic
 */

import React, { createContext, useReducer, useEffect, ReactNode } from 'react'
import { Investment, PortfolioState, PortfolioAction } from '@/types'
import { storageService } from '@/services/storage'

// Initial state
const initialState: PortfolioState = {
  investments: [],
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

  // Load investments from localStorage on mount
  useEffect(() => {
    try {
      const investments = storageService.getInvestments()
      dispatch({ type: 'SET_INVESTMENTS', payload: investments })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load investments' })
    }
  }, [])

  // Sync to localStorage whenever investments change
  useEffect(() => {
    if (!state.loading) {
      storageService.saveInvestments(state.investments)
    }
  }, [state.investments, state.loading])

  // Helper functions
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

  const value: PortfolioContextValue = {
    state,
    dispatch,
    addInvestment,
    updateInvestment,
    deleteInvestment,
  }

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}
