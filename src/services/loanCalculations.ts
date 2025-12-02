/**
 * Loan calculation service
 * Handles annuity and serial loan payment calculations
 */

import { Loan, LoanPayment, LoanProjection } from '@/types'

/**
 * Calculate monthly payment for an annuity loan
 * Formula: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where: P = principal, r = monthly rate, n = number of payments
 */
export function calculateAnnuityMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (termMonths <= 0) return 0
  if (annualRate === 0) return principal / termMonths

  const monthlyRate = annualRate / 100 / 12
  const payment = principal *
    (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)

  return payment
}

/**
 * Calculate monthly principal for a serial loan
 * In serial loans, principal is constant each month
 */
export function calculateSerialMonthlyPrincipal(
  principal: number,
  termMonths: number
): number {
  if (termMonths <= 0) return 0
  return principal / termMonths
}

/**
 * Generate full amortization schedule for a loan
 * @param interestRateOverride - Optional interest rate to use instead of the loan's actual rate
 */
export function generateAmortizationSchedule(
  loan: Loan,
  interestRateOverride?: number | null
): LoanPayment[] {
  const effectiveRate = interestRateOverride ?? loan.interestRate
  const schedule: LoanPayment[] = []
  const monthlyRate = effectiveRate / 100 / 12
  let balance = loan.loanAmount

  if (loan.repaymentType === 'annuity') {
    const monthlyPayment = calculateAnnuityMonthlyPayment(
      loan.loanAmount,
      effectiveRate,
      loan.termMonths
    )

    for (let month = 1; month <= loan.termMonths; month++) {
      const interest = balance * monthlyRate
      const principal = monthlyPayment - interest
      balance = Math.max(0, balance - principal)

      schedule.push({
        month,
        payment: monthlyPayment,
        principal,
        interest,
        remainingBalance: balance,
      })
    }
  } else {
    // Serial loan
    const monthlyPrincipal = calculateSerialMonthlyPrincipal(
      loan.loanAmount,
      loan.termMonths
    )

    for (let month = 1; month <= loan.termMonths; month++) {
      const interest = balance * monthlyRate
      const payment = monthlyPrincipal + interest
      balance = Math.max(0, balance - monthlyPrincipal)

      schedule.push({
        month,
        payment,
        principal: monthlyPrincipal,
        interest,
        remainingBalance: balance,
      })
    }
  }

  return schedule
}

/**
 * Calculate current remaining balance based on months paid
 */
export function calculateCurrentBalance(loan: Loan): number {
  const startDate = new Date(loan.startDate)
  const now = new Date()
  const monthsPassed = Math.max(0, Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  ))

  // If loan hasn't started yet, return full amount
  if (monthsPassed <= 0) return loan.loanAmount

  // If loan is paid off, return 0
  if (monthsPassed >= loan.termMonths) return 0

  const schedule = generateAmortizationSchedule(loan)
  return schedule[Math.min(monthsPassed - 1, schedule.length - 1)]?.remainingBalance ?? 0
}

/**
 * Calculate remaining balance at a future point in time
 */
export function calculateBalanceAtDate(loan: Loan, targetDate: Date): number {
  const startDate = new Date(loan.startDate)
  const monthsFromStart = Math.max(0, Math.floor(
    (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  ))

  // If before loan start, return full amount
  if (monthsFromStart <= 0) return loan.loanAmount

  // If loan is paid off, return 0
  if (monthsFromStart >= loan.termMonths) return 0

  const schedule = generateAmortizationSchedule(loan)
  return schedule[Math.min(monthsFromStart - 1, schedule.length - 1)]?.remainingBalance ?? 0
}

/**
 * Calculate remaining balance after N years from now
 */
export function calculateBalanceAfterYears(loan: Loan, years: number): number {
  const targetDate = new Date()
  targetDate.setFullYear(targetDate.getFullYear() + years)
  return calculateBalanceAtDate(loan, targetDate)
}

/**
 * Generate loan projections for multiple years
 */
export function generateLoanProjections(
  loan: Loan,
  years: number[] = [1, 5, 10, 20]
): LoanProjection[] {
  const schedule = generateAmortizationSchedule(loan)
  const startDate = new Date(loan.startDate)
  const now = new Date()

  // Calculate current month position in schedule
  const currentMonthsFromStart = Math.max(0, Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  ))

  return years.map(year => {
    const monthsFromNow = year * 12
    const targetMonthInSchedule = currentMonthsFromStart + monthsFromNow

    // If past the loan term, it's fully paid
    if (targetMonthInSchedule >= loan.termMonths) {
      const totalInterest = schedule.reduce((sum, p) => sum + p.interest, 0)
      return {
        year,
        remainingBalance: 0,
        totalPrincipalPaid: loan.loanAmount,
        totalInterestPaid: totalInterest,
      }
    }

    // Sum up principal and interest paid up to target month
    const paymentsUpToTarget = schedule.slice(0, targetMonthInSchedule)
    const totalPrincipalPaid = paymentsUpToTarget.reduce((sum, p) => sum + p.principal, 0)
    const totalInterestPaid = paymentsUpToTarget.reduce((sum, p) => sum + p.interest, 0)
    const remainingBalance = schedule[targetMonthInSchedule - 1]?.remainingBalance ?? loan.loanAmount

    return {
      year,
      remainingBalance,
      totalPrincipalPaid,
      totalInterestPaid,
    }
  })
}

/**
 * Get the current monthly payment for a loan
 */
export function getCurrentMonthlyPayment(loan: Loan): number {
  if (loan.repaymentType === 'annuity') {
    return calculateAnnuityMonthlyPayment(
      loan.loanAmount,
      loan.interestRate,
      loan.termMonths
    )
  } else {
    // For serial loans, we need current balance for interest calculation
    const monthlyPrincipal = calculateSerialMonthlyPrincipal(
      loan.loanAmount,
      loan.termMonths
    )
    const monthlyRate = loan.interestRate / 100 / 12
    const currentBalance = loan.remainingBalance
    const interest = currentBalance * monthlyRate
    return monthlyPrincipal + interest
  }
}

/**
 * Get monthly installment (principal only) for display
 */
export function getMonthlyInstallment(loan: Loan): number {
  if (loan.repaymentType === 'annuity') {
    // For annuity, calculate current principal portion
    const monthlyRate = loan.interestRate / 100 / 12
    const monthlyPayment = calculateAnnuityMonthlyPayment(
      loan.loanAmount,
      loan.interestRate,
      loan.termMonths
    )
    const interest = loan.remainingBalance * monthlyRate
    return monthlyPayment - interest
  } else {
    // For serial, principal is constant
    return calculateSerialMonthlyPrincipal(loan.loanAmount, loan.termMonths)
  }
}
