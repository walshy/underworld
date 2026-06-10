import { type LucideIcon } from 'lucide-react'

interface StatBadgeProps {
  label: string
  value: string | number
  icon?: LucideIcon
  colorClass?: string
}

export default function StatBadge({
  label,
  value,
  icon: Icon,
  colorClass = 'text-gold',
}: StatBadgeProps) {
  return (
    <div className="flex items-center gap-2 bg-bg-tertiary rounded px-3 py-2">
      {Icon && <Icon size={14} className={colorClass} />}
      <span className="text-muted text-xs uppercase tracking-wider">{label}</span>
      <span className={`font-bold text-sm ${colorClass}`}>{value}</span>
    </div>
  )
}
