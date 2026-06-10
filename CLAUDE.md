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

## Database Schema (Planned — Supabase not yet wired)

### drug_inventory
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `player_id` | `uuid` | FK → auth.users |
| `product` | `text` | `weed` / `pills` / `cocaine` / `meth` |
| `quantity` | `integer` | Units held |
| `quality` | `integer` | 0–100 |
| `created_at` | `timestamptz` | |
| `expires_at` | `timestamptz` | Nullable; stock degrades if not distributed in time |

### storage_facilities
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `player_id` | `uuid` | FK → auth.users |
| `type` | `text` | `safehouse` / `lockup` / `warehouse` / `industrial` |
| `capacity` | `integer` | Max units storable |
| `current_usage` | `integer` | Units currently stored |
| `location_district` | `text` | District name |

### districts
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `name` | `text` | District name |
| `weed_demand` | `integer` | 0–100 demand score |
| `pills_demand` | `integer` | 0–100 demand score |
| `cocaine_demand` | `integer` | 0–100 demand score |
| `meth_demand` | `integer` | 0–100 demand score |
| `last_updated` | `timestamptz` | Demand fluctuates over time |

### distribution_jobs
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `player_id` | `uuid` | FK → auth.users |
| `product` | `text` | Drug type being distributed |
| `quantity` | `integer` | Units dispatched |
| `method` | `text` | `street` / `local` / `blackmarket` / `smuggling` |
| `district_id` | `uuid` | FK → districts |
| `status` | `text` | `pending` / `active` / `complete` / `busted` |
| `started_at` | `timestamptz` | |
| `completes_at` | `timestamptz` | |
| `heat_generated` | `integer` | Heat added on completion |
| `profit_earned` | `integer` | Dirty money earned |

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

## Drug Economy Architecture

> **Not yet implemented.** Current system produces dirty money directly from operations.
> This documents the planned inventory-based loop for future implementation.

### Inventory Loop (Planned)
1. **Produce** — Operation slots produce drug units (not dirty money directly)
2. **Store** — Units are held in a storage facility until distributed
3. **Distribute** — Player dispatches a distribution job to a district via a chosen method
4. **Collect** — On completion, dirty money arrives in the player's wallet

### Storage Facilities
| Type | Capacity | Notes |
|---|---|---|
| Safehouse | 20 units | Starter storage; low heat, low capacity |
| Lockup | 80 units | Mid-tier; moderate heat risk |
| Warehouse | 250 units | High capacity; requires territory control |
| Industrial | 600 units | End-game scale; severe heat if discovered |

### Districts (Six)
| District | Character | High Demand |
|---|---|---|
| East Side | Residential, starter territory | Weed, Pills |
| The Docks | Industrial, heavy foot traffic | Cocaine, Meth |
| Midtown | High income, white collar | Cocaine, Pills |
| The Flats | Low income, high volume | Weed, Meth |
| Uptown | Luxury, low heat, low volume | Cocaine |
| Outer Ring | Sprawling suburbs, export route | All (Smuggling only) |

### Distribution Methods
| Method | Risk | Reward | Time |
|---|---|---|---|
| Street | Low | Low | Fast (~5 min) |
| Local dealer | Medium | Medium | Medium (~20 min) |
| Black market | High | High | Slow (~60 min) |
| Smuggling | Very high | Very high | Very slow (~4 hr) |

### Migration Note
When implemented, operation slots will produce `drug_inventory` units instead of calling
`addDirtyMoney`. The existing collected-items `InventoryPanel` and `drugStore.inventory`
will be deprecated in favour of `drug_inventory` rows and the distribution job system.

## Mobile-First

This project targets mobile as the primary viewport with desktop as an enhancement.

- **Breakpoint**: `md` (768px) is the desktop threshold — mobile styles are the default, desktop overrides use `md:` prefix
- **Navigation**:
  - Mobile: bottom tab bar (56px, `h-14`) with 4 primary tabs + "More" slide-up drawer
  - Desktop: left sidebar (`w-sidebar`, 220px), hidden on mobile via `hidden md:flex`
- **Header**: 48px (`h-12`) on mobile with 2×2 icon+value grid; 56px (`md:h-header`) on desktop with single stat row
- **Page content**: `pb-[72px]` on mobile to clear the tab bar; `md:pb-6` on desktop
- **No inline styles**: use `min-h-[calc(100vh_-_104px)]` Tailwind arbitrary values (underscores = spaces in calc)
- **Images**: pixel art assets use `.pixel-art` utility class (`image-rendering: pixelated; crisp-edges`)
