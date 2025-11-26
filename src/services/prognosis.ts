/**
 * Service for calculating investment prognoses
 */

import { Investment, Prognosis, Projection } from '@/types'

export const prognosisService = {
  /**
   * Calculate future value using compound interest formula
   * FV = PV * (1 + r)^t
   */
  calculateFutureValue(
    currentValue: number,
    annualReturnRate: number,
    years: number
  ): number {
    const rate = annualReturnRate / 100
    return currentValue * Math.pow(1 + rate, years)
  },

  /**
   * Generate prognosis for an investment
   */
  generatePrognosis(investment: Investment): Prognosis {
    const yearsToProject = [1, 5, 10, 20]

    const projections: Projection[] = yearsToProject.map(years => {
      const estimatedValue = this.calculateFutureValue(
        investment.currentValue,
        investment.expectedAnnualReturn,
        years
      )
      const totalReturn = estimatedValue - investment.currentValue
      const percentageGain = (totalReturn / investment.currentValue) * 100

      return {
        years,
        estimatedValue: Math.round(estimatedValue * 100) / 100,
        totalReturn: Math.round(totalReturn * 100) / 100,
        percentageGain: Math.round(percentageGain * 100) / 100
      }
    })

    return {
      investmentId: investment.id,
      projections
    }
  },

  /**
   * Calculate total portfolio value
   */
  calculatePortfolioValue(investments: Investment[]): number {
    return investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  },

  /**
   * Calculate total portfolio return
   */
  calculatePortfolioReturn(investments: Investment[]): number {
    const totalCurrent = this.calculatePortfolioValue(investments)
    const totalInvested = investments.reduce((sum, inv) => sum + inv.purchaseAmount, 0)
    return totalCurrent - totalInvested
  }
}
