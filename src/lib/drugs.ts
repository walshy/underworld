export type DrugId = 'weed' | 'pills' | 'cocaine' | 'meth'

export interface Drug {
  id: DrugId
  name: string
  tier: number
  productionTimeMs: number
  setupCost: number
  yield: number
  heat: number
  repRequired: number
}

export const DRUGS: Drug[] = [
  {
    id: 'weed',
    name: 'Weed',
    tier: 1,
    productionTimeMs: 2 * 60_000,
    setupCost: 50,
    yield: 120,
    heat: 2,
    repRequired: 0,
  },
  {
    id: 'pills',
    name: 'Pills',
    tier: 1,
    productionTimeMs: 3 * 60_000,
    setupCost: 80,
    yield: 200,
    heat: 3,
    repRequired: 0,
  },
  {
    id: 'cocaine',
    name: 'Cocaine',
    tier: 2,
    productionTimeMs: 8 * 60_000,
    setupCost: 500,
    yield: 1_400,
    heat: 8,
    repRequired: 25,
  },
  {
    id: 'meth',
    name: 'Meth',
    tier: 3,
    productionTimeMs: 15 * 60_000,
    setupCost: 1_200,
    yield: 3_500,
    heat: 12,
    repRequired: 50,
  },
]

export const DRUG_MAP: Record<DrugId, Drug> = Object.fromEntries(
  DRUGS.map((d) => [d.id, d])
) as Record<DrugId, Drug>
