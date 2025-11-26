/**
 * LocalStorage service for persisting investment data
 */

import { Investment } from '@/types'

const STORAGE_KEY = 'my-investments-data'

export const storageService = {
  getInvestments(): Investment[] {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const investments = JSON.parse(data)
    // Convert date strings back to Date objects
    return investments.map((inv: Investment) => ({
      ...inv,
      purchaseDate: new Date(inv.purchaseDate)
    }))
  },

  saveInvestments(investments: Investment[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(investments))
  },

  addInvestment(investment: Investment): void {
    const investments = this.getInvestments()
    investments.push(investment)
    this.saveInvestments(investments)
  },

  updateInvestment(id: string, updates: Partial<Investment>): void {
    const investments = this.getInvestments()
    const index = investments.findIndex(inv => inv.id === id)
    if (index !== -1) {
      investments[index] = { ...investments[index], ...updates }
      this.saveInvestments(investments)
    }
  },

  deleteInvestment(id: string): void {
    const investments = this.getInvestments()
    const filtered = investments.filter(inv => inv.id !== id)
    this.saveInvestments(filtered)
  }
}
