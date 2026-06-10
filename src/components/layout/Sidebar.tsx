import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FlaskConical,
  Map,
  ShoppingBag,
  Dice5,
  Users,
  Crosshair,
  Landmark,
  Lock,
  UserCircle,
  type LucideIcon,
} from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { to: '/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/drugs', label: 'Drug Operations', icon: FlaskConical },
  { to: '/territory', label: 'Territory', icon: Map },
  { to: '/market', label: 'Black Market', icon: ShoppingBag },
  { to: '/casino', label: 'Casino', icon: Dice5 },
  { to: '/gang', label: 'Gang', icon: Users },
  { to: '/hits', label: 'Hired Hits', icon: Crosshair },
  { to: '/laundering', label: 'Laundering', icon: Landmark },
  { to: '/prison', label: 'Prison', icon: Lock },
  { to: '/profile', label: 'Profile', icon: UserCircle },
]

export default function Sidebar() {
  return (
    <aside className="w-sidebar h-full bg-bg-secondary border-r flex-col shrink-0 hidden md:flex">
      <div className="h-header flex items-center px-5 border-b shrink-0">
        <img
          src="/assets/images/underworld-logo.png"
          alt="Underworld"
          className="h-8 w-auto pixel-art"
        />
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-5 py-3 text-sm transition-colors border-l-2',
                isActive
                  ? 'border-gold bg-gold-subtle text-gold'
                  : 'border-transparent text-secondary hover:text-primary hover:bg-bg-tertiary',
              ].join(' ')
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
