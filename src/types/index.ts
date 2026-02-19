// Player types
export interface Player {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  position_baby: Position;
  position_11: Position;
  preferred_foot: 'left' | 'right' | 'both';
  height?: number; // cm
  weight?: number; // kg
  created_at: string;
}

export type Position = 
  | 'goalkeeper'
  | 'defender'
  | 'midfielder'
  | 'forward';

export type PositionSlot = {
  position: Position;
  player?: Player;
  slot_number: number;
};

// Match types
export interface Match {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  location_url?: string;
  format: '5v5' | '7v7' | '11v11';
  home_color: string;
  away_color: string;
  status: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  home_lineup: PositionSlot[];
  away_lineup: PositionSlot[];
}

export interface MatchPlayer {
  id: string;
  match_id: string;
  player_id: string;
  team: 'home' | 'away';
  position: Position;
  slot_number: number;
  confirmed: boolean;
  joined_at: string;
  player?: Player;
}

// Format configurations
export const FORMAT_CONFIG = {
  '5v5': {
    name: 'Baby Fútbol',
    players_per_team: 5,
    positions: {
      goalkeeper: 1,
      defender: 1,
      midfielder: 2,
      forward: 1,
    },
  },
  '7v7': {
    name: 'Fútbol 7',
    players_per_team: 7,
    positions: {
      goalkeeper: 1,
      defender: 2,
      midfielder: 2,
      forward: 2,
    },
  },
  '11v11': {
    name: 'Fútbol 11',
    players_per_team: 11,
    positions: {
      goalkeeper: 1,
      defender: 4,
      midfielder: 4,
      forward: 2,
    },
  },
} as const;

export const POSITION_LABELS: Record<Position, string> = {
  goalkeeper: 'Arquero',
  defender: 'Defensa',
  midfielder: 'Mediocampista',
  forward: 'Delantero',
};

export const POSITION_LABELS_SHORT: Record<Position, string> = {
  goalkeeper: 'ARQ',
  defender: 'DEF',
  midfielder: 'MED',
  forward: 'DEL',
};
