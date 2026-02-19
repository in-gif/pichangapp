import { useState } from 'react'
import { User, Ruler, Weight, Footprints, Target, LogOut } from 'lucide-react'
import type { Position } from '@/types'
import { POSITION_LABELS } from '@/types'

// Mock user data
const mockUser: {
  id: string
  name: string
  email: string
  avatar_url: string | null
  position_baby: Position
  position_11: Position
  preferred_foot: 'left' | 'right' | 'both'
  height: number | undefined
  weight: number | undefined
} = {
  id: '1',
  name: 'Sebastián',
  email: 'seba@example.com',
  avatar_url: null,
  position_baby: 'midfielder',
  position_11: 'midfielder',
  preferred_foot: 'right',
  height: 175,
  weight: 72,
}

export default function Profile() {
  const [user, setUser] = useState(mockUser)
  const [isEditing, setIsEditing] = useState(false)

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleSave = () => {
    // TODO: Save to Supabase
    console.log('Saving profile:', user)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Mi Perfil</h1>

      {/* Avatar & Name */}
      <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-xl border">
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(user.name)
          )}
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="text-xl font-bold text-center bg-transparent border-b-2 border-primary focus:outline-none"
          />
        ) : (
          <h2 className="text-xl font-bold">{user.name}</h2>
        )}
        
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-xl border text-center">
          <p className="text-2xl font-bold text-primary">12</p>
          <p className="text-sm text-muted-foreground">Partidos</p>
        </div>
        <div className="p-4 bg-card rounded-xl border text-center">
          <p className="text-2xl font-bold text-primary">8</p>
          <p className="text-sm text-muted-foreground">Victorias</p>
        </div>
        <div className="p-4 bg-card rounded-xl border text-center">
          <p className="text-2xl font-bold text-primary">67%</p>
          <p className="text-sm text-muted-foreground">Asistencia</p>
        </div>
      </div>

      {/* Player Info */}
      <div className="space-y-4 p-6 bg-card rounded-xl border">
        <h3 className="font-semibold flex items-center gap-2">
          <User className="w-5 h-5" />
          Información de Jugador
        </h3>

        {/* Positions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-1">
              <Target className="w-4 h-4" />
              Posición Baby
            </label>
            {isEditing ? (
              <select
                value={user.position_baby}
                onChange={(e) => setUser({ ...user, position_baby: e.target.value as Position })}
                className="w-full px-3 py-2 rounded-lg border bg-background"
              >
                {Object.entries(POSITION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            ) : (
              <p className="font-medium">{POSITION_LABELS[user.position_baby]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-1">
              <Target className="w-4 h-4" />
              Posición 11
            </label>
            {isEditing ? (
              <select
                value={user.position_11}
                onChange={(e) => setUser({ ...user, position_11: e.target.value as Position })}
                className="w-full px-3 py-2 rounded-lg border bg-background"
              >
                {Object.entries(POSITION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            ) : (
              <p className="font-medium">{POSITION_LABELS[user.position_11]}</p>
            )}
          </div>
        </div>

        {/* Physical */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-1">
              <Footprints className="w-4 h-4" />
              Pie
            </label>
            {isEditing ? (
              <select
                value={user.preferred_foot}
                onChange={(e) => setUser({ ...user, preferred_foot: e.target.value as 'left' | 'right' | 'both' })}
                className="w-full px-3 py-2 rounded-lg border bg-background"
              >
                <option value="right">Derecho</option>
                <option value="left">Izquierdo</option>
                <option value="both">Ambos</option>
              </select>
            ) : (
              <p className="font-medium">
                {user.preferred_foot === 'right' ? 'Derecho' : user.preferred_foot === 'left' ? 'Izquierdo' : 'Ambos'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              Altura
            </label>
            {isEditing ? (
              <input
                type="number"
                value={user.height || ''}
                onChange={(e) => setUser({ ...user, height: parseInt(e.target.value) || undefined })}
                placeholder="cm"
                className="w-full px-3 py-2 rounded-lg border bg-background"
              />
            ) : (
              <p className="font-medium">{user.height ? `${user.height} cm` : '-'}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-1">
              <Weight className="w-4 h-4" />
              Peso
            </label>
            {isEditing ? (
              <input
                type="number"
                value={user.weight || ''}
                onChange={(e) => setUser({ ...user, weight: parseInt(e.target.value) || undefined })}
                placeholder="kg"
                className="w-full px-3 py-2 rounded-lg border bg-background"
              />
            ) : (
              <p className="font-medium">{user.weight ? `${user.weight} kg` : '-'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {isEditing ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="py-3 rounded-xl font-medium border hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Guardar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Editar Perfil
          </button>
        )}

        <button className="w-full py-3 rounded-xl font-medium border text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
