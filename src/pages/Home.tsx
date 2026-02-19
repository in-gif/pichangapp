import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data for demo
const upcomingMatches = [
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
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="text-center py-8">
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido a PichangApp! ⚽</h1>
        <p className="text-muted-foreground">
          Organiza partidos, únete a pichangas y juega con tus amigos
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        <Link
          to="/crear-partido"
          className="flex flex-col items-center gap-3 p-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="w-10 h-10" />
          <span className="font-semibold">Crear Partido</span>
        </Link>
        <Link
          to="/partidos"
          className="flex flex-col items-center gap-3 p-6 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <Calendar className="w-10 h-10" />
          <span className="font-semibold">Ver Partidos</span>
        </Link>
      </section>

      {/* Upcoming Matches */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Próximos Partidos</h2>
        <div className="space-y-4">
          {upcomingMatches.map((match) => (
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
                <div className="flex gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: match.home_color }}
                  />
                  <span className="text-muted-foreground">vs</span>
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
                    {match.players_joined}/{match.players_needed} jugadores
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
