# My Investments - Project Context

## Overview

A web application for tracking investments across Stocks, Funds, Real Estate, and Crypto with future value projections. Built with modern web technologies and designed for collaborative multi-agent development.

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **shadcn/ui** (Radix UI) + **Tailwind CSS**
- **Recharts** for visualizations
- **React Context API** + **useReducer** for state
- **LocalStorage** for persistence

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
npx shadcn@latest add [component-name]  # Add shadcn/ui component
```

---

## Git Workflow

**IMPORTANT**: Follow this workflow for all features and fixes.

1. **Pull latest**: `git fetch origin && git pull origin main`
2. **Create branch**: `git checkout -b feat/description` or `fix/description`
3. **Implement changes**: Make your code changes
4. **Test with Playwright**: Verify changes work (see Testing section)
5. **Commit**: `git add . && git commit -m "feat: description"`
6. **Push**: `git push -u origin branch-name`
7. **Create PR**: `gh pr create --title "..." --body "..."`

### Branch Naming

- Features: `feat/short-description`
- Fixes: `fix/short-description`
- Refactors: `refactor/short-description`

---

## Testing with Playwright MCP

**IMPORTANT**: Use the Playwright MCP tools to test UI changes before committing.

### When to Test

- After implementing UI changes
- After adding new components or forms
- After modifying existing functionality
- Before creating a PR

### Testing Workflow

1. Ensure dev server is running (`npm run dev`)
2. Navigate to the app: `mcp__playwright__browser_navigate` to `http://localhost:5173`
3. Take snapshots: `mcp__playwright__browser_snapshot` to inspect the UI state
4. Interact with elements: `mcp__playwright__browser_click`, `mcp__playwright__browser_fill_form`
5. Verify changes work as expected
6. Take screenshots if needed: `mcp__playwright__browser_take_screenshot`

### Common Test Scenarios

- Add a new investment and verify it appears in the list
- Edit an investment and confirm changes persist
- Delete an investment and verify removal
- Check dashboard totals update correctly
- Verify charts render with data

---

## Agent Team & Delegation

**IMPORTANT**: Proactively delegate tasks to specialized sub-agents using the Task tool.

| Task Type | Delegate To | Key Files |
|-----------|-------------|-----------|
| React components, hooks, state | `react-specialist` | `src/components/**`, `src/hooks/**`, `src/context/**` |
| Type definitions, interfaces | `typescript-pro` | `src/types/**` |
| Financial calculations, projections | `data-analyst` | `src/services/calculations.ts`, `src/utils/finance.ts` |
| Styling, UX, accessibility | `ui-designer` | `src/index.css`, component styling |
| Codebase exploration | `Explore` | — |
| Multi-step planning | `Plan` | — |

### Delegation Patterns

**Parallel** (independent tasks): Launch multiple agents simultaneously
```
→ typescript-pro: Define types
→ ui-designer: Design layout
→ data-analyst: Implement calculations
```

**Sequential** (dependent tasks): Chain agents
```
→ Step 1: typescript-pro defines types
→ Step 2: data-analyst implements logic
→ Step 3: react-specialist builds UI
```

**Always explore before major changes**: Use `Explore` agent first.

### When NOT to Delegate

- Trivial tasks (single file edit, small fix)
- You already have full context
- Task requires user clarification
- Reading a specific known file

### Agent Prompt Best Practices

Provide agents with:
1. **Clear objective**: What specific outcome is needed
2. **Context**: Relevant files, types, or constraints
3. **Boundaries**: What files/areas to modify (or not modify)
4. **Output format**: What to return (code, analysis, recommendations)

---

## Agent Collaboration

- Reference specific files when discussing changes
- Use TypeScript types in `src/types/` as the source of truth
- Each agent works in their designated files/folders
- Shared interfaces live in `src/types/` (typescript-pro owns, others consume)

### Handoff Points

- **typescript-pro → react-specialist**: Type definitions ready for component props
- **data-analyst → react-specialist**: Calculation functions ready for UI integration
- **ui-designer → react-specialist**: Design specs ready for implementation

---

## Detailed Documentation

Read these files when working on specific areas:

| Document | When to Read |
|----------|--------------|
| `agent-docs/data-models.md` | Working with investment types, interfaces, or data structures |
| `agent-docs/coding-conventions.md` | Writing new code, reviewing patterns, or onboarding |
| `agent-docs/financial-formulas.md` | Implementing calculations, projections, or understanding value logic |
| `agent-docs/project-structure.md` | Finding files, understanding architecture, or adding new modules |

---

## Quick Reference

### Path Aliases
`@/*` maps to `src/*` — e.g., `import { Button } from "@/components/ui/button"`

### Module Colors
- Stocks: `#3B82F6` (Blue)
- Funds: `#10B981` (Green)
- Real Estate: `#F59E0B` (Orange)
- Crypto: `#8B5CF6` (Purple)

### Default ROIs
Stock: 8%, Fund: 7%, Real Estate: 5%, Crypto: 15%

### LocalStorage Key
`my-investments-portfolio`
