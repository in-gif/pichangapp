import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Position } from '@/types'
import { POSITION_LABELS_SHORT } from '@/types'

// Mock data for demo
const mockMatch = {
  id: '1',
  title: 'Pichanga Semanal',
  date: '2026-02-20',
  time: '19:00',
  location: 'Cancha Los Leones',
  location_url: 'https://maps.google.com',
  format: '5v5' as const,
  status: 'open' as const,
  home_color: '#ef4444',
  away_color: '#3b82f6',
  home_lineup: [
    { slot: 1, position: 'goalkeeper' as Position, player: { name: 'Carlos M.', avatar: null } },
    { slot: 2, position: 'defender' as Position, player: { name: 'Diego P.', avatar: null } },
    { slot: 3, position: 'midfielder' as Position, player: { name: 'Andrés R.', avatar: null } },
    { slot: 4, position: 'midfielder' as Position, player: null },
    { slot: 5, position: 'forward' as Position, player: { name: 'Felipe S.', avatar: null } },
  ],
  away_lineup: [
    { slot: 1, position: 'goalkeeper' as Position, player: { name: 'Martín L.', avatar: null } },
    { slot: 2, position: 'defender' as Position, player: null },
    { slot: 3, position: 'midfielder' as Position, player: { name: 'Lucas G.', avatar: null } },
    { slot: 4, position: 'midfielder' as Position, player: null },
    { slot: 5, position: 'forward' as Position, player: null },
  ],
}

// Position coordinates for 5v5 formation (percentage based)
const FORMATION_5V5 = {
  goalkeeper: [{ x: 50, y: 90 }],
  defender: [{ x: 50, y: 70 }],
  midfielder: [{ x: 30, y: 45 }, { x: 70, y: 45 }],
  forward: [{ x: 50, y: 20 }],
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

interface PlayerSlotProps {
  position: Position
  player: { name: string; avatar: string | null } | null
  x: number
  y: number
  teamColor: string
  isHome: boolean
}

function PlayerSlot({ position, player, x, y, teamColor, isHome: _isHome }: PlayerSlotProps) {
  const isEmpty = !player

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-lg transition-transform hover:scale-110",
          isEmpty && "border-dashed opacity-60 cursor-pointer hover:opacity-100"
        )}
        style={{ backgroundColor: isEmpty ? '#666' : teamColor }}
      >
        {player ? getInitials(player.name) : '?'}
      </div>
      <span className="text-xs font-medium text-white bg-black/50 px-2 py-0.5 rounded">
        {player ? player.name.split(' ')[0] : POSITION_LABELS_SHORT[position]}
      </span>
    </div>
  )
}

function PitchLineup({ 
  homeLineup, 
  awayLineup, 
  homeColor, 
  awayColor 
}: { 
  homeLineup: typeof mockMatch.home_lineup
  awayLineup: typeof mockMatch.away_lineup
  homeColor: string
  awayColor: string
}) {
  // Group players by position
  const getPositionPlayers = (lineup: typeof homeLineup, position: Position) => {
    return lineup.filter(p => p.position === position)
  }

  return (
    <div className="relative w-full aspect-[3/4] max-w-md mx-auto rounded-xl overflow-hidden shadow-xl">
      {/* Pitch Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-600 to-green-700">
        {/* Field markings */}
        <div className="absolute inset-4 border-2 border-white/40 rounded-lg">
          {/* Center line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/40 rounded-full" />
          {/* Goal areas */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-12 border-2 border-t-0 border-white/40" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 border-2 border-b-0 border-white/40" />
        </div>
      </div>

      {/* Away Team (Top Half) */}
      <div className="absolute top-0 left-0 right-0 h-1/2">
        {(['goalkeeper', 'defender', 'midfielder', 'forward'] as Position[]).map(position => {
          const players = getPositionPlayers(awayLineup, position)
          const coords = FORMATION_5V5[position]
          
          return players.map((p, idx) => {
            const coord = coords[idx] || coords[0]
            // Flip Y for away team (they're on top)
            const adjustedY = 100 - coord.y
            return (
              <PlayerSlot
                key={`away-${p.slot}`}
                position={p.position}
                player={p.player}
                x={coord.x}
                y={adjustedY * 2} // Scale to half
                teamColor={awayColor}
                isHome={false}
              />
            )
          })
        })}
      </div>

      {/* Home Team (Bottom Half) */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2">
        {(['goalkeeper', 'defender', 'midfielder', 'forward'] as Position[]).map(position => {
          const players = getPositionPlayers(homeLineup, position)
          const coords = FORMATION_5V5[position]
          
          return players.map((p, idx) => {
            const coord = coords[idx] || coords[0]
            return (
              <PlayerSlot
                key={`home-${p.slot}`}
                position={p.position}
                player={p.player}
                x={coord.x}
                y={coord.y * 2} // Scale to half
                teamColor={homeColor}
                isHome={true}
              />
            )
          })
        })}
      </div>

      {/* VS Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-10">
        <span className="font-bold text-gray-800">VS</span>
      </div>
    </div>
  )
}

export default function Match() {
  const { id } = useParams()
  // In real app, fetch by id - for now we use mock data
  const match = id ? mockMatch : mockMatch

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const homePlayersCount = match.home_lineup.filter(p => p.player).length
  const awayPlayersCount = match.away_lineup.filter(p => p.player).length
  const totalPlayers = homePlayersCount + awayPlayersCount
  const totalSlots = match.home_lineup.length + match.away_lineup.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/partidos" 
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{match.title}</h1>
          <p className="text-muted-foreground">{match.format}</p>
        </div>
      </div>

      {/* Match Info */}
      <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-secondary/50">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span>{formatDate(match.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <span>{match.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <a 
            href={match.location_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {match.location}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <span>{totalPlayers}/{totalSlots} jugadores</span>
        </div>
      </div>

      {/* Team Colors Legend */}
      <div className="flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: match.home_color }}
          />
          <span className="font-medium">Equipo Local</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: match.away_color }}
          />
          <span className="font-medium">Equipo Visita</span>
        </div>
      </div>

      {/* Pitch Lineup */}
      <PitchLineup
        homeLineup={match.home_lineup}
        awayLineup={match.away_lineup}
        homeColor={match.home_color}
        awayColor={match.away_color}
      />

      {/* Join Button */}
      <div className="sticky bottom-20 pt-4">
        <button className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg">
          Unirse al Partido
        </button>
      </div>
    </div>
  )
}
