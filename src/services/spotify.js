const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/callback` : ''

function generateCodeVerifier(length) {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function redirectToSpotifyAuth() {
  if (!clientId) throw new Error("Missing VITE_SPOTIFY_CLIENT_ID")
  
  const verifier = generateCodeVerifier(128)
  const challenge = await generateCodeChallenge(verifier)

  sessionStorage.setItem('spotify_verifier', verifier)
  // Save return path so we know where we came from, standard in OAuth
  sessionStorage.setItem('auth_provider', 'spotify')

  const scope = "playlist-modify-public playlist-modify-private"
  const authUrl = new URL("https://accounts.spotify.com/authorize")

  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    redirect_uri: redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString()
  window.location.href = authUrl.toString()
}

export async function getSpotifyToken(code) {
  const verifier = sessionStorage.getItem('spotify_verifier')
  if (!verifier) throw new Error("No verifier found in session")

  const params = new URLSearchParams()
  params.append("client_id", clientId)
  params.append("grant_type", "authorization_code")
  params.append("code", code)
  params.append("redirect_uri", redirectUri)
  params.append("code_verifier", verifier)

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  })

  if (!response.ok) {
    throw new Error("Failed to exchange token")
  }
  
  const data = await response.json()
  sessionStorage.setItem('spotify_token', data.access_token)
  return data.access_token
}

export async function searchSpotifyTrack(title, artist, token) {
  const q = encodeURIComponent(`${title} ${artist}`)
  const res = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error("Search failed")
  const data = await res.json()
  return data.tracks?.items[0] || null
}

export async function createSpotifyPlaylist(name, uris, token) {
  // 1. Get user id
  const userRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!userRes.ok) throw new Error("Failed to get user profile")
  const userData = await userRes.json()

  // 2. Create playlist
  const plRes = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      description: "Created by PlaylistSnap 🚀",
      public: false
    })
  })
  if (!plRes.ok) throw new Error("Failed to create playlist")
  const plData = await plRes.json()

  // 3. Add tracks (chunking manually if > 100, though prompt says chunk if needed)
  if (uris.length > 0) {
    // Spotify limit is 100 per request
    for (let i = 0; i < uris.length; i += 100) {
      const chunk = uris.slice(i, i + 100)
      await fetch(`https://api.spotify.com/v1/playlists/${plData.id}/tracks`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ uris: chunk })
      })
    }
  }

  return plData.external_urls.spotify
}
