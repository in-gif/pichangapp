import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, ArrowLeft, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Match, MatchPlayer, MatchFormat, Profile } from '@/types'
import { getSlotsPerTeam } from '@/types'

// Formaciones por tipo de partido
const FORMATIONS: Record<string, { x: number; y: number; label: string }[]> = {
  '5v5': [
    { x: 50, y: 95, label: 'POR' },
    { x: 30, y: 68, label: 'DEF' },
    { x: 70, y: 68, label: 'DEF' },
    { x: 50, y: 40, label: 'VOL' },
    { x: 50, y: 12, label: 'DEL' },
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
    { x: 50, y: 75, label: 'LIB' },
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
    { x: 50, y: 42, label: 'ENG' },
    { x: 75, y: 45, label: 'VOL' },
    { x: 50, y: 18, label: 'DEL' },
  ],
  '11v11': [
    { x: 50, y: 93, label: 'POR' },
    { x: 15, y: 75, label: 'LI' },
    { x: 38, y: 78, label: 'DFC' },
    { x: 62, y: 78, label: 'DFC' },
    { x: 85, y: 75, label: 'LD' },
    { x: 30, y: 55, label: 'MCD' },
    { x: 70, y: 55, label: 'MCD' },
    { x: 50, y: 40, label: 'MCO' },
    { x: 20, y: 22, label: 'EI' },
    { x: 50, y: 15, label: 'DC' },
    { x: 80, y: 22, label: 'ED' },
  ],
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

interface PlayerSlotProps {
  player: Profile | null
  x: number
  y: number
  label: string
  teamColor: string
  onJoin?: () => void
}

function PlayerSlot({ player, x, y, label, teamColor, onJoin }: PlayerSlotProps) {
  const isEmpty = !player

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <button
        onClick={isEmpty ? onJoin : undefined}
        disabled={!isEmpty}
        className={cn(
          "w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-lg transition-transform hover:scale-110",
          isEmpty && "border-dashed opacity-50 hover:opacity-80 cursor-pointer"
        )}
        style={{ backgroundColor: isEmpty ? '#555' : teamColor }}
      >
        {player ? getInitials(player.name) : '?'}
      </button>
      <span className="text-[10px] font-medium text-white bg-black/60 px-1.5 py-0.5 rounded whitespace-nowrap">
        {player ? player.name.split(' ')[0] : label}
      </span>
    </div>
  )
}

interface PitchLineupProps {
  format: MatchFormat
  homePlayers: MatchPlayer[]
  awayPlayers: MatchPlayer[]
  homeColor: string
  awayColor: string
}

function PitchLineup({ format, homePlayers, awayPlayers, homeColor, awayColor }: PitchLineupProps) {
  const formation = FORMATIONS[format] || FORMATIONS['5v5']
  
  return (
    <div className="relative w-full aspect-[2/3] max-w-sm mx-auto rounded-xl overflow-hidden shadow-xl">
      {/* Cancha */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-600">
        <div className="absolute inset-3 border-2 border-white/30 rounded">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/30 rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[15%] border-2 border-t-0 border-white/30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[8%] border-2 border-t-0 border-white/30" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[15%] border-2 border-b-0 border-white/30" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[8%] border-2 border-b-0 border-white/30" />
        </div>
      </div>

      {/* Equipo Visita (arriba) */}
      {formation.map((pos, idx) => {
        const awaySlot = awayPlayers.find(p => p.slot === idx)
        const normalizedY = (pos.y - 10) / 90
        const awayY = 5 + (1 - normalizedY) * 36
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
        const normalizedY = (pos.y - 10) / 90
        const homeY = 58 + normalizedY * 33
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

export default function MatchPage() {
  const { id } = useParams()
  const [match, setMatch] = useState<Match | null>(null)
  const [homePlayers, setHomePlayers] = useState<MatchPlayer[]>([])
  const [awayPlayers, setAwayPlayers] = useState<MatchPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatch() {
      if (!id) return

      try {
        // Fetch match
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .select('*')
          .eq('id', id)
          .single()

        if (matchError) throw matchError
        setMatch(matchData)

        // Fetch players with profiles
        const { data: playersData, error: playersError } = await supabase
          .from('match_players')
          .select(`
            *,
            player:profiles(*)
          `)
          .eq('match_id', id)

        if (playersError) throw playersError

        const home = (playersData || []).filter(p => p.team === 'home')
        const away = (playersData || []).filter(p => p.team === 'away')
        
        setHomePlayers(home)
        setAwayPlayers(away)
      } catch (err) {
        console.error('Error fetching match:', err)
        setError('Error al cargar el partido')
      } finally {
        setLoading(false)
      }
    }

    fetchMatch()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error || 'Partido no encontrado'}</p>
        <Link to="/" className="text-green-600 hover:underline">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const slotsPerTeam = getSlotsPerTeam(match.format as MatchFormat)
  const totalPlayers = homePlayers.length + awayPlayers.length
  const totalSlots = slotsPerTeam * 2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/" 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{match.title}</h1>
          <p className="text-gray-500">{match.format}</p>
        </div>
      </div>

      {/* Match Info */}
      <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-gray-50">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span>{formatDate(match.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <span>{match.time.slice(0, 5)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-400" />
          {match.location_url ? (
            <a 
              href={match.location_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              {match.location}
            </a>
          ) : (
            <span>{match.location}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span>{totalPlayers}/{totalSlots} jugadores</span>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: match.home_color }}
          />
          <span className="text-sm font-medium">Local ({homePlayers.length}/{slotsPerTeam})</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: match.away_color }}
          />
          <span className="text-sm font-medium">Visita ({awayPlayers.length}/{slotsPerTeam})</span>
        </div>
      </div>

      {/* Cancha */}
      <PitchLineup
        format={match.format as MatchFormat}
        homePlayers={homePlayers}
        awayPlayers={awayPlayers}
        homeColor={match.home_color}
        awayColor={match.away_color}
      />

      {/* Botón unirse */}
      <div className="sticky bottom-20 pt-4">
        <button className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg">
          Unirse al Partido
        </button>
      </div>
    </div>
  )
}
