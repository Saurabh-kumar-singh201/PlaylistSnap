import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSpotifyToken } from '../services/spotify'

export default function Callback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const errorParam = urlParams.get('error')

      const authProvider = sessionStorage.getItem('auth_provider')

      if (errorParam) {
        setError(`Authentication failed: ${errorParam}`)
        setTimeout(() => navigate('/'), 3000)
        return
      }

      if (code && authProvider === 'spotify') {
        try {
          await getSpotifyToken(code)
          navigate('/')
        } catch (err) {
          setError(err.message || 'Failed to get Spotify token')
          setTimeout(() => navigate('/'), 3000)
        }
      } else {
        navigate('/')
      }
    }

    processCallback()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="glass p-12 rounded-[2rem] text-center max-w-md w-full border border-white/10 shadow-2xl">
        {error ? (
          <>
             <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">!</div>
             <h2 className="text-2xl font-bold mb-3 text-white">Error</h2>
             <p className="text-red-400 font-light">{error}</p>
             <p className="text-neutral-500 text-sm mt-4">Redirecting back...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-3 text-white">Authenticating</h2>
            <p className="text-neutral-400 font-light">Securely connecting your account...</p>
          </>
        )}
      </div>
    </div>
  )
}
