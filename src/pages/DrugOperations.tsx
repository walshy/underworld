import { useState, useEffect } from 'react'
import { Lock, Plus, X, PackageOpen, Package } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useDrugStore, type DrugSlot } from '../store/drugStore'
import { usePlayerStore } from '../store/playerStore'
import { DRUGS, DRUG_MAP, type Drug, type DrugId } from '../lib/drugs'

// ─── Assets ───────────────────────────────────────────────────────────────────

const DRUG_ASSETS: Partial<Record<DrugId, string>> = {
  weed: '/assets/images/weed.png.png',
  pills: '/assets/images/pills.png.png',
  cocaine: '/assets/images/cocaine.png.png',
  meth: '/assets/images/meth.png.png',
}

const SIZE_CLASSES = { 32: 'w-8 h-8', 48: 'w-12 h-12' } as const
type ImageSize = keyof typeof SIZE_CLASSES

interface DrugImageProps {
  drugId: DrugId
  locked?: boolean
  size?: ImageSize
}

function DrugImage({ drugId, locked = false, size = 48 }: DrugImageProps) {
  const src = DRUG_ASSETS[drugId]
  const sizeClass = SIZE_CLASSES[size]

  if (!src) {
    return (
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className={`${sizeClass} bg-bg-primary border border-border-default rounded flex items-center justify-center`}>
          <Lock size={size === 32 ? 12 : 16} className="text-muted" />
        </div>
        {size === 48 && (
          <span className="text-[9px] text-muted text-center leading-tight">Coming soon</span>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${sizeClass} shrink-0`}>
      <img
        src={src}
        alt={drugId}
        width={size}
        height={size}
        className={`${sizeClass} pixel-art${locked ? ' opacity-50' : ''}`}
      />
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock size={size === 32 ? 12 : 14} className="text-muted" />
        </div>
      )}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMoney(n: number) {
  return `$${n.toLocaleString('en-US')}`
}

function fmtCountdown(completesAt: number, now: number): string {
  const remaining = Math.max(0, completesAt - now)
  const totalSecs = Math.ceil(remaining / 1000)
  const m = Math.floor(totalSecs / 60)
  const s = totalSecs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function calcProgress(startedAt: number, completesAt: number, now: number): number {
  const total = completesAt - startedAt
  return Math.min(100, Math.max(0, ((now - startedAt) / total) * 100))
}

// ─── ProductOption ────────────────────────────────────────────────────────────

interface ProductOptionProps {
  drug: Drug
  playerCash: number
  playerRep: number
  onSelect: (drug: Drug) => void
}

function ProductOption({ drug, playerCash, playerRep, onSelect }: ProductOptionProps) {
  const locked = drug.repRequired > playerRep
  const canAfford = playerCash >= drug.setupCost
  const disabled = locked || !canAfford

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(drug)}
      className={[
        'flex gap-3 rounded-lg border p-4 text-left transition-colors',
        locked
          ? 'opacity-40 cursor-not-allowed border-border-default bg-bg-tertiary'
          : !canAfford
          ? 'cursor-not-allowed border-danger bg-bg-tertiary'
          : 'border-border-default bg-bg-tertiary hover:border-gold hover:bg-gold-subtle cursor-pointer',
      ].join(' ')}
    >
      <DrugImage drugId={drug.id} locked={locked} size={48} />

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-primary">{drug.name}</span>
          <span className="text-xs text-muted uppercase tracking-widest">T{drug.tier}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-secondary">Cost</span>
            <span className={`text-sm font-medium ${!locked && canAfford ? 'text-primary' : 'text-danger'}`}>
              {fmtMoney(drug.setupCost)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-secondary">Yield</span>
            <span className="text-sm font-medium text-gold">{fmtMoney(drug.yield)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-secondary">Time</span>
            <span className="text-sm font-medium text-primary">{drug.productionTimeMs / 60_000}m</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-secondary">Heat</span>
            <span className="text-sm font-medium text-warning">+{drug.heat}%</span>
          </div>
        </div>

        {locked && (
          <p className="text-xs text-muted">Requires {drug.repRequired} rep</p>
        )}
        {!locked && !canAfford && (
          <p className="text-xs text-danger">Insufficient cash</p>
        )}
      </div>
    </button>
  )
}

// ─── ProductPicker ────────────────────────────────────────────────────────────

interface ProductPickerProps {
  slotId: number
  playerCash: number
  playerRep: number
  onConfirm: (slotId: number, drug: Drug) => void
  onCancel: () => void
}

function ProductPicker({ slotId, playerCash, playerRep, onConfirm, onCancel }: ProductPickerProps) {
  return (
    <Card className="border-border-accent">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">
          Choose product — Slot {slotId + 1}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted hover:text-primary transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DRUGS.map((drug) => (
          <ProductOption
            key={drug.id}
            drug={drug}
            playerCash={playerCash}
            playerRep={playerRep}
            onSelect={(d) => onConfirm(slotId, d)}
          />
        ))}
      </div>
    </Card>
  )
}

// ─── OperationSlot ────────────────────────────────────────────────────────────

interface OperationSlotProps {
  slot: DrugSlot
  now: number
  isSelecting: boolean
  onSelect: () => void
}

function OperationSlot({ slot, now, isSelecting, onSelect }: OperationSlotProps) {
  const { collectSlot } = useDrugStore()
  const drug = slot.drugId ? DRUG_MAP[slot.drugId] : undefined

  if (slot.status === 'empty') {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={[
          'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed min-h-[168px] w-full transition-colors',
          isSelecting
            ? 'border-gold bg-gold-subtle'
            : 'border-border-accent hover:border-gold hover:bg-bg-tertiary',
        ].join(' ')}
      >
        <Plus size={24} className={isSelecting ? 'text-gold' : 'text-muted'} />
        <span className={`text-[13px] ${isSelecting ? 'text-gold' : 'text-secondary'}`}>
          {isSelecting ? 'Selecting...' : 'Start Operation'}
        </span>
      </button>
    )
  }

  if (slot.status === 'running' && slot.startedAt !== null && slot.completesAt !== null) {
    const progress = calcProgress(slot.startedAt, slot.completesAt, now)
    return (
      <Card className="flex flex-col gap-3 min-h-[168px] border-border-accent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slot.drugId && <DrugImage drugId={slot.drugId} size={32} />}
            <span className="text-sm font-medium text-primary">{drug?.name}</span>
          </div>
          <span className="text-xs text-muted uppercase tracking-widest">Slot {slot.id + 1}</span>
        </div>

        <div className="flex-1" />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Producing</span>
            <span className="text-sm font-mono text-gold">
              {fmtCountdown(slot.completesAt, now)}
            </span>
          </div>
          <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-[width] duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">
            Yield: <span className="text-gold">{fmtMoney(drug?.yield ?? 0)}</span>
          </span>
          <span className="text-muted">
            Heat: <span className="text-warning">+{drug?.heat}%</span>
          </span>
        </div>
      </Card>
    )
  }

  if (slot.status === 'ready' && slot.drugId && drug) {
    return (
      <Card className="flex flex-col gap-3 min-h-[168px] border-gold">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DrugImage drugId={slot.drugId} size={32} />
            <span className="text-sm font-medium text-primary">{drug.name}</span>
          </div>
          <span className="text-xs text-muted uppercase tracking-widest">Slot {slot.id + 1}</span>
        </div>

        <div className="flex-1" />

        <div className="h-1.5 bg-gold rounded-full" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-success">Ready to collect</span>
          <Button
            variant="primary"
            className="text-xs py-1 px-3"
            onClick={() => collectSlot(slot.id, slot.drugId!, drug.name, drug.yield)}
          >
            Collect
          </Button>
        </div>
      </Card>
    )
  }

  return null
}

// ─── InventoryPanel ───────────────────────────────────────────────────────────

function InventoryPanel() {
  const { inventory, sellItem, sellAll } = useDrugStore()
  const { addDirtyMoney } = usePlayerStore()

  function handleSell(itemId: string) {
    const value = sellItem(itemId)
    if (value > 0) addDirtyMoney(value)
  }

  function handleSellAll() {
    const total = sellAll()
    if (total > 0) addDirtyMoney(total)
  }

  const totalValue = inventory.reduce((sum, i) => sum + i.value, 0)

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PackageOpen size={14} className={inventory.length > 0 ? 'text-gold' : 'text-muted'} />
          <span className="text-sm font-semibold text-primary">Inventory</span>
          {inventory.length > 0 && (
            <span className="text-xs text-muted">({inventory.length})</span>
          )}
        </div>
        {inventory.length > 1 && (
          <Button variant="primary" className="text-xs py-1" onClick={handleSellAll}>
            Sell All — {fmtMoney(totalValue)}
          </Button>
        )}
      </div>

      {inventory.length === 0 ? (
        <p className="text-xs text-muted">
          No product stockpiled. Collect from completed operations above.
        </p>
      ) : (
        <div className="divide-y divide-border-default">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-primary">{item.name}</span>
                <span className="text-xs font-semibold text-gold">{fmtMoney(item.value)}</span>
              </div>
              <Button
                variant="ghost"
                className="text-xs py-1 px-2"
                onClick={() => handleSell(item.id)}
              >
                Sell
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

// ─── DrugStockPanel ───────────────────────────────────────────────────────────

const MOCK_STOCK: Array<{ id: DrugId; quantity: number; unitValue: number }> = [
  { id: 'weed',  quantity: 5, unitValue: 85  },
  { id: 'pills', quantity: 3, unitValue: 140 },
]

function DrugStockPanel() {
  const [distMsg, setDistMsg] = useState<DrugId | null>(null)

  function handleSell(id: DrugId) {
    setDistMsg(id)
    setTimeout(() => setDistMsg(null), 2000)
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package size={14} className="text-gold" />
          <span className="text-sm font-semibold text-primary">Drug Stock</span>
          <span className="text-xs text-muted">(mock)</span>
        </div>
        <span className="text-xs uppercase tracking-widest text-muted">Units</span>
      </div>

      <div className="divide-y divide-border-default">
        {MOCK_STOCK.map(({ id, quantity, unitValue }) => {
          const drug = DRUG_MAP[id]
          return (
            <div
              key={id}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <DrugImage drugId={id} size={32} />
                <div>
                  <p className="text-sm text-primary">{drug.name}</p>
                  <p className="text-xs text-secondary">
                    {quantity} units · <span className="text-gold">{fmtMoney(quantity * unitValue)}</span> est.
                  </p>
                </div>
              </div>
              {distMsg === id ? (
                <span className="text-xs text-secondary">Distribution coming soon</span>
              ) : (
                <Button variant="ghost" className="text-xs py-1 px-2" onClick={() => handleSell(id)}>
                  Sell
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ─── StatsPanel ───────────────────────────────────────────────────────────────

function StatsPanel() {
  const { earnedToday, opsToday, heatContribution } = useDrugStore()

  return (
    <Card className="!p-5 space-y-5">
      <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted">
        Today's Activity
      </span>
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted mb-1">Total Earned</p>
          <p className="text-[22px] font-bold text-gold leading-none">{fmtMoney(earnedToday)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted mb-1">Operations Run</p>
          <p className="text-[22px] font-bold text-primary leading-none">{opsToday}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted mb-1">Heat Generated</p>
          <p className="text-base font-bold text-warning">+{heatContribution}%</p>
        </div>
      </div>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DrugOperations() {
  const [selectingSlot, setSelectingSlot] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())

  const { slots, startOp, markReady } = useDrugStore()
  const { cash, rep, addCash, addHeat } = usePlayerStore()

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const n = Date.now()
    slots.forEach((slot) => {
      if (slot.status === 'running' && slot.completesAt !== null && n >= slot.completesAt) {
        markReady(slot.id)
      }
    })
  }, [now, slots, markReady])

  function handleConfirm(slotId: number, drug: Drug) {
    addCash(-drug.setupCost)
    addHeat(drug.heat)
    startOp(slotId, drug.id, drug.productionTimeMs, drug.heat)
    setSelectingSlot(null)
  }

  const activeCount = slots.filter((s) => s.status !== 'empty').length

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <section className="space-y-3">
          <div>
            <h1 className="text-lg font-bold text-primary">Drug Operations</h1>
            <p className="text-sm text-muted mt-0.5">{activeCount} / 3 slots active</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <OperationSlot
                key={slot.id}
                slot={slot}
                now={now}
                isSelecting={selectingSlot === slot.id}
                onSelect={() => {
                  if (slot.status === 'empty') setSelectingSlot(slot.id)
                }}
              />
            ))}
          </div>

          {selectingSlot !== null && (
            <ProductPicker
              slotId={selectingSlot}
              playerCash={cash}
              playerRep={rep}
              onConfirm={handleConfirm}
              onCancel={() => setSelectingSlot(null)}
            />
          )}
        </section>

        <InventoryPanel />
        <DrugStockPanel />
      </div>

      <aside className="w-full md:w-52 shrink-0">
        <StatsPanel />
      </aside>
    </div>
  )
}
