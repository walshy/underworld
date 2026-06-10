import { useState } from 'react'
import { ArrowLeft, Lock } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { usePlayerStore } from '../store/playerStore'

// ─── Types ────────────────────────────────────────────────────────────────────

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
type Phase = 'idle' | 'playing' | 'result'
type GameResult = 'blackjack' | 'win' | 'lose' | 'push' | null
type ChipValue = 10 | 50 | 100

interface GameCard { suit: Suit; rank: Rank }

interface GameState {
  phase: Phase
  deck: GameCard[]
  playerHand: GameCard[]
  dealerHand: GameCard[]
  holeHidden: boolean
  bet: number
  result: GameResult
  winAmount: number
  sessionHands: number
  sessionWins: number
  sessionLosses: number
  sessionProfit: number
}

// ─── Deck Utilities ───────────────────────────────────────────────────────────

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const SUIT_SYM: Record<Suit, string> = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }

function shuffledDeck(): GameCard[] {
  const deck: GameCard[] = []
  for (const suit of SUITS) for (const rank of RANKS) deck.push({ suit, rank })
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function rankVal(rank: Rank): number {
  if (rank === 'A') return 11
  if (['J', 'Q', 'K'].includes(rank)) return 10
  return parseInt(rank, 10)
}

function handVal(hand: GameCard[]): number {
  let total = hand.reduce((s, c) => s + rankVal(c.rank), 0)
  let aces = hand.filter(c => c.rank === 'A').length
  while (total > 21 && aces-- > 0) total -= 10
  return total
}

const isBust = (hand: GameCard[]) => handVal(hand) > 21
const isBlackjack = (hand: GameCard[]) => hand.length === 2 && handVal(hand) === 21

// ─── Card Components ──────────────────────────────────────────────────────────

function FaceCard({ card }: { card: GameCard }) {
  const red = card.suit === 'hearts' || card.suit === 'diamonds'
  const col = red ? '#CC2222' : '#111111'
  const sym = SUIT_SYM[card.suit]
  return (
    <svg viewBox="0 0 60 84" className="block w-full">
      <rect width="60" height="84" rx="4" fill="#F8F8F0" stroke="#999" strokeWidth="1" />
      <text x="5" y="15" fontSize="11" fontFamily="'Courier New',monospace" fontWeight="bold" fill={col}>
        {card.rank}
      </text>
      <text x="6" y="26" fontSize="11" fontFamily="serif" fill={col}>{sym}</text>
      <text x="30" y="42" fontSize="28" fontFamily="serif" fill={col} textAnchor="middle" dominantBaseline="middle">
        {sym}
      </text>
      <g transform="rotate(180,30,42)">
        <text x="5" y="15" fontSize="11" fontFamily="'Courier New',monospace" fontWeight="bold" fill={col}>
          {card.rank}
        </text>
        <text x="6" y="26" fontSize="11" fontFamily="serif" fill={col}>{sym}</text>
      </g>
    </svg>
  )
}

function CardBack() {
  return (
    <img
      src="/assets/images/golden-serpent-card-back.png.png"
      alt="card"
      className="block w-full h-auto pixel-art"
    />
  )
}

function PlayingCard({ card, faceDown = false }: { card: GameCard; faceDown?: boolean }) {
  return (
    <div className="inline-block w-20 md:w-[120px] rounded overflow-hidden shadow-lg">
      {faceDown ? <CardBack /> : <FaceCard card={card} />}
    </div>
  )
}

// ─── Chip SVG Components ──────────────────────────────────────────────────────

function Chip10() {
  return (
    <svg viewBox="0 0 64 64" width="80" height="80">
      <circle cx="32" cy="32" r="30" fill="#1a0000" stroke="#111" strokeWidth="1" />
      <circle cx="32" cy="32" r="28" fill="#cc2200" />
      <circle cx="32" cy="32" r="24" fill="#cc2200" stroke="#ff6644" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="32" cy="32" r="18" fill="#dd3311" stroke="#ff4422" strokeWidth="1" />
      <text x="32" y="37" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#ffffff">
        $10
      </text>
      <circle cx="32" cy="4" r="2.5" fill="#ff9977" />
      <circle cx="32" cy="60" r="2.5" fill="#ff9977" />
      <circle cx="4" cy="32" r="2.5" fill="#ff9977" />
      <circle cx="60" cy="32" r="2.5" fill="#ff9977" />
    </svg>
  )
}

function Chip50() {
  return (
    <svg viewBox="0 0 64 64" width="80" height="80">
      <circle cx="32" cy="32" r="30" fill="#001a33" stroke="#111" strokeWidth="1" />
      <circle cx="32" cy="32" r="28" fill="#0044aa" />
      <circle cx="32" cy="32" r="24" fill="#0044aa" stroke="#4488ff" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="32" cy="32" r="18" fill="#0055cc" stroke="#3377ff" strokeWidth="1" />
      <text x="32" y="37" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#ffffff">
        $50
      </text>
      <circle cx="32" cy="4" r="2.5" fill="#88aaff" />
      <circle cx="32" cy="60" r="2.5" fill="#88aaff" />
      <circle cx="4" cy="32" r="2.5" fill="#88aaff" />
      <circle cx="60" cy="32" r="2.5" fill="#88aaff" />
    </svg>
  )
}

function Chip100() {
  return (
    <svg viewBox="0 0 64 64" width="80" height="80">
      <circle cx="32" cy="32" r="30" fill="#0a0a0a" stroke="#888" strokeWidth="1" />
      <circle cx="32" cy="32" r="28" fill="#1a1a1a" />
      <circle cx="32" cy="32" r="24" fill="#1a1a1a" stroke="#f5c518" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="32" cy="32" r="18" fill="#222222" stroke="#f5c518" strokeWidth="1.5" />
      <text x="32" y="37" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#f5c518">
        $100
      </text>
      <circle cx="32" cy="4" r="2.5" fill="#f5c518" />
      <circle cx="32" cy="60" r="2.5" fill="#f5c518" />
      <circle cx="4" cy="32" r="2.5" fill="#f5c518" />
      <circle cx="60" cy="32" r="2.5" fill="#f5c518" />
    </svg>
  )
}

const CHIPS: Array<{ value: ChipValue; Component: () => JSX.Element }> = [
  { value: 10, Component: Chip10 },
  { value: 50, Component: Chip50 },
  { value: 100, Component: Chip100 },
]

// ─── Casino Lobby ─────────────────────────────────────────────────────────────

function CasinoLobby({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-lg font-bold text-primary">Casino District</h1>
        <p className="text-sm text-secondary mt-1">
          Visit establishments, play the tables, or acquire your own
        </p>
      </div>

      <Card className="!p-6 border-border-accent">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5">
          <img
            src="/assets/images/golden-serpent-casino-logo.png"
            alt="The Golden Serpent"
            className="pixel-art rounded shrink-0 w-20 h-auto"
          />
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h2 className="text-xl font-medium text-primary">The Golden Serpent</h2>
              <p className="text-xs text-muted mt-0.5">
                Owner: <span className="text-secondary">Sal "The Viper" Moretti</span>
                <span className="text-muted"> · East Side Mob</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-0.5">Stakes</p>
                <p className="text-sm text-primary">Low</p>
                <p className="text-xs text-secondary">$10 – $200</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-0.5">House Edge</p>
                <p className="text-sm text-primary">5%</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-0.5">Status</p>
                <p className="text-sm text-success font-medium">Open</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Games:</span>
                <span className="text-xs text-secondary bg-bg-tertiary border border-border-default rounded px-2 py-0.5">
                  Blackjack
                </span>
              </div>
              <Button variant="primary" onClick={onEnter}>Enter Casino</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-border-default opacity-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-bg-tertiary border border-border-default flex items-center justify-center shrink-0">
            <Lock size={20} className="text-muted" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Your Casino</p>
            <p className="text-xs text-muted mt-0.5">Acquire territory to unlock</p>
          </div>
          <span className="ml-auto text-xs text-muted border border-border-default rounded px-2 py-1">
            Coming Soon
          </span>
        </div>
      </Card>
    </div>
  )
}

// ─── Blackjack Table ──────────────────────────────────────────────────────────

const INIT: GameState = {
  phase: 'idle',
  deck: [],
  playerHand: [],
  dealerHand: [],
  holeHidden: true,
  bet: 0,
  result: null,
  winAmount: 0,
  sessionHands: 0,
  sessionWins: 0,
  sessionLosses: 0,
  sessionProfit: 0,
}

function $$(n: number) {
  return `$${Math.abs(n).toLocaleString('en-US')}`
}

function resolveResult(pv: number, dv: number, dealerBust: boolean): 'win' | 'lose' | 'push' {
  if (dealerBust || pv > dv) return 'win'
  if (pv === dv) return 'push'
  return 'lose'
}

function BlackjackTable({ onLeave }: { onLeave: () => void }) {
  const { cash, addCash } = usePlayerStore()
  const [gs, setGs] = useState<GameState>(INIT)
  const [pendingChips, setPendingChips] = useState<ChipValue[]>([])

  const pendingBet = pendingChips.reduce((s, v) => s + v, 0)
  const broke = cash === 0 && gs.phase !== 'playing'

  // ── Actions ────────────────────────────────────────────────────────────────

  function deal() {
    if (pendingBet === 0 || pendingBet > cash) return
    const deck = shuffledDeck()
    const player: GameCard[] = [deck.shift()!, deck.shift()!]
    const dealer: GameCard[] = [deck.shift()!, deck.shift()!]
    const thisBet = pendingBet

    addCash(-thisBet)
    setPendingChips([])

    const pBJ = isBlackjack(player)
    const dBJ = isBlackjack(dealer)

    if (pBJ || dBJ) {
      let result: GameResult
      let winAmount: number
      if (pBJ && dBJ) {
        result = 'push'; winAmount = 0; addCash(thisBet)
      } else if (pBJ) {
        result = 'blackjack'; winAmount = Math.floor(thisBet * 1.5); addCash(thisBet + winAmount)
      } else {
        result = 'lose'; winAmount = -thisBet
      }
      setGs(prev => ({
        ...prev, phase: 'result', deck, playerHand: player, dealerHand: dealer,
        holeHidden: false, bet: thisBet, result, winAmount,
        sessionHands: prev.sessionHands + 1,
        sessionWins: prev.sessionWins + (result === 'blackjack' ? 1 : 0),
        sessionLosses: prev.sessionLosses + (result === 'lose' ? 1 : 0),
        sessionProfit: prev.sessionProfit + winAmount,
      }))
      return
    }

    setGs(prev => ({
      ...prev, phase: 'playing', deck, playerHand: player, dealerHand: dealer,
      holeHidden: true, bet: thisBet, result: null, winAmount: 0,
    }))
  }

  function hit() {
    if (gs.phase !== 'playing') return
    const deck = [...gs.deck]
    const playerHand = [...gs.playerHand, deck.shift()!]
    if (isBust(playerHand)) {
      setGs(prev => ({
        ...prev, deck, playerHand, holeHidden: false, phase: 'result',
        result: 'lose', winAmount: -prev.bet,
        sessionHands: prev.sessionHands + 1,
        sessionLosses: prev.sessionLosses + 1,
        sessionProfit: prev.sessionProfit - prev.bet,
      }))
    } else {
      setGs(prev => ({ ...prev, deck, playerHand }))
    }
  }

  function runDealer(deck: GameCard[], dealerHand: GameCard[]) {
    const d = [...dealerHand]
    const dk = [...deck]
    while (handVal(d) < 17) d.push(dk.shift()!)
    return { dealerHand: d, deck: dk }
  }

  function stand() {
    if (gs.phase !== 'playing') return
    const { dealerHand, deck } = runDealer(gs.deck, gs.dealerHand)
    const pv = handVal(gs.playerHand)
    const dv = handVal(dealerHand)
    const result = resolveResult(pv, dv, isBust(dealerHand))
    const winAmount = result === 'win' ? gs.bet : result === 'push' ? 0 : -gs.bet

    if (result === 'win') addCash(gs.bet * 2)
    if (result === 'push') addCash(gs.bet)

    setGs(prev => ({
      ...prev, deck, dealerHand, holeHidden: false, phase: 'result', result, winAmount,
      sessionHands: prev.sessionHands + 1,
      sessionWins: prev.sessionWins + (result === 'win' ? 1 : 0),
      sessionLosses: prev.sessionLosses + (result === 'lose' ? 1 : 0),
      sessionProfit: prev.sessionProfit + winAmount,
    }))
  }

  function doubleDown() {
    if (gs.phase !== 'playing' || gs.playerHand.length !== 2 || cash < gs.bet) return
    addCash(-gs.bet)
    const doubleBet = gs.bet * 2
    const deck0 = [...gs.deck]
    const playerHand = [...gs.playerHand, deck0.shift()!]

    if (isBust(playerHand)) {
      setGs(prev => ({
        ...prev, deck: deck0, playerHand, holeHidden: false, bet: doubleBet,
        phase: 'result', result: 'lose', winAmount: -doubleBet,
        sessionHands: prev.sessionHands + 1,
        sessionLosses: prev.sessionLosses + 1,
        sessionProfit: prev.sessionProfit - doubleBet,
      }))
      return
    }

    const { dealerHand, deck } = runDealer(deck0, gs.dealerHand)
    const pv = handVal(playerHand)
    const dv = handVal(dealerHand)
    const result = resolveResult(pv, dv, isBust(dealerHand))
    const winAmount = result === 'win' ? doubleBet : result === 'push' ? 0 : -doubleBet

    if (result === 'win') addCash(doubleBet * 2)
    if (result === 'push') addCash(doubleBet)

    setGs(prev => ({
      ...prev, deck, playerHand, dealerHand, holeHidden: false, bet: doubleBet,
      phase: 'result', result, winAmount,
      sessionHands: prev.sessionHands + 1,
      sessionWins: prev.sessionWins + (result === 'win' ? 1 : 0),
      sessionLosses: prev.sessionLosses + (result === 'lose' ? 1 : 0),
      sessionProfit: prev.sessionProfit + winAmount,
    }))
  }

  function nextHand() {
    setGs(prev => ({
      ...INIT,
      sessionHands: prev.sessionHands,
      sessionWins: prev.sessionWins,
      sessionLosses: prev.sessionLosses,
      sessionProfit: prev.sessionProfit,
    }))
    setPendingChips([])
  }

  // ── Derived display ──────────────────────────────────────────────────────────

  const playerVal = gs.playerHand.length > 0 ? handVal(gs.playerHand) : null
  const dealerVisible = gs.dealerHand.length > 0
    ? gs.holeHidden
      ? rankVal(gs.dealerHand[0].rank)
      : handVal(gs.dealerHand)
    : null

  const canDouble = gs.phase === 'playing' && gs.playerHand.length === 2 && cash >= gs.bet

  const resultLabel =
    gs.result === 'blackjack' ? 'Blackjack!' :
    gs.result === 'win' ? 'You Win!' :
    gs.result === 'push' ? 'Push' :
    isBust(gs.playerHand) ? 'Bust' : 'Dealer Wins'

  const resultColor =
    gs.result === 'blackjack' || gs.result === 'win' ? 'text-gold' :
    gs.result === 'push' ? 'text-secondary' : 'text-danger'

  const resultSub =
    gs.result === 'push' ? 'Bet returned' :
    gs.result === 'win' || gs.result === 'blackjack'
      ? `+${$$(gs.winAmount)}`
      : `-${$$(gs.winAmount)}`

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Leave table bar */}
      <div className="shrink-0 flex items-center justify-between h-12 px-4 md:px-6 bg-bg-secondary border-b border-border-default">
        <button
          type="button"
          onClick={onLeave}
          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Leave Table
        </button>
        <p className="text-sm font-semibold text-primary hidden md:block">The Golden Serpent — Blackjack</p>
        <div className="flex items-center gap-3 md:gap-4 text-xs">
          <span className="text-muted">
            W: <span className="text-success">{gs.sessionWins}</span>
            {' / '}
            L: <span className="text-danger">{gs.sessionLosses}</span>
          </span>
          <span className={gs.sessionProfit >= 0 ? 'text-gold' : 'text-danger'}>
            {gs.sessionProfit >= 0 ? '+' : '-'}{$$(gs.sessionProfit)}
          </span>
          <span className="text-muted hidden md:inline">Cash: <span className="text-gold font-bold">{$$(cash)}</span></span>
        </div>
      </div>

      {/* Felt table — fills remaining height, no scroll */}
      <div className="flex-1 relative flex flex-col overflow-hidden bg-felt rounded-b-xl border-x border-b border-border-accent">

        {/* ── Dealer zone — top strip ── */}
        <div className="shrink-0 flex flex-col items-center gap-2 px-4 md:px-8 py-3 md:py-4 bg-dealer-zone">
          <img
            src="/assets/images/golden-serpent-dealer-npc.png"
            alt="The Viper's Dealer"
            className="pixel-art object-contain max-h-[25vh] w-auto"
          />
          <p className="text-sm font-medium text-secondary">The Viper's Dealer</p>
          {dealerVisible !== null && (
            <p className="text-sm font-mono text-primary">
              {gs.holeHidden
                ? `${dealerVisible} + ?`
                : `${dealerVisible}${handVal(gs.dealerHand) > 21 ? ' — Bust' : ''}`}
            </p>
          )}
          <div className="flex gap-3 flex-wrap justify-center items-center">
            {gs.dealerHand.map((card, i) => (
              <PlayingCard key={i} card={card} faceDown={i === 1 && gs.holeHidden} />
            ))}
          </div>
        </div>

        {/* ── Player zone — flex-1, space distributed ── */}
        <div className="flex-1 flex flex-col min-h-0 px-4 md:px-8 pt-3 md:pt-4">

          {/* Player cards — centred in available space */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-0">
            {gs.playerHand.length > 0 ? (
              <>
                <div className="flex gap-3 flex-wrap justify-center">
                  {gs.playerHand.map((card, i) => (
                    <PlayingCard key={i} card={card} />
                  ))}
                </div>
                {playerVal !== null && (
                  <p className="text-sm font-mono text-primary">
                    {playerVal}{playerVal > 21 ? ' — Bust' : ''}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-secondary opacity-60">Place your bet and deal to begin</p>
            )}
          </div>

          {/* Controls — pinned to bottom */}
          <div className="shrink-0 flex flex-col items-center gap-3 pb-4">
            <div className="flex items-center justify-center gap-4 md:gap-8 w-full">
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1">
                {CHIPS.map(({ value, Component }) => (
                  <button
                    key={value}
                    type="button"
                    disabled={gs.phase !== 'idle' || pendingBet + value > Math.min(cash, 200)}
                    onClick={() => {
                      if (gs.phase === 'idle' && pendingBet + value <= Math.min(cash, 200)) {
                        setPendingChips(chips => [...chips, value])
                      }
                    }}
                    className={`shrink-0 rounded-full transition-transform hover:enabled:scale-110 disabled:opacity-30 disabled:cursor-not-allowed ${pendingChips.includes(value) ? 'ring-2 ring-gold ring-offset-0' : ''}`}
                  >
                    <Component />
                  </button>
                ))}
              </div>

              <div className="text-center min-w-[72px] shrink-0">
                <p className="text-xs uppercase tracking-widest text-secondary mb-1">Bet</p>
                <button
                  type="button"
                  disabled={pendingChips.length === 0 || gs.phase !== 'idle'}
                  onClick={() => setPendingChips(chips => chips.slice(0, -1))}
                  title="Click to remove last chip"
                  className="text-xl font-bold text-gold transition-opacity hover:enabled:opacity-75 disabled:opacity-40"
                >
                  {$$(gs.phase === 'idle' ? pendingBet : gs.bet)}
                </button>
                {gs.phase === 'idle' && pendingChips.length > 0 && (
                  <p className="text-[10px] text-muted mt-0.5">tap to undo</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-sm md:flex-row md:w-auto md:max-w-none md:gap-3">
              {gs.phase === 'idle' && (
                <Button variant="primary" disabled={pendingBet === 0} onClick={deal} className="w-full md:w-auto">
                  Deal
                </Button>
              )}
              {gs.phase === 'playing' && (
                <>
                  <Button variant="primary" onClick={hit} className="w-full md:w-auto">Hit</Button>
                  <Button variant="primary" onClick={stand} className="w-full md:w-auto">Stand</Button>
                  <Button
                    variant="ghost"
                    disabled={!canDouble}
                    onClick={doubleDown}
                    className="w-full md:w-auto border border-gold text-gold hover:bg-gold-subtle"
                  >
                    Double Down
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Result overlay */}
        {gs.phase === 'result' && gs.result && !broke && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-fade-in bg-bg-secondary rounded-2xl px-10 py-6 flex flex-col items-center gap-3 border border-border-accent shadow-xl">
              <p className={`text-4xl font-bold ${resultColor}`}>{resultLabel}</p>
              <p className={`text-base ${resultColor}`}>{resultSub}</p>
              <Button variant="primary" onClick={nextHand} className="mt-2">
                Next Hand
              </Button>
            </div>
          </div>
        )}

        {/* Broke overlay */}
        {broke && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
            <div className="text-center space-y-4">
              <p className="text-3xl font-bold text-danger">You're Broke</p>
              <p className="text-sm text-muted">You've run out of cash</p>
              <Button variant="ghost" onClick={onLeave} className="border border-border-default">
                Back to Lobby
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Casino() {
  const [view, setView] = useState<'lobby' | 'table'>('lobby')
  if (view === 'table') return <BlackjackTable onLeave={() => setView('lobby')} />
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-6 pb-[72px] md:pb-6">
      <CasinoLobby onEnter={() => setView('table')} />
    </div>
  )
}
