/**
 * Formatting utility functions
 */

/**
 * Format number as Norwegian kroner
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()} kr`
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}
