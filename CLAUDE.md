# Underworld — Developer Reference

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS v3 (utility-first, no CSS modules)
- Zustand v5 (state management)
- Supabase (backend — not yet wired)
- react-router-dom v6
- lucide-react (icons)

## Design System

### Colours (tailwind.config.js)
| Token | Hex | Usage |
|---|---|---|
| `bg-primary` | `#0f0f0f` | Page background |
| `bg-secondary` | `#1a1a1a` | Card / panel background |
| `bg-tertiary` | `#222222` | Inset / nested background |
| `border-default` | `#2a2a2a` | Standard border (also Tailwind DEFAULT) |
| `border-accent` | `#3a3a3a` | Highlighted border |
| `gold` / `text-gold` / `bg-gold` | `#f5c518` | Primary accent — income, active, selected |
| `gold-muted` | `#c9a010` | Hover state for gold elements |
| `gold-subtle` | `#2a2100` | Gold tint background |
| `success` | `#38a169` | Positive values, healthy states |
| `warning` | `#d97706` | Medium heat, caution states |
| `danger` | `#e53e3e` | High heat, errors, destructive actions |
| `text-primary` | `#f0f0f0` | Body text |
| `text-secondary` | `#888888` | Secondary / supporting text |
| `text-muted` | `#555555` | Labels, placeholders |

### Typography
- Labels / stat names: `text-xs uppercase tracking-wider text-muted`
- Section headers: `text-xs font-semibold uppercase tracking-widest text-muted`
- Page titles: `text-lg font-bold text-primary`
- Values: `font-bold text-{color}` (size varies by context)
- Mono counters / timers: `font-mono`

### Component Conventions
- **Cards**: `bg-bg-secondary border rounded-lg p-4` — use `<Card>` component
  - Active / selected: add `border-gold`
  - Running / in-progress: add `border-border-accent`
  - Empty / dashed placeholder: `border-dashed border-border-accent` (don't use Card, use `<button>`)
- **Buttons**: use `<Button variant="primary|danger|ghost">` component
  - `primary`: gold background, dark text
  - `danger`: red background
  - `ghost`: transparent, hover reveals background
- **Progress bars**: `h-1.5 bg-bg-primary rounded-full` track, `bg-gold` fill.
  Width is set via `style={{ width: `${pct}%` }}` — the only acceptable use of inline style.
- **Stat badges**: use `<StatBadge>` for header-level stats

### Layout
- Sidebar: `w-sidebar` (220px), fixed left
- Header: `h-header` (56px), fixed top-right
- Page content: `p-6`, scrollable
- Typical two-column page: `flex gap-6` with `flex-1 min-w-0` main + `w-52 shrink-0` sidebar

### Rules
- No inline styles except progress bar width
- No arbitrary Tailwind values (e.g. `w-[73px]`) unless unavoidable
- Gold = money, income, active state. Never use gold for errors or warnings.
- `text-success` for positive money values, `text-warning` for heat, `text-danger` for errors

## State

### playerStore
| Field | Type | Notes |
|---|---|---|
| `cash` | `number` | Clean spendable money |
| `dirtyMoney` | `number` | Needs laundering |
| `heat` | `number` | 0–100, police attention |
| `health` | `number` | 0–100 |
| `rep` | `number` | Reputation, unlocks higher-tier products |

Helpers: `addCash(delta)`, `addDirtyMoney(delta)`, `addHeat(delta)`

### gameStore
Tick counter + loading state.

### drugStore
Operation slots (3), inventory, daily stats. See `src/store/drugStore.ts`.

## File Structure
```
src/
  lib/           # Constants and pure definitions (no React)
  store/         # Zustand stores
  components/
    ui/          # Generic reusable components (Card, Button, StatBadge)
    layout/      # App shell (Layout, Sidebar, Header)
  pages/         # One file per route
```

## Conventions
- Page files: one default export, all sub-components in the same file unless reused elsewhere
- Store actions mutate via `set()`, never return side-effected values from within `set()`
- Production times in milliseconds, displayed in minutes
- All currency displayed with `$` prefix and `toLocaleString('en-US')` formatting
