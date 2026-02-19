import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data
const matches = [
  {
    id: '1',
    title: 'Pichanga Semanal',
    date: '2026-02-20',
    time: '19:00',
    location: 'Cancha Los Leones',
    format: '5v5' as const,
    status: 'open' as const,
    players_joined: 7,
    players_needed: 10,
    home_color: '#ef4444',
    away_color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Partido del Viernes',
    date: '2026-02-21',
    time: '20:30',
    location: 'Complejo Deportivo Sur',
    format: '7v7' as const,
    status: 'open' as const,
    players_joined: 12,
    players_needed: 14,
    home_color: '#22c55e',
    away_color: '#f97316',
  },
  {
    id: '3',
    title: 'Clásico Dominguero',
    date: '2026-02-23',
    time: '11:00',
    location: 'Parque O\'Higgins',
    format: '11v11' as const,
    status: 'open' as const,
    players_joined: 18,
    players_needed: 22,
    home_color: '#ffffff',
    away_color: '#000000',
  },
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function Matches() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Partidos</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-secondary transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filtrar</span>
        </button>
      </div>

      {/* Filters (simplified) */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Todos', '5v5', '7v7', '11v11', 'Esta semana'].map((filter, idx) => (
          <button
            key={filter}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              idx === 0 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Match List */}
      <div className="space-y-4">
        {matches.map((match) => (
          <Link
            key={match.id}
            to={`/partido/${match.id}`}
            className="block p-4 rounded-xl border bg-card hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{match.title}</h3>
                <p className="text-sm text-muted-foreground">{match.format}</p>
              </div>
              <div className="flex gap-2 items-center">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: match.home_color }}
                />
                <span className="text-muted-foreground text-sm">vs</span>
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: match.away_color }}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(match.date)} • {match.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{match.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className={cn(
                  match.players_joined === match.players_needed 
                    ? "text-primary font-medium" 
                    : ""
                )}>
                  {match.players_joined}/{match.players_needed}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${(match.players_joined / match.players_needed) * 100}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
