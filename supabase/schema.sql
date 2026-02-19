-- ============================================
-- PICHANGAPP DATABASE SCHEMA
-- ============================================

-- Habilitar extensiones necesarias
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLA: profiles (perfiles de jugadores)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text,
  avatar_url text,
  phone text,
  -- Preferencias de juego
  position_baby text check (position_baby in ('goalkeeper', 'defender', 'midfielder', 'forward')),
  position_11 text check (position_11 in ('goalkeeper', 'defender', 'midfielder', 'forward')),
  preferred_foot text check (preferred_foot in ('left', 'right', 'both')) default 'right',
  height integer, -- en cm
  weight integer, -- en kg
  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS para profiles
alter table public.profiles enable row level security;

create policy "Perfiles públicos para lectura"
  on public.profiles for select
  using (true);

create policy "Usuarios pueden editar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Usuarios pueden insertar su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger para crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- TABLA: matches (partidos)
-- ============================================
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  -- Info básica
  title text not null,
  description text,
  -- Fecha y lugar
  date date not null,
  time time not null,
  location text not null,
  location_url text, -- Link a Google Maps
  -- Configuración del partido
  format text not null check (format in ('5v5', '6v6', '7v7', '8v8', '11v11')),
  home_color text default '#ef4444', -- Color equipo local (hex)
  away_color text default '#3b82f6', -- Color equipo visita (hex)
  -- Estado
  status text default 'open' check (status in ('open', 'full', 'in_progress', 'finished', 'cancelled')),
  -- Creador
  created_by uuid references public.profiles(id) on delete set null,
  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS para matches
alter table public.matches enable row level security;

create policy "Partidos visibles para todos"
  on public.matches for select
  using (true);

create policy "Usuarios autenticados pueden crear partidos"
  on public.matches for insert
  with check (auth.uid() is not null);

create policy "Creador puede editar su partido"
  on public.matches for update
  using (auth.uid() = created_by);

create policy "Creador puede eliminar su partido"
  on public.matches for delete
  using (auth.uid() = created_by);

-- ============================================
-- TABLA: match_players (jugadores en partidos)
-- ============================================
create table public.match_players (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  player_id uuid references public.profiles(id) on delete cascade not null,
  -- Posición en la cancha
  team text not null check (team in ('home', 'away')),
  slot integer not null, -- Número de slot (0 = portero, etc.)
  -- Estado
  status text default 'confirmed' check (status in ('confirmed', 'pending', 'declined')),
  -- Timestamps
  joined_at timestamp with time zone default now(),
  -- Un jugador solo puede tener un slot por partido
  unique(match_id, player_id),
  -- Un slot solo puede tener un jugador por equipo
  unique(match_id, team, slot)
);

-- RLS para match_players
alter table public.match_players enable row level security;

create policy "Jugadores de partido visibles para todos"
  on public.match_players for select
  using (true);

create policy "Usuarios pueden unirse a partidos"
  on public.match_players for insert
  with check (auth.uid() = player_id);

create policy "Usuarios pueden salirse de partidos"
  on public.match_players for delete
  using (auth.uid() = player_id);

create policy "Usuarios pueden actualizar su registro"
  on public.match_players for update
  using (auth.uid() = player_id);

-- ============================================
-- FUNCIÓN: Obtener slots por formato
-- ============================================
create or replace function public.get_slots_per_team(match_format text)
returns integer as $$
begin
  return case match_format
    when '5v5' then 5
    when '6v6' then 6
    when '7v7' then 7
    when '8v8' then 8
    when '11v11' then 11
    else 5
  end;
end;
$$ language plpgsql;

-- ============================================
-- VIEW: matches_with_counts (partidos con conteo de jugadores)
-- ============================================
create or replace view public.matches_with_counts as
select 
  m.*,
  coalesce(home.count, 0) as home_players_count,
  coalesce(away.count, 0) as away_players_count,
  public.get_slots_per_team(m.format) as slots_per_team
from public.matches m
left join (
  select match_id, count(*) as count
  from public.match_players
  where team = 'home' and status = 'confirmed'
  group by match_id
) home on m.id = home.match_id
left join (
  select match_id, count(*) as count
  from public.match_players
  where team = 'away' and status = 'confirmed'
  group by match_id
) away on m.id = away.match_id;

-- ============================================
-- DATOS DE PRUEBA
-- ============================================
-- Insertar un partido de ejemplo (sin creador por ahora)
insert into public.matches (title, description, date, time, location, location_url, format, home_color, away_color)
values 
  ('Pichanga Semanal', 'La pichanga de todos los jueves', '2026-02-20', '19:00', 'Cancha Los Leones', 'https://maps.google.com', '5v5', '#ef4444', '#3b82f6'),
  ('Partido del Viernes', 'Partido más grande del finde', '2026-02-21', '20:30', 'Complejo Deportivo Sur', 'https://maps.google.com', '7v7', '#22c55e', '#f97316');

-- ============================================
-- ÍNDICES para performance
-- ============================================
create index idx_matches_date on public.matches(date);
create index idx_matches_status on public.matches(status);
create index idx_match_players_match on public.match_players(match_id);
create index idx_match_players_player on public.match_players(player_id);
