# Coding Conventions

## TypeScript

- **Strict mode enabled**: No implicit any, strict null checks
- **Type everything**: Interfaces for objects, type for unions/primitives
- **Discriminated unions**: Use `type` field to distinguish investment types
- **No `any`**: Use `unknown` if type is truly unknown, then narrow
- **Prefer type inference**: Let TypeScript infer when obvious

## React

- **Functional components only**: No class components
- **Named exports**: `export function InvestmentCard() { ... }`
- **Props interfaces**: `interface ComponentNameProps { ... }`
- **Custom hooks**: Extract reusable logic into hooks
- **Component structure**:
  ```tsx
  // 1. Imports
  // 2. Types/Interfaces
  // 3. Component
  // 4. Helper functions (if any)
  ```

## Styling

- **Tailwind utilities**: Prefer utility classes over custom CSS
- **cn() for conditionals**: `className={cn("base", condition && "active")}`
- **shadcn/ui first**: Use existing components before building custom
- **Mobile-first**: Start with mobile layout, add breakpoints for larger screens
- **Consistent spacing**: Use Tailwind's spacing scale (4, 8, 12, 16, etc.)

## File Naming

- **Components**: PascalCase → `InvestmentForm.tsx`
- **Hooks**: camelCase with `use` prefix → `useStocks.ts`
- **Services/Utils**: camelCase → `calculations.ts`
- **Types**: PascalCase or grouped in `index.ts`

## Path Aliases

- `@/*` maps to `src/*`
- Example: `import { Button } from "@/components/ui/button"`

## Implementation Priority

1. **Types first**: Define all interfaces before building components
2. **Services second**: Build calculation logic with tests
3. **Context third**: Set up state management
4. **Components fourth**: Build UI consuming the above
5. **Polish last**: Styling, animations, edge cases
