# ⚽ PichangApp

Organiza partidos de fútbol con tus amigos de forma simple y visual.

## 🎯 Features (MVP)

- 👤 **Perfiles de jugador**: Posición, pie preferido, altura, peso
- 📅 **Crear partidos**: Fecha, hora, lugar, formato (5v5, 7v7, 11v11)
- 🎨 **Colores de equipos**: Visualiza las poleras de cada equipo
- 👥 **Alineaciones visuales**: Ve la cancha con todos los jugadores posicionados
- 🔔 **Notificaciones**: Entérate cuando se crea un partido nuevo

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Auth + Database + Realtime)
- **Icons**: Lucide React

## 🚀 Getting Started

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# Correr en desarrollo
npm run dev
```

## 📱 Screens

- `/` - Home con partidos próximos
- `/partidos` - Lista de partidos disponibles
- `/partido/:id` - Detalle del partido con alineaciones
- `/crear-partido` - Formulario para crear partido
- `/perfil` - Perfil del jugador

## 📦 Database Schema (Supabase)

```sql
-- Players/Profiles
create table profiles (
  id uuid references auth.users primary key,
  name text not null,
  avatar_url text,
  position_baby text,
  position_11 text,
  preferred_foot text default 'right',
  height int,
  weight int,
  created_at timestamp with time zone default now()
);

-- Matches
create table matches (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  time time not null,
  location text not null,
  location_url text,
  format text not null default '5v5',
  home_color text default '#ef4444',
  away_color text default '#3b82f6',
  status text default 'open',
  created_by uuid references profiles(id),
  created_at timestamp with time zone default now()
);

-- Match Players (who's playing)
create table match_players (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references profiles(id),
  team text not null, -- 'home' or 'away'
  position text not null,
  slot_number int not null,
  confirmed boolean default false,
  joined_at timestamp with time zone default now(),
  unique(match_id, team, slot_number)
);
```

## 🗺️ Roadmap

### MVP (Semana 1-2)
- [x] Setup proyecto
- [x] UI básica con rutas
- [x] Vista de alineaciones
- [ ] Auth con Google
- [ ] CRUD de partidos
- [ ] Unirse a partidos

### V1.0 (Semana 3-4)
- [ ] Notificaciones push
- [ ] Chat o integración WhatsApp
- [ ] Editar alineaciones
- [ ] Historial de partidos

### Futuro
- [ ] Equipos formales
- [ ] Estadísticas de jugador
- [ ] Integración con canchas
- [ ] Sistema de pagos

---

Made with 💚 by Seba & Tito 🤖
