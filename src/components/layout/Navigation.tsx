/**
 * Navigation component
 */

import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { MODULE_LABELS } from '@/constants/defaults'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/stocks', label: MODULE_LABELS.stock },
  { path: '/funds', label: MODULE_LABELS.fund },
  { path: '/real-estate', label: MODULE_LABELS['real-estate'] },
  { path: '/crypto', label: MODULE_LABELS.crypto },
  { path: '/loans', label: 'Loans' },
  { path: '/fire', label: 'FIRE' },
]

export function Navigation() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                  'hover:text-foreground',
                  isActive
                    ? 'text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
