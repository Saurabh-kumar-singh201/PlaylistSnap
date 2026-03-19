import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Callback from './pages/Callback'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-50 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full point-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 blur-[120px] rounded-full point-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </div>
    </div>
  )
}
