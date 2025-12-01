/**
 * Loan type definitions
 * Loans can be linked to assets to calculate equity
 */

export type LoanType = 'mortgage' | 'student' | 'car' | 'personal' | 'other'
export type RepaymentType = 'annuity' | 'serial'

export interface BaseLoan {
  id: string
  name: string
  loanAmount: number          // Original loan amount
  remainingBalance: number    // Current remaining balance
  interestRate: number        // Annual interest rate as percentage (e.g., 3.5 for 3.5%)
  startDate: string           // ISO date string when loan started
  termMonths: number          // Total loan term in months
  repaymentType: RepaymentType // Annuity or serial loan
  linkedAssetId?: string      // Optional link to an investment/asset
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface MortgageLoan extends BaseLoan {
  type: 'mortgage'
}

export interface StudentLoan extends BaseLoan {
  type: 'student'
}

export interface CarLoan extends BaseLoan {
  type: 'car'
}

export interface PersonalLoan extends BaseLoan {
  type: 'personal'
}

export interface OtherLoan extends BaseLoan {
  type: 'other'
}

export type Loan = MortgageLoan | StudentLoan | CarLoan | PersonalLoan | OtherLoan

/**
 * Loan payment calculation result
 */
export interface LoanPayment {
  month: number
  payment: number           // Total monthly payment
  principal: number         // Principal portion of payment
  interest: number          // Interest portion of payment
  remainingBalance: number  // Balance after this payment
}

/**
 * Loan projection for a specific point in time
 */
export interface LoanProjection {
  year: number
  remainingBalance: number
  totalPrincipalPaid: number
  totalInterestPaid: number
}

/**
 * Equity calculation for an asset with linked loan
 */
export interface EquityData {
  assetId: string
  assetName: string
  assetValue: number
  linkedLoans: {
    loanId: string
    loanName: string
    remainingBalance: number
  }[]
  totalLoanBalance: number
  equity: number
  equityPercentage: number
}
