# My Investments

A modern web application for tracking investments and generating future value prognoses.

## Features

- Track your investment portfolio
- Calculate future value projections
- Visualize investment performance
- Mobile-responsive design
- Dark mode support

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Project Structure

```
my-investments/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── features/    # Feature-specific components
│   ├── lib/             # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── services/        # Business logic and data services
│   └── App.tsx          # Root component
├── .claude/             # Claude Code agent configuration
└── PROJECT.md           # Detailed project overview and roadmap
```

## Development

### Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

### Working with Agents

This project is optimized for development with Claude Code agents. See `.claude/claude.md` for coding conventions and agent guidelines.

## Roadmap

See [PROJECT.md](./PROJECT.md) for detailed feature roadmap and architecture.

## License

MIT
