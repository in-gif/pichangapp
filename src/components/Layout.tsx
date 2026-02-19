import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Calendar, PlusCircle, User } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Inicio' },
  { path: '/partidos', icon: Calendar, label: 'Partidos' },
  { path: '/crear-partido', icon: PlusCircle, label: 'Crear' },
  { path: '/perfil', icon: User, label: 'Perfil' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-xl">⚽</span>
            </div>
            <span className="text-xl font-bold text-green-600">PichangApp</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="border-t bg-white sticky bottom-0">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "text-green-600" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
