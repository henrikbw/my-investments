/**
 * LocalStorage service for persisting investment data
 */

import { Investment } from '@/types'
import { STORAGE_KEY } from '@/constants/defaults'

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
   * Clear all investments (useful for testing)
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY)
  },
}
