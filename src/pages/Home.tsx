import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, PlusCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Match, MatchFormat } from '@/types'
import { getSlotsPerTeam } from '@/types'

interface MatchWithCounts extends Match {
  home_count: number
  away_count: number
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function Home() {
  const [matches, setMatches] = useState<MatchWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      try {
        // Fetch matches
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*')
          .in('status', ['open', 'full'])
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })
          .order('time', { ascending: true })
          .limit(10)

        if (matchesError) throw matchesError

        // Fetch player counts for each match
        const matchesWithCounts = await Promise.all(
          (matchesData || []).map(async (match) => {
            const { count: homeCount } = await supabase
              .from('match_players')
              .select('*', { count: 'exact', head: true })
              .eq('match_id', match.id)
              .eq('team', 'home')

            const { count: awayCount } = await supabase
              .from('match_players')
              .select('*', { count: 'exact', head: true })
              .eq('match_id', match.id)
              .eq('team', 'away')

            return {
              ...match,
              home_count: homeCount || 0,
              away_count: awayCount || 0,
            }
          })
        )

        setMatches(matchesWithCounts)
      } catch (err) {
        console.error('Error fetching matches:', err)
        setError('Error al cargar los partidos')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="text-center py-8">
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido a PichangApp! ⚽</h1>
        <p className="text-gray-500">
          Organiza partidos, únete a pichangas y juega con tus amigos
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        <Link
          to="/crear-partido"
          className="flex flex-col items-center gap-3 p-6 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          <PlusCircle className="w-10 h-10" />
          <span className="font-semibold">Crear Partido</span>
        </Link>
        <Link
          to="/partidos"
          className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <Calendar className="w-10 h-10" />
          <span className="font-semibold">Ver Partidos</span>
        </Link>
      </section>

      {/* Upcoming Matches */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Próximos Partidos</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : matches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay partidos próximos</p>
            <Link to="/crear-partido" className="text-green-600 hover:underline mt-2 inline-block">
              ¡Crea el primero!
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              const slotsPerTeam = getSlotsPerTeam(match.format as MatchFormat)
              const totalPlayers = match.home_count + match.away_count
              const totalSlots = slotsPerTeam * 2

              return (
                <Link
                  key={match.id}
                  to={`/partido/${match.id}`}
                  className="block p-4 rounded-xl border bg-white hover:border-green-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{match.title}</h3>
                      <p className="text-sm text-gray-500">{match.format}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: match.home_color }}
                      />
                      <span className="text-gray-400 text-sm">vs</span>
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: match.away_color }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(match.date)} • {match.time.slice(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{match.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className={totalPlayers === totalSlots ? "text-green-600 font-medium" : ""}>
                        {totalPlayers}/{totalSlots} jugadores
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
