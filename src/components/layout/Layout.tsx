import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FlaskConical, Map, Dice5, Menu, X,
  ShoppingBag, Users, Crosshair, Landmark, Lock, UserCircle,
  type LucideIcon,
} from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const BOTTOM_TABS: NavItem[] = [
  { to: '/overview', label: 'HQ', icon: LayoutDashboard },
  { to: '/drugs', label: 'Ops', icon: FlaskConical },
  { to: '/territory', label: 'Territory', icon: Map },
  { to: '/casino', label: 'Casino', icon: Dice5 },
]

const DRAWER_ITEMS: NavItem[] = [
  { to: '/market', label: 'Black Market', icon: ShoppingBag },
  { to: '/gang', label: 'Gang', icon: Users },
  { to: '/hits', label: 'Hired Hits', icon: Crosshair },
  { to: '/laundering', label: 'Laundering', icon: Landmark },
  { to: '/prison', label: 'Prison', icon: Lock },
  { to: '/profile', label: 'Profile', icon: UserCircle },
]

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  const drawerActive = DRAWER_ITEMS.some(item => item.to === location.pathname)

  return (
    <div className="flex h-full bg-bg-primary">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-6 pb-[72px] md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* ── Bottom tab bar — mobile only ── */}
      <nav className="fixed bottom-0 left-0 right-0 h-14 bg-bg-secondary border-t border-border-default flex items-stretch z-30 md:hidden">
        {BOTTOM_TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-[6px] transition-colors ${
                isActive ? 'text-gold' : 'text-muted'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px]">{label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center gap-[6px] transition-colors ${
            drawerActive ? 'text-gold' : 'text-muted'
          }`}
        >
          <Menu size={20} />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* ── Backdrop — mobile only ── */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-200 md:hidden ${
          drawerOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ── More drawer — mobile only ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary border-t border-border-default transition-transform duration-200 ease-out md:hidden ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
          <span className="text-sm font-semibold text-primary">More</span>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="text-muted hover:text-primary transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>
        {DRAWER_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 text-sm border-b border-border-default transition-colors ${
                isActive
                  ? 'text-gold bg-gold-subtle'
                  : 'text-secondary hover:text-primary hover:bg-bg-tertiary'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
