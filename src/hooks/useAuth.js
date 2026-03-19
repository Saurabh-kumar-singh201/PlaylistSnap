import { useState, useEffect } from 'react'
import { redirectToSpotifyAuth } from '../services/spotify'
import { getYouTubeToken } from '../services/youtube'

export function useAuth() {
  const [spotifyToken, setSpotifyToken] = useState(null)
  const [youtubeToken, setYoutubeToken] = useState(null)

  useEffect(() => {
    // Check session storage on mount
    const sToken = sessionStorage.getItem('spotify_token')
    if (sToken) setSpotifyToken(sToken)
    
    const yToken = sessionStorage.getItem('youtube_token')
    if (yToken) setYoutubeToken(yToken)
  }, [])

  const loginSpotify = () => {
    redirectToSpotifyAuth()
  }

  const loginYoutube = () => {
    getYouTubeToken((token) => {
      setYoutubeToken(token)
    })
  }

  const logout = () => {
    sessionStorage.removeItem('spotify_token')
    sessionStorage.removeItem('youtube_token')
    setSpotifyToken(null)
    setYoutubeToken(null)
  }

  return {
    spotifyToken,
    youtubeToken,
    loginSpotify,
    loginYoutube,
    logout
  }
}
