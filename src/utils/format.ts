/**
 * Formatting utility functions
 */

/**
 * Format number as Norwegian kroner (no decimals)
 */
export function formatCurrency(amount: number): string {
  return `${Math.round(amount).toLocaleString()} kr`
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}
