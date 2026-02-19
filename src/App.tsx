import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Matches from '@/pages/Matches'
import Match from '@/pages/Match'
import Profile from '@/pages/Profile'
import CreateMatch from '@/pages/CreateMatch'
import Layout from '@/components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="partidos" element={<Matches />} />
          <Route path="partido/:id" element={<Match />} />
          <Route path="crear-partido" element={<CreateMatch />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
