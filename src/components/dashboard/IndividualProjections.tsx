/**
 * Individual investment projection cards
 * Shows each investment's growth trajectory with mini charts
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { IndividualProjectionData } from '@/services/projections'
import { MODULE_COLORS, MODULE_LABELS } from '@/constants/defaults'
import { formatCurrency, formatPercentage } from '@/utils/format'
import { TrendingUp, Calendar, Repeat } from 'lucide-react'

interface IndividualProjectionsProps {
  data: IndividualProjectionData[]
  selectedYear: number
}

interface ProjectionCardProps {
  projection: IndividualProjectionData
  selectedYear: number
}

function ProjectionCard({ projection, selectedYear }: ProjectionCardProps) {
  const color = MODULE_COLORS[projection.type]

  // Get the projected value at the selected year
  const selectedYearData = projection.chartData.find(
    (d) => d.year === selectedYear
  )
  const projectedAtSelectedYear = selectedYearData?.value ?? projection.projectedValue
  const gainAtSelectedYear = projectedAtSelectedYear - projection.currentValue
  const percentageAtSelectedYear =
    projection.currentValue === 0
      ? 0
      : (gainAtSelectedYear / projection.currentValue) * 100

  const currentYear = new Date().getFullYear()

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold leading-tight">
              {projection.name}
            </CardTitle>
            <Badge
              variant="secondary"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {MODULE_LABELS[projection.type]}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">ROI</p>
            <p className="font-semibold" style={{ color }}>
              {formatPercentage(projection.roi, 0)}/yr
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Chart */}
        <div className="h-20 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projection.chartData.slice(0, selectedYear + 1)}>
              <defs>
                <linearGradient id={`gradient-${projection.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as { year: number; value: number }
                    return (
                      <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
                        <p className="text-xs text-muted-foreground">
                          {currentYear + data.year}
                        </p>
                        <p className="font-semibold">{formatCurrency(data.value)}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={`url(#gradient-${projection.id})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Value Progression */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Current</p>
            <p className="font-semibold">{formatCurrency(projection.currentValue)}</p>
          </div>
          <div className="flex items-center text-muted-foreground">
            <TrendingUp className="h-4 w-4 mx-2" />
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">{currentYear + selectedYear}</p>
            <p className="font-semibold" style={{ color }}>
              {formatCurrency(projectedAtSelectedYear)}
            </p>
          </div>
        </div>

        {/* Gain Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Total Gain</span>
            </div>
            <p className="font-medium text-green-600">
              +{formatCurrency(gainAtSelectedYear)}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Growth</span>
            </div>
            <p className="font-medium text-green-600">
              +{formatPercentage(percentageAtSelectedYear, 0)}
            </p>
          </div>
        </div>

        {/* Monthly Contribution (if applicable) */}
        {projection.monthlyContribution !== undefined && projection.monthlyContribution > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t text-sm">
            <Repeat className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Monthly:</span>
            <span className="font-medium">
              +{formatCurrency(projection.monthlyContribution)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function IndividualProjections({
  data,
  selectedYear,
}: IndividualProjectionsProps) {
  if (data.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold">Individual Projections</h3>
        <p className="text-sm text-muted-foreground">
          Growth trajectory for each investment over {selectedYear} year{selectedYear > 1 ? 's' : ''}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((projection) => (
          <ProjectionCard
            key={projection.id}
            projection={projection}
            selectedYear={selectedYear}
          />
        ))}
      </div>
    </div>
  )
}
