import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, Palette } from 'lucide-react'

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#3b82f6', '#8b5cf6', '#ec4899', '#000000', '#ffffff'
]

export default function CreateMatch() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    format: '5v5',
    home_color: '#ef4444',
    away_color: '#3b82f6',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Create match in Supabase
    console.log('Creating match:', formData)
    navigate('/partidos')
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Crear Partido</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre del partido</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ej: Pichanga del Viernes"
            className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hora
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Ubicación
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Ej: Cancha Los Leones, Las Condes"
            className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Formato
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['5v5', '7v7', '11v11'].map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => setFormData({ ...formData, format })}
                className={`py-3 rounded-xl font-medium transition-colors ${
                  formData.format === format
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Team Colors */}
        <div className="space-y-4">
          <label className="text-sm font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Colores de polera
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Home Color */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Equipo Local</span>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={`home-${color}`}
                    type="button"
                    onClick={() => setFormData({ ...formData, home_color: color })}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      formData.home_color === color ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ 
                      backgroundColor: color,
                      borderColor: color === '#ffffff' ? '#e5e5e5' : color 
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Away Color */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Equipo Visita</span>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={`away-${color}`}
                    type="button"
                    onClick={() => setFormData({ ...formData, away_color: color })}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      formData.away_color === color ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ 
                      backgroundColor: color,
                      borderColor: color === '#ffffff' ? '#e5e5e5' : color 
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center gap-4 p-4 bg-secondary/50 rounded-xl">
            <div 
              className="w-12 h-12 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: formData.home_color }}
            />
            <span className="font-bold text-muted-foreground">VS</span>
            <div 
              className="w-12 h-12 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: formData.away_color }}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors"
        >
          Crear Partido ⚽
        </button>
      </form>
    </div>
  )
}
