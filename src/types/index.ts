// Database types (matching Supabase schema)

export interface Profile {
  id: string
  name: string
  email: string | null
  avatar_url: string | null
  position_baby: Position | null
  position_11: Position | null
  preferred_foot: 'left' | 'right' | 'both'
  height: number | null
  weight: number | null
  created_at: string
}

export interface Match {
  id: string
  title: string
  date: string
  time: string
  location: string
  location_url: string | null
  format: MatchFormat
  home_color: string
  away_color: string
  status: 'open' | 'full' | 'in_progress' | 'finished' | 'cancelled'
  created_at: string
}

export interface MatchPlayer {
  id: string
  match_id: string
  player_id: string
  team: 'home' | 'away'
  slot: number
  joined_at: string
  // Joined data
  player?: Profile
}

// Match with player counts (for list view)
export interface MatchWithCounts extends Match {
  home_players_count: number
  away_players_count: number
  slots_per_team: number
}

// Match with full lineup (for detail view)
export interface MatchWithLineup extends Match {
  home_players: MatchPlayer[]
  away_players: MatchPlayer[]
}

// Enums
export type Position = 'goalkeeper' | 'defender' | 'midfielder' | 'forward'
export type MatchFormat = '5v5' | '6v6' | '7v7' | '8v8' | '11v11'

// Format configurations
export const FORMAT_CONFIG: Record<MatchFormat, { name: string; slots: number }> = {
  '5v5': { name: 'Baby Fútbol', slots: 5 },
  '6v6': { name: 'Fútbol 6', slots: 6 },
  '7v7': { name: 'Fútbol 7', slots: 7 },
  '8v8': { name: 'Fútbol 8', slots: 8 },
  '11v11': { name: 'Fútbol 11', slots: 11 },
}

export const POSITION_LABELS: Record<Position, string> = {
  goalkeeper: 'Arquero',
  defender: 'Defensa',
  midfielder: 'Mediocampista',
  forward: 'Delantero',
}

export const POSITION_LABELS_SHORT: Record<Position, string> = {
  goalkeeper: 'POR',
  defender: 'DEF',
  midfielder: 'MED',
  forward: 'DEL',
}

// Helper to get slots per team for a format
export function getSlotsPerTeam(format: MatchFormat): number {
  return FORMAT_CONFIG[format]?.slots || 5
}
