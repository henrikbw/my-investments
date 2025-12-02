/**
 * FIRE (Financial Independence, Retire Early) Page
 * Shows income vs expenses projection and FI progress
 */

import { useFIRE } from '@/hooks/useFIRE'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import { formatCurrency } from '@/utils/format'
import { FIREChartDataPoint, PASSIVE_INCOME_RATES } from '@/types'
import { MODULE_COLORS, MODULE_LABELS } from '@/constants/defaults'

const FIRE_COLORS = {
  income: '#10B981',      // Green
  expenses: '#EF4444',    // Red
  surplus: '#3B82F6',     // Blue
  netWorth: '#8B5CF6',    // Purple
}

interface FIRETooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    payload: FIREChartDataPoint
  }>
}

function FIREChartTooltip({ active, payload }: FIRETooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload
  const isPositiveSurplus = data.surplus >= 0

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg min-w-[200px]">
      <p className="mb-2 font-semibold text-card-foreground">{data.actualYear}</p>

      <div className="space-y-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Monthly Income</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 font-medium">
              {formatCurrency(data.monthlyIncome)}
            </span>
          </div>
          {(data.incomeFromRealEstate > 0 || data.incomeFromFunds > 0 ||
            data.incomeFromStocks > 0 || data.incomeFromCrypto > 0) && (
            <div className="mt-1 pl-2 border-l-2 border-green-200 space-y-0.5">
              {data.incomeFromRealEstate > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: MODULE_COLORS['real-estate'] }} />
                    {MODULE_LABELS['real-estate']}
                  </span>
                  <span>{formatCurrency(data.incomeFromRealEstate)}</span>
                </div>
              )}
              {data.incomeFromFunds > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: MODULE_COLORS.fund }} />
                    {MODULE_LABELS.fund}
                  </span>
                  <span>{formatCurrency(data.incomeFromFunds)}</span>
                </div>
              )}
              {data.incomeFromStocks > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: MODULE_COLORS.stock }} />
                    {MODULE_LABELS.stock}
                  </span>
                  <span>{formatCurrency(data.incomeFromStocks)}</span>
                </div>
              )}
              {data.incomeFromCrypto > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: MODULE_COLORS.crypto }} />
                    {MODULE_LABELS.crypto}
                  </span>
                  <span>{formatCurrency(data.incomeFromCrypto)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Monthly Expenses</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-600 font-medium">
              {formatCurrency(data.monthlyExpenses)}
            </span>
          </div>
          {(data.loanInterest > 0 || data.loanPrincipal > 0) && (
            <div className="mt-1 pl-2 border-l-2 border-red-200 space-y-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Interest</span>
                <span>{formatCurrency(data.loanInterest)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Principal</span>
                <span>{formatCurrency(data.loanPrincipal)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Surplus</span>
            <span className={`text-sm font-medium ${isPositiveSurplus ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveSurplus ? '+' : ''}{formatCurrency(data.surplus)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FIProgressCard({
  progress,
  isIndependent,
  yearsToFI,
  fiDate,
}: {
  progress: number
  isIndependent: boolean
  yearsToFI: number | null
  fiDate: Date | null
}) {
  const progressClamped = Math.min(progress, 100)
  const progressColor = isIndependent ? 'bg-green-500' : progress >= 75 ? 'bg-yellow-500' : 'bg-blue-500'

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          FI Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">
              {progress.toFixed(1)}%
            </span>
            {isIndependent && (
              <span className="text-sm text-green-600 font-medium">
                Financially Independent!
              </span>
            )}
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-500`}
              style={{ width: `${progressClamped}%` }}
            />
          </div>
          {!isIndependent && yearsToFI !== null && fiDate && (
            <p className="text-xs text-muted-foreground">
              Estimated FI in {yearsToFI} year{yearsToFI !== 1 ? 's' : ''} ({fiDate.getFullYear()})
            </p>
          )}
          {!isIndependent && yearsToFI === null && (
            <p className="text-xs text-muted-foreground">
              Add investments to project FI date
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryCard({
  title,
  value,
  subtitle,
  valueColor,
}: {
  title: string
  value: string
  subtitle?: string
  valueColor?: 'green' | 'red' | 'default'
}) {
  const colorClass = valueColor === 'green'
    ? 'text-green-600'
    : valueColor === 'red'
    ? 'text-red-600'
    : ''

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No Data Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Add investments and loans to see your FIRE journey. Your passive income
            from investments will be compared against your loan payments to track
            progress toward financial independence.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Income Rates by Asset Type:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: MODULE_COLORS['real-estate'] }} />
                Real Estate: Rental Income
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: MODULE_COLORS.fund }} />
                Funds: {PASSIVE_INCOME_RATES.fund}%
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: MODULE_COLORS.stock }} />
                Stocks: {PASSIVE_INCOME_RATES.stock}%
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: MODULE_COLORS.crypto }} />
                Crypto: {PASSIVE_INCOME_RATES.crypto}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function FIREPage() {
  const { chartData, summary, loading, hasData } = useFIRE(30)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">FIRE Journey</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-[400px] bg-muted rounded-lg" />
        </div>
      </div>
    )
  }

  // Find the crossover point (where income meets expenses)
  const crossoverYear = chartData.find(
    (d, i) => i > 0 && d.monthlyIncome >= d.monthlyExpenses && chartData[i - 1].monthlyIncome < chartData[i - 1].monthlyExpenses
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">FIRE Journey</h1>
        <p className="text-muted-foreground mt-1">
          Track your path to Financial Independence
        </p>
      </div>

      {!hasData ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Monthly Passive Income"
              value={formatCurrency(summary.currentMonthlyIncome)}
              subtitle="From all investments"
              valueColor="green"
            />
            <SummaryCard
              title="Monthly Expenses"
              value={formatCurrency(summary.currentMonthlyExpenses)}
              subtitle="Loan payments (interest + principal)"
              valueColor="red"
            />
            <SummaryCard
              title="Monthly Surplus"
              value={formatCurrency(summary.currentSurplus)}
              subtitle={summary.currentSurplus >= 0 ? 'Income exceeds expenses' : 'Expenses exceed income'}
              valueColor={summary.currentSurplus >= 0 ? 'green' : 'red'}
            />
            <FIProgressCard
              progress={summary.fiProgress}
              isIndependent={summary.isFinanciallyIndependent}
              yearsToFI={summary.yearsToFI}
              fiDate={summary.fiDate}
            />
          </div>

          {/* Net Worth Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Net Worth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatCurrency(summary.currentNetWorth)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Total assets minus total loan balances
              </p>
            </CardContent>
          </Card>

          {/* Main Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses Projection</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly passive income compared to loan payments over time
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="label"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    interval={Math.floor(chartData.length / 10)}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<FIREChartTooltip />} />
                  <Legend />

                  {/* Reference line at 0 */}
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />

                  {/* Crossover marker if exists */}
                  {crossoverYear && (
                    <ReferenceLine
                      x={crossoverYear.label}
                      stroke={FIRE_COLORS.surplus}
                      strokeDasharray="5 5"
                      label={{
                        value: 'FI',
                        position: 'top',
                        fill: FIRE_COLORS.surplus,
                        fontSize: 12,
                      }}
                    />
                  )}

                  <Line
                    type="monotone"
                    dataKey="monthlyIncome"
                    name="Monthly Income"
                    stroke={FIRE_COLORS.income}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="monthlyExpenses"
                    name="Monthly Expenses"
                    stroke={FIRE_COLORS.expenses}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="surplus"
                    name="Surplus"
                    stroke={FIRE_COLORS.surplus}
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Income Breakdown Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How Passive Income is Calculated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="h-3 w-3 rounded-full mt-1" style={{ backgroundColor: MODULE_COLORS['real-estate'] }} />
                  <div>
                    <p className="font-medium">{MODULE_LABELS['real-estate']}</p>
                    <p className="text-muted-foreground">Actual rental income (grows with property value)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-3 w-3 rounded-full mt-1" style={{ backgroundColor: MODULE_COLORS.fund }} />
                  <div>
                    <p className="font-medium">{MODULE_LABELS.fund}</p>
                    <p className="text-muted-foreground">{PASSIVE_INCOME_RATES.fund}% annual withdrawal rate</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-3 w-3 rounded-full mt-1" style={{ backgroundColor: MODULE_COLORS.stock }} />
                  <div>
                    <p className="font-medium">{MODULE_LABELS.stock}</p>
                    <p className="text-muted-foreground">{PASSIVE_INCOME_RATES.stock}% annual withdrawal rate</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-3 w-3 rounded-full mt-1" style={{ backgroundColor: MODULE_COLORS.crypto }} />
                  <div>
                    <p className="font-medium">{MODULE_LABELS.crypto}</p>
                    <p className="text-muted-foreground">{PASSIVE_INCOME_RATES.crypto}% annual withdrawal rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
