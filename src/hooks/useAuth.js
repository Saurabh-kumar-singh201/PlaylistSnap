import { useState } from 'react'
import { getYouTubeToken } from '../services/youtube'

export function useAuth() {
  const [youtubeToken, setYoutubeToken] = useState(() => sessionStorage.getItem('youtube_token'))

  const loginYoutube = async () => {
    const token = await getYouTubeToken()
    setYoutubeToken(token)
  }

  const logout = () => {
    sessionStorage.removeItem('youtube_token')
    setYoutubeToken(null)
  }

  return {
    youtubeToken,
    loginYoutube,
    logout
  }
}
