import { Link } from 'react-router-dom'
import {
  Coins,
  Banknote,
  Flame,
  Heart,
  FlaskConical,
  Map,
  ShoppingBag,
  Dice5,
  Users,
  Crosshair,
  Landmark,
  Lock,
  type LucideIcon,
} from 'lucide-react'
import Card from '../components/ui/Card'
import { usePlayerStore } from '../store/playerStore'
import { useGameStore } from '../store/gameStore'

function formatCurrency(n: number) {
  return `$${n.toLocaleString('en-US')}`
}

function ProgressBar({
  value,
  max,
  colorClass,
}: {
  value: number
  max: number
  colorClass: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden mt-3">
      <div
        className={`h-full rounded-full transition-all ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  sub?: string
  icon: LucideIcon
  iconClass: string
  bar?: { value: number; max: number; colorClass: string }
}

function StatCard({ label, value, sub, icon: Icon, iconClass, bar }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
        <Icon size={14} className={iconClass} />
      </div>
      <span className="text-2xl font-bold text-primary mt-1">{value}</span>
      {sub && <span className="text-xs text-muted">{sub}</span>}
      {bar && <ProgressBar {...bar} />}
    </Card>
  )
}

interface QuickLinkProps {
  to: string
  label: string
  description: string
  icon: LucideIcon
}

function QuickLink({ to, label, description, icon: Icon }: QuickLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 bg-bg-secondary border rounded-lg p-4 hover:border-border-accent hover:bg-bg-tertiary transition-colors group"
    >
      <div className="mt-0.5 text-muted group-hover:text-gold transition-colors">
        <Icon size={16} />
      </div>
      <div>
        <div className="text-sm font-semibold text-primary">{label}</div>
        <div className="text-xs text-muted mt-0.5">{description}</div>
      </div>
    </Link>
  )
}

const quickLinks: QuickLinkProps[] = [
  { to: '/drugs', label: 'Drug Operations', description: 'Produce and distribute product', icon: FlaskConical },
  { to: '/territory', label: 'Territory', description: 'Control turf across the city', icon: Map },
  { to: '/market', label: 'Black Market', description: 'Buy and sell contraband', icon: ShoppingBag },
  { to: '/casino', label: 'Casino', description: 'Gamble and launder cash', icon: Dice5 },
  { to: '/gang', label: 'Gang', description: 'Manage your crew and loyalty', icon: Users },
  { to: '/hits', label: 'Hired Hits', description: 'Contract and execute marks', icon: Crosshair },
  { to: '/laundering', label: 'Laundering', description: 'Clean your dirty money', icon: Landmark },
  { to: '/prison', label: 'Prison', description: 'Manage incarcerated members', icon: Lock },
]

export default function Overview() {
  const { cash, dirtyMoney, heat, health } = usePlayerStore()
  const { tick } = useGameStore()

  const heatColor =
    heat < 33 ? 'bg-success' : heat < 66 ? 'bg-warning' : 'bg-danger'
  const heatTextColor =
    heat < 33 ? 'text-success' : heat < 66 ? 'text-warning' : 'text-danger'
  const healthColor =
    health > 66 ? 'bg-success' : health > 33 ? 'bg-warning' : 'bg-danger'
  const healthTextColor =
    health > 66 ? 'text-success' : health > 33 ? 'text-warning' : 'text-danger'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-primary">Empire Overview</h1>
        <p className="text-xs text-muted mt-0.5">Day {tick + 1}</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Clean Cash"
          value={formatCurrency(cash)}
          icon={Coins}
          iconClass="text-gold"
          sub="Available to spend"
        />
        <StatCard
          label="Dirty Money"
          value={formatCurrency(dirtyMoney)}
          icon={Banknote}
          iconClass="text-secondary"
          sub="Needs laundering"
        />
        <StatCard
          label="Heat"
          value={`${heat}%`}
          icon={Flame}
          iconClass={heatTextColor}
          bar={{ value: heat, max: 100, colorClass: heatColor }}
        />
        <StatCard
          label="Health"
          value={`${health} / 100`}
          icon={Heart}
          iconClass={healthTextColor}
          bar={{ value: health, max: 100, colorClass: healthColor }}
        />
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
          Operations
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <QuickLink key={link.to} {...link} />
          ))}
        </div>
      </div>
    </div>
  )
}
