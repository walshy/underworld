import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Overview from './pages/Overview'
import DrugOperations from './pages/DrugOperations'
import Territory from './pages/Territory'
import BlackMarket from './pages/BlackMarket'
import Casino from './pages/Casino'
import Gang from './pages/Gang'
import Hits from './pages/Hits'
import Prison from './pages/Prison'
import Laundering from './pages/Laundering'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="drugs" element={<DrugOperations />} />
        <Route path="territory" element={<Territory />} />
        <Route path="market" element={<BlackMarket />} />
        <Route path="casino" element={<Casino />} />
        <Route path="gang" element={<Gang />} />
        <Route path="hits" element={<Hits />} />
        <Route path="laundering" element={<Laundering />} />
        <Route path="prison" element={<Prison />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}
