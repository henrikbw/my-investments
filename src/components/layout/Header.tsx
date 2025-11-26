/**
 * Header component
 */

import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">My Investments</h1>
          </Link>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Track your portfolio and future growth
          </p>
        </div>
      </div>
    </header>
  )
}
