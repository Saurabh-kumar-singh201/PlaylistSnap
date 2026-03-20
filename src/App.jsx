import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import SiteFooter from './components/SiteFooter'

export default function App() {
  const location = useLocation()
  const showFooter = location.pathname !== '/'

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      {showFooter && <SiteFooter />}
    </div>
  )
}
