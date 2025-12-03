/**
 * FIRE (Financial Independence, Retire Early) calculation service
 * Calculates passive income from investments vs expenses from loans
 */

import {
  Investment,
  Loan,
  FIREChartDataPoint,
  FIRESummary,
  FIRESettings,
  DEFAULT_FIRE_SETTINGS,
} from '@/types'
import { calculateFutureValue, calculateCurrentValue } from './calculations'
import {
  generateAmortizationSchedule,
  calculateAnnuityMonthlyPayment,
} from './loanCalculations'

/**
 * Refinancing term in months (30 years)
 */
const REFINANCING_TERM_MONTHS = 360

/**
 * Calculate monthly passive income from a single investment
 * - Real Estate: Uses actual monthlyRentalIncome field (0 if not set)
 * - Others: Uses percentage of current value / 12
 */
export function calculateMonthlyIncome(
  investment: Investment,
  settings: FIRESettings = DEFAULT_FIRE_SETTINGS
): number {
  // Real estate only generates income from actual rental income
  if (investment.type === 'real-estate') {
    return investment.monthlyRentalIncome ?? 0
  }

  const annualRate = settings.passiveIncomeRates[investment.type] / 100
  const currentValue = calculateCurrentValue(investment)
  return (currentValue * annualRate) / 12
}

/**
 * Calculate monthly passive income from projected investment value
 */
export function calculateProjectedMonthlyIncome(
  investment: Investment,
  years: number,
  settings: FIRESettings = DEFAULT_FIRE_SETTINGS
): number {
  // Real estate only generates income from actual rental income
  if (investment.type === 'real-estate') {
    const rentalIncome = investment.monthlyRentalIncome ?? 0
    if (rentalIncome === 0) return 0

    // Apply rental income yearly increase rate
    const annualIncrease = settings.rentalIncomeYearlyIncrease / 100
    const growthFactor = Math.pow(1 + annualIncrease, years)
    return rentalIncome * growthFactor
  }

  const futureValue = calculateFutureValue(investment, years)
  const annualRate = settings.passiveIncomeRates[investment.type] / 100
  return (futureValue * annualRate) / 12
}

/**
 * Calculate current monthly loan payment (interest + principal)
 */
export function calculateCurrentLoanPayment(
  loan: Loan,
  interestRateOverride?: number | null
): {
  total: number
  interest: number
  principal: number
} {
  const schedule = generateAmortizationSchedule(loan, interestRateOverride)
  const startDate = new Date(loan.startDate)
  const now = new Date()

  const monthsPassed = Math.max(
    0,
    Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    )
  )

  // If loan hasn't started yet, return first payment
  if (monthsPassed <= 0 && schedule.length > 0) {
    return {
      total: schedule[0].payment,
      interest: schedule[0].interest,
      principal: schedule[0].principal,
    }
  }

  // If loan is paid off, return 0
  if (monthsPassed >= loan.termMonths) {
    return { total: 0, interest: 0, principal: 0 }
  }

  // Return current month's payment
  const currentPayment = schedule[Math.min(monthsPassed, schedule.length - 1)]
  return {
    total: currentPayment?.payment ?? 0,
    interest: currentPayment?.interest ?? 0,
    principal: currentPayment?.principal ?? 0,
  }
}

/**
 * Calculate the remaining balance of a loan at a given month from now
 */
function getLoanBalanceAtMonth(
  loan: Loan,
  monthsFromNow: number,
  interestRateOverride?: number | null
): number {
  const schedule = generateAmortizationSchedule(loan, interestRateOverride)
  const startDate = new Date(loan.startDate)
  const now = new Date()

  const currentMonthsPassed = Math.max(
    0,
    Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    )
  )

  const targetMonth = currentMonthsPassed + monthsFromNow

  // If loan hasn't started yet, return full amount
  if (targetMonth <= 0) return loan.loanAmount

  // If loan is paid off, return 0
  if (targetMonth >= loan.termMonths) return 0

  // Get balance at target month (using month - 1 as schedule is 0-indexed after first payment)
  return schedule[Math.min(targetMonth - 1, schedule.length - 1)]?.remainingBalance ?? 0
}

/**
 * Calculate refinanced loan payment based on remaining balance
 * Uses the remaining balance at the given point in time with a new 30-year term
 */
function calculateRefinancedPayment(
  loan: Loan,
  monthsFromNow: number,
  interestRateOverride?: number | null
): { total: number; interest: number; principal: number } {
  const effectiveRate = interestRateOverride ?? loan.interestRate
  const remainingBalance = getLoanBalanceAtMonth(loan, monthsFromNow, interestRateOverride)

  // If loan is paid off, return 0
  if (remainingBalance <= 0) {
    return { total: 0, interest: 0, principal: 0 }
  }

  // Calculate new monthly payment with 30-year refinancing term
  const monthlyPayment = calculateAnnuityMonthlyPayment(
    remainingBalance,
    effectiveRate,
    REFINANCING_TERM_MONTHS
  )

  // Calculate interest and principal portions
  const monthlyRate = effectiveRate / 100 / 12
  const interest = remainingBalance * monthlyRate
  const principal = monthlyPayment - interest

  return {
    total: monthlyPayment,
    interest,
    principal,
  }
}

/**
 * Calculate loan payment at a specific month from now
 * If refinancing is enabled and loan is marked as refinanceable, use refinanced calculation
 */
export function calculateLoanPaymentAtMonth(
  loan: Loan,
  monthsFromNow: number,
  interestRateOverride?: number | null,
  useRefinancing: boolean = false
): { total: number; interest: number; principal: number } {
  // If refinancing is enabled and loan can be refinanced, use refinanced calculation
  if (useRefinancing && loan.canBeRefinanced) {
    return calculateRefinancedPayment(loan, monthsFromNow, interestRateOverride)
  }

  const schedule = generateAmortizationSchedule(loan, interestRateOverride)
  const startDate = new Date(loan.startDate)
  const now = new Date()

  const currentMonthsPassed = Math.max(
    0,
    Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    )
  )

  const targetMonth = currentMonthsPassed + monthsFromNow

  // If loan will be paid off, return 0
  if (targetMonth >= loan.termMonths) {
    return { total: 0, interest: 0, principal: 0 }
  }

  // If before loan start, return first payment
  if (targetMonth < 0 && schedule.length > 0) {
    return {
      total: schedule[0].payment,
      interest: schedule[0].interest,
      principal: schedule[0].principal,
    }
  }

  const payment = schedule[Math.min(targetMonth, schedule.length - 1)]
  return {
    total: payment?.payment ?? 0,
    interest: payment?.interest ?? 0,
    principal: payment?.principal ?? 0,
  }
}

/**
 * Calculate total monthly expenses from all loans at a given point in time
 */
function calculateTotalLoanExpenses(
  loans: Loan[],
  monthsFromNow: number = 0,
  interestRateOverride?: number | null,
  useRefinancing: boolean = false
): { total: number; interest: number; principal: number } {
  return loans.reduce(
    (acc, loan) => {
      const payment = calculateLoanPaymentAtMonth(
        loan,
        monthsFromNow,
        interestRateOverride,
        useRefinancing
      )
      return {
        total: acc.total + payment.total,
        interest: acc.interest + payment.interest,
        principal: acc.principal + payment.principal,
      }
    },
    { total: 0, interest: 0, principal: 0 }
  )
}

/**
 * Calculate total monthly income from all investments at a given year
 */
function calculateTotalMonthlyIncomeAtYear(
  investments: Investment[],
  years: number,
  settings: FIRESettings = DEFAULT_FIRE_SETTINGS
): {
  total: number
  byType: {
    realEstate: number
    funds: number
    stocks: number
    crypto: number
  }
} {
  const byType = {
    realEstate: 0,
    funds: 0,
    stocks: 0,
    crypto: 0,
  }

  investments.forEach((inv) => {
    const income = calculateProjectedMonthlyIncome(inv, years, settings)
    switch (inv.type) {
      case 'real-estate':
        byType.realEstate += income
        break
      case 'fund':
        byType.funds += income
        break
      case 'stock':
        byType.stocks += income
        break
      case 'crypto':
        byType.crypto += income
        break
    }
  })

  return {
    total: byType.realEstate + byType.funds + byType.stocks + byType.crypto,
    byType,
  }
}

/**
 * Calculate net worth (total assets - total loan balances)
 */
function calculateNetWorth(
  investments: Investment[],
  loans: Loan[],
  years: number
): number {
  const totalAssets = investments.reduce(
    (sum, inv) => sum + calculateFutureValue(inv, years),
    0
  )

  const totalLoans = loans.reduce((sum, loan) => {
    const schedule = generateAmortizationSchedule(loan)
    const startDate = new Date(loan.startDate)
    const now = new Date()
    const currentMonthsPassed = Math.max(
      0,
      Math.floor(
        (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
      )
    )
    const targetMonth = currentMonthsPassed + years * 12

    if (targetMonth >= loan.termMonths) return sum
    const balance =
      schedule[Math.min(targetMonth, schedule.length - 1)]?.remainingBalance ??
      0
    return sum + balance
  }, 0)

  return totalAssets - totalLoans
}

/**
 * Generate FIRE chart data showing income vs expenses over time
 */
export function prepareFIREChartData(
  investments: Investment[],
  loans: Loan[],
  maxYears: number = 30,
  settings: FIRESettings = DEFAULT_FIRE_SETTINGS
): FIREChartDataPoint[] {
  const currentYear = new Date().getFullYear()
  const data: FIREChartDataPoint[] = []
  const requiredExpenses = settings.monthlyRequiredExpenses
  const useRefinancing = settings.refinancingEnabled

  for (let year = 0; year <= maxYears; year++) {
    const monthsFromNow = year * 12
    const income = calculateTotalMonthlyIncomeAtYear(investments, year, settings)
    const loanExpenses = calculateTotalLoanExpenses(
      loans,
      monthsFromNow,
      settings.interestRateOverride,
      useRefinancing
    )
    const netWorth = calculateNetWorth(investments, loans, year)
    const totalExpenses = loanExpenses.total + requiredExpenses

    data.push({
      year,
      actualYear: currentYear + year,
      label: (currentYear + year).toString(),
      monthlyIncome: Math.round(income.total * 100) / 100,
      monthlyExpenses: Math.round(totalExpenses * 100) / 100,
      surplus: Math.round((income.total - totalExpenses) * 100) / 100,
      netWorth: Math.round(netWorth * 100) / 100,
      incomeFromRealEstate: Math.round(income.byType.realEstate * 100) / 100,
      incomeFromFunds: Math.round(income.byType.funds * 100) / 100,
      incomeFromStocks: Math.round(income.byType.stocks * 100) / 100,
      incomeFromCrypto: Math.round(income.byType.crypto * 100) / 100,
      loanInterest: Math.round(loanExpenses.interest * 100) / 100,
      loanPrincipal: Math.round(loanExpenses.principal * 100) / 100,
      requiredExpenses: Math.round(requiredExpenses * 100) / 100,
    })
  }

  return data
}

/**
 * Calculate FIRE summary metrics
 */
export function calculateFIRESummary(
  investments: Investment[],
  loans: Loan[],
  settings: FIRESettings = DEFAULT_FIRE_SETTINGS
): FIRESummary {
  const useRefinancing = settings.refinancingEnabled
  const currentIncome = calculateTotalMonthlyIncomeAtYear(investments, 0, settings)
  const loanExpenses = calculateTotalLoanExpenses(
    loans,
    0,
    settings.interestRateOverride,
    useRefinancing
  )
  const currentNetWorth = calculateNetWorth(investments, loans, 0)
  const requiredExpenses = settings.monthlyRequiredExpenses
  const totalExpenses = loanExpenses.total + requiredExpenses

  const isFinanciallyIndependent =
    currentIncome.total >= totalExpenses && totalExpenses > 0

  // Calculate FI progress (income as percentage of expenses)
  const fiProgress =
    totalExpenses > 0
      ? (currentIncome.total / totalExpenses) * 100
      : currentIncome.total > 0
        ? 100
        : 0

  // Find year when income >= expenses
  let yearsToFI: number | null = null
  let fiDate: Date | null = null

  if (!isFinanciallyIndependent && totalExpenses > 0) {
    // Search up to 50 years
    for (let year = 1; year <= 50; year++) {
      const monthsFromNow = year * 12
      const projectedIncome = calculateTotalMonthlyIncomeAtYear(investments, year, settings)
      const projectedLoanExpenses = calculateTotalLoanExpenses(
        loans,
        monthsFromNow,
        settings.interestRateOverride,
        useRefinancing
      )
      const projectedTotalExpenses = projectedLoanExpenses.total + requiredExpenses

      if (projectedIncome.total >= projectedTotalExpenses) {
        yearsToFI = year
        fiDate = new Date()
        fiDate.setFullYear(fiDate.getFullYear() + year)
        break
      }
    }
  } else if (isFinanciallyIndependent) {
    yearsToFI = 0
    fiDate = new Date()
  }

  return {
    currentMonthlyIncome: Math.round(currentIncome.total * 100) / 100,
    currentMonthlyExpenses: Math.round(totalExpenses * 100) / 100,
    currentSurplus:
      Math.round((currentIncome.total - totalExpenses) * 100) / 100,
    currentNetWorth: Math.round(currentNetWorth * 100) / 100,
    yearsToFI,
    fiDate,
    fiProgress: Math.round(fiProgress * 100) / 100,
    isFinanciallyIndependent,
  }
}
