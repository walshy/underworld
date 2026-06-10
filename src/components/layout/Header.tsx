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

export default function Header() {
  const { cash, dirtyMoney, heat, health } = usePlayerStore()

  return (
    <header className="h-12 md:h-header bg-bg-secondary border-b shrink-0 flex items-center px-4 md:px-6">
      {/* Mobile: 2×2 compact chips — icon + value, no label */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-0.5 md:hidden">
        <div className="flex items-center gap-1.5 min-w-0">
          <Coins size={13} className="text-gold shrink-0" />
          <span className="text-xs font-bold text-gold truncate">{formatCurrency(cash)}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <Banknote size={13} className="text-secondary shrink-0" />
          <span className="text-xs font-bold text-secondary truncate">{formatCurrency(dirtyMoney)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame size={13} className={`${heatColor(heat)} shrink-0`} />
          <span className={`text-xs font-bold ${heatColor(heat)}`}>{heat}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart size={13} className={`${healthColor(health)} shrink-0`} />
          <span className={`text-xs font-bold ${healthColor(health)}`}>{health}/100</span>
        </div>
      </div>

      {/* Desktop: single-row stat bar */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Coins size={14} className="text-gold" />
          <span className="text-muted text-xs uppercase tracking-wider">Cash</span>
          <span className="font-bold text-sm text-gold">{formatCurrency(cash)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Banknote size={14} className="text-secondary" />
          <span className="text-muted text-xs uppercase tracking-wider">Dirty</span>
          <span className="font-bold text-sm text-secondary">{formatCurrency(dirtyMoney)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame size={14} className={heatColor(heat)} />
          <span className="text-muted text-xs uppercase tracking-wider">Heat</span>
          <span className={`font-bold text-sm ${heatColor(heat)}`}>{heat}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart size={14} className={healthColor(health)} />
          <span className="text-muted text-xs uppercase tracking-wider">Health</span>
          <span className={`font-bold text-sm ${healthColor(health)}`}>{health}/100</span>
        </div>
      </div>
    </header>
  )
}
