/**
 * LocalStorage service for persisting investment and loan data
 */

import { Investment, Loan } from '@/types'
import { STORAGE_KEY, LOANS_STORAGE_KEY } from '@/constants/defaults'

export const storageService = {
  /**
   * Get all investments from localStorage
   */
  getInvestments(): Investment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return []

      const investments = JSON.parse(data)
      return investments as Investment[]
    } catch (error) {
      console.error('Error loading investments from storage:', error)
      return []
    }
  },

  /**
   * Save all investments to localStorage
   */
  saveInvestments(investments: Investment[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(investments))
    } catch (error) {
      console.error('Error saving investments to storage:', error)
    }
  },

  /**
   * Add a new investment
   */
  addInvestment(investment: Investment): Investment[] {
    const investments = this.getInvestments()
    const now = new Date().toISOString()
    const newInvestment = {
      ...investment,
      createdAt: now,
      updatedAt: now,
    }
    investments.push(newInvestment)
    this.saveInvestments(investments)
    return investments
  },

  /**
   * Update an existing investment
   */
  updateInvestment(id: string, updates: Partial<Investment>): Investment[] {
    const investments = this.getInvestments()
    const index = investments.findIndex((inv) => inv.id === id)

    if (index !== -1) {
      investments[index] = {
        ...investments[index],
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
      } as Investment
      this.saveInvestments(investments)
    }

    return investments
  },

  /**
   * Delete an investment
   */
  deleteInvestment(id: string): Investment[] {
    const investments = this.getInvestments()
    const filtered = investments.filter((inv) => inv.id !== id)
    this.saveInvestments(filtered)
    return filtered
  },

  /**
   * Get all loans from localStorage
   */
  getLoans(): Loan[] {
    try {
      const data = localStorage.getItem(LOANS_STORAGE_KEY)
      if (!data) return []

      const loans = JSON.parse(data)
      return loans as Loan[]
    } catch (error) {
      console.error('Error loading loans from storage:', error)
      return []
    }
  },

  /**
   * Save all loans to localStorage
   */
  saveLoans(loans: Loan[]): void {
    try {
      localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(loans))
    } catch (error) {
      console.error('Error saving loans to storage:', error)
    }
  },

  /**
   * Add a new loan
   */
  addLoan(loan: Loan): Loan[] {
    const loans = this.getLoans()
    const now = new Date().toISOString()
    const newLoan = {
      ...loan,
      createdAt: now,
      updatedAt: now,
    }
    loans.push(newLoan)
    this.saveLoans(loans)
    return loans
  },

  /**
   * Update an existing loan
   */
  updateLoan(id: string, updates: Partial<Loan>): Loan[] {
    const loans = this.getLoans()
    const index = loans.findIndex((loan) => loan.id === id)

    if (index !== -1) {
      loans[index] = {
        ...loans[index],
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
      } as Loan
      this.saveLoans(loans)
    }

    return loans
  },

  /**
   * Delete a loan
   */
  deleteLoan(id: string): Loan[] {
    const loans = this.getLoans()
    const filtered = loans.filter((loan) => loan.id !== id)
    this.saveLoans(filtered)
    return filtered
  },

  /**
   * Clear all data (useful for testing)
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LOANS_STORAGE_KEY)
  },
}
