# Financial Formulas Reference

## Compound Interest (No Contributions)

```
FV = PV × (1 + r)^n

Where:
- FV = Future Value
- PV = Present Value (current investment)
- r = Annual interest rate (as decimal, e.g., 0.07 for 7%)
- n = Number of years
```

## Future Value with Monthly Contributions

```
FV = PV × (1 + r)^n + PMT × (((1 + r/12)^(n×12) - 1) / (r/12))

Where:
- PMT = Monthly contribution amount
- r/12 = Monthly interest rate
- n×12 = Total number of months
```

## Calculation Notes

- ROI calculations use compound interest, compounded annually
- Monthly contributions compounded monthly within the annual calculation

## Auto-Calculated Investment Values

Investment values are automatically calculated based on time elapsed and expected ROI. This creates a "set and forget" experience where the dashboard stays accurate over time without constant manual updates.

### How It Works

1. **Default behavior**: Current value = `amountInvested` compounded from `purchaseDate` to today
2. **With override**: Current value = `lastKnownValue` compounded from `lastKnownDate` to today
3. **Funds with contributions**: Monthly contributions are also compounded from their start date

### Key Functions

- `calculateCurrentValue(investment)` - Returns the auto-calculated current value
- `calculateFutureValue(investment, years)` - Projects value N years into the future
- `calculateTotalContributions(investment, startDate)` - Calculates total monthly contributions made

### Example

```typescript
// Investment purchased Jan 2023 for $10,000 at 8% ROI
// Today is Dec 2025 (~2.93 years elapsed)
// Auto-calculated value: $10,000 × (1.08)^2.93 ≈ $12,523
```

### Override with Last Known Value

Users can optionally set a "last known value" when they want to correct for actual market performance vs expected ROI:

- Check "Override with known value" in the investment form
- Enter the actual value and the date it was recorded
- Future projections will calculate from this value instead
