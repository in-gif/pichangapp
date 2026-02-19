import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

// Formaciones por tipo de partido - coordenadas en % (x, y) para cada slot
// Y=0 es arriba (arco rival), Y=100 es abajo (arco propio)
const FORMATIONS: Record<string, { x: number; y: number; label: string }[]> = {
  '5v5': [
    { x: 50, y: 95, label: 'POR' },  // Portero
    { x: 30, y: 68, label: 'DEF' },  // Defensa izq
    { x: 70, y: 68, label: 'DEF' },  // Defensa der
    { x: 50, y: 40, label: 'VOL' },  // Volante
    { x: 50, y: 12, label: 'DEL' },  // Delantero
  ],
  '6v6': [
    { x: 50, y: 92, label: 'POR' },
    { x: 30, y: 72, label: 'DEF' },
    { x: 70, y: 72, label: 'DEF' },
    { x: 30, y: 45, label: 'VOL' },
    { x: 70, y: 45, label: 'VOL' },
    { x: 50, y: 18, label: 'DEL' },
  ],
  '7v7': [
    { x: 50, y: 92, label: 'POR' },
    { x: 25, y: 72, label: 'DEF' },
    { x: 50, y: 75, label: 'LIB' },  // Líbero
    { x: 75, y: 72, label: 'DEF' },
    { x: 35, y: 45, label: 'VOL' },
    { x: 65, y: 45, label: 'VOL' },
    { x: 50, y: 18, label: 'DEL' },
  ],
  '8v8': [
    { x: 50, y: 92, label: 'POR' },
    { x: 20, y: 72, label: 'DEF' },
    { x: 50, y: 75, label: 'LIB' },
    { x: 80, y: 72, label: 'DEF' },
    { x: 25, y: 45, label: 'VOL' },
    { x: 50, y: 42, label: 'ENG' },  // Enganche
    { x: 75, y: 45, label: 'VOL' },
    { x: 50, y: 18, label: 'DEL' },
  ],
  '11v11': [
    { x: 50, y: 93, label: 'POR' },
    { x: 15, y: 75, label: 'LI' },   // Lateral izq
    { x: 38, y: 78, label: 'DFC' },  // Central izq
    { x: 62, y: 78, label: 'DFC' },  // Central der
    { x: 85, y: 75, label: 'LD' },   // Lateral der
    { x: 30, y: 55, label: 'MCD' },  // Mediocampista def
    { x: 70, y: 55, label: 'MCD' },
    { x: 50, y: 40, label: 'MCO' },  // Mediocampista of
    { x: 20, y: 22, label: 'EI' },   // Extremo izq
    { x: 50, y: 15, label: 'DC' },   // Delantero centro
    { x: 80, y: 22, label: 'ED' },   // Extremo der
  ],
}

// Mock data para demo
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
  // Cada equipo tiene slots numerados, player puede ser null (vacante)
  home_players: [
    { slot: 0, player: { name: 'Carlos M.', avatar: null } },
    { slot: 1, player: { name: 'Diego P.', avatar: null } },
    { slot: 2, player: null }, // Vacante
    { slot: 3, player: { name: 'Andrés R.', avatar: null } },
    { slot: 4, player: { name: 'Felipe S.', avatar: null } },
  ],
  away_players: [
    { slot: 0, player: { name: 'Martín L.', avatar: null } },
    { slot: 1, player: null },
    { slot: 2, player: { name: 'Lucas G.', avatar: null } },
    { slot: 3, player: null },
    { slot: 4, player: null },
  ],
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

interface PlayerSlotProps {
  player: { name: string; avatar: string | null } | null
  x: number
  y: number
  label: string
  teamColor: string
}

function PlayerSlot({ player, x, y, label, teamColor }: PlayerSlotProps) {
  const isEmpty = !player

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div
        className={cn(
          "w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-lg transition-transform hover:scale-110 cursor-pointer",
          isEmpty && "border-dashed opacity-50 hover:opacity-80"
        )}
        style={{ backgroundColor: isEmpty ? '#555' : teamColor }}
      >
        {player ? getInitials(player.name) : '?'}
      </div>
      <span className="text-[10px] font-medium text-white bg-black/60 px-1.5 py-0.5 rounded whitespace-nowrap">
        {player ? player.name.split(' ')[0] : label}
      </span>
    </div>
  )
}

interface PitchLineupProps {
  format: string
  homePlayers: typeof mockMatch.home_players
  awayPlayers: typeof mockMatch.away_players
  homeColor: string
  awayColor: string
}

function PitchLineup({ format, homePlayers, awayPlayers, homeColor, awayColor }: PitchLineupProps) {
  const formation = FORMATIONS[format] || FORMATIONS['5v5']
  
  return (
    <div className="relative w-full aspect-[2/3] max-w-sm mx-auto rounded-xl overflow-hidden shadow-xl">
      {/* Cancha */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-600">
        {/* Líneas del campo */}
        <div className="absolute inset-3 border-2 border-white/30 rounded">
          {/* Línea central */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30" />
          {/* Círculo central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/30 rounded-full" />
          {/* Área grande arriba (equipo visita) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[15%] border-2 border-t-0 border-white/30" />
          {/* Área chica arriba */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[8%] border-2 border-t-0 border-white/30" />
          {/* Área grande abajo (equipo local) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[15%] border-2 border-b-0 border-white/30" />
          {/* Área chica abajo */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[8%] border-2 border-b-0 border-white/30" />
        </div>
      </div>

      {/* Equipo Visita (arriba - coordenadas invertidas) */}
      {formation.map((pos, idx) => {
        const awaySlot = awayPlayers.find(p => p.slot === idx)
        // Invertir Y y escalar a rango 5-42% (mitad superior)
        // pos.y va de ~12 (delantero) a ~95 (portero)
        // queremos: delantero cerca del centro (~38%), portero arriba (~5%)
        const normalizedY = (pos.y - 10) / 90  // normalizar 10-100 a 0-1
        const awayY = 5 + (1 - normalizedY) * 36  // portero=5%, delantero=38%
        return (
          <PlayerSlot
            key={`away-${idx}`}
            player={awaySlot?.player || null}
            x={pos.x}
            y={awayY}
            label={pos.label}
            teamColor={awayColor}
          />
        )
      })}

      {/* Equipo Local (abajo) */}
      {formation.map((pos, idx) => {
        const homeSlot = homePlayers.find(p => p.slot === idx)
        // Escalar a rango 58-91% (mitad inferior)
        // queremos: delantero cerca del centro (~58%), portero abajo (~91%)
        const normalizedY = (pos.y - 10) / 90  // normalizar 10-100 a 0-1
        const homeY = 58 + normalizedY * 33  // delantero=58%, portero=91%
        return (
          <PlayerSlot
            key={`home-${idx}`}
            player={homeSlot?.player || null}
            x={pos.x}
            y={homeY}
            label={pos.label}
            teamColor={homeColor}
          />
        )
      })}

      {/* Badge VS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-10">
        <span className="font-bold text-gray-800 text-sm">VS</span>
      </div>
    </div>
  )
}

export default function Match() {
  const { id } = useParams()
  // En la app real, buscar por id - por ahora usamos mock
  const match = id ? mockMatch : mockMatch

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const formation = FORMATIONS[match.format] || FORMATIONS['5v5']
  const slotsPerTeam = formation.length
  const homeFilledCount = match.home_players.filter(p => p.player).length
  const awayFilledCount = match.away_players.filter(p => p.player).length
  const totalPlayers = homeFilledCount + awayFilledCount
  const totalSlots = slotsPerTeam * 2

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

      {/* Leyenda de equipos */}
      <div className="flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: match.home_color }}
          />
          <span className="text-sm font-medium">Local ({homeFilledCount}/{slotsPerTeam})</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: match.away_color }}
          />
          <span className="text-sm font-medium">Visita ({awayFilledCount}/{slotsPerTeam})</span>
        </div>
      </div>

      {/* Cancha con formación */}
      <PitchLineup
        format={match.format}
        homePlayers={match.home_players}
        awayPlayers={match.away_players}
        homeColor={match.home_color}
        awayColor={match.away_color}
      />

      {/* Botón unirse */}
      <div className="sticky bottom-20 pt-4">
        <button className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg">
          Unirse al Partido
        </button>
      </div>
    </div>
  )
}
