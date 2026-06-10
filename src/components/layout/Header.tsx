import { Coins, Banknote, Flame, Heart } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

function heatColor(heat: number): string {
  if (heat < 33) return 'text-success'
  if (heat < 66) return 'text-warning'
  return 'text-danger'
}

function healthColor(health: number): string {
  if (health > 66) return 'text-success'
  if (health > 33) return 'text-warning'
  return 'text-danger'
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: string
  valueClass?: string
}

function StatItem({ icon, label, value, valueClass = 'text-gold' }: StatItemProps) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-muted text-xs uppercase tracking-wider">{label}</span>
      <span className={`font-bold text-sm ${valueClass}`}>{value}</span>
    </div>
  )
}

export default function Header() {
  const { cash, dirtyMoney, heat, health } = usePlayerStore()

  return (
    <header className="h-header bg-bg-secondary border-b flex items-center px-6 gap-6 shrink-0">
      <StatItem
        icon={<Coins size={14} className="text-gold" />}
        label="Cash"
        value={formatCurrency(cash)}
      />
      <StatItem
        icon={<Banknote size={14} className="text-secondary" />}
        label="Dirty"
        value={formatCurrency(dirtyMoney)}
      />
      <StatItem
        icon={<Flame size={14} className={heatColor(heat)} />}
        label="Heat"
        value={`${heat}%`}
        valueClass={heatColor(heat)}
      />
      <StatItem
        icon={<Heart size={14} className={healthColor(health)} />}
        label="Health"
        value={`${health}/100`}
        valueClass={healthColor(health)}
      />
    </header>
  )
}
