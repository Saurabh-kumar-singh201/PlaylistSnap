const clientId = import.meta.env.VITE_YOUTUBE_CLIENT_ID

export function getYouTubeToken(onSuccess, onError) {
  if (!clientId) {
    if (onError) onError(new Error("Missing VITE_YOUTUBE_CLIENT_ID"))
    return
  }

  if (typeof google === 'undefined') {
    if (onError) onError(new Error("Google Identity script not loaded"))
    return
  }

  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: "https://www.googleapis.com/auth/youtube",
    callback: (res) => {
      if (res.error !== undefined) {
        if (onError) onError(res)
        return
      }
      sessionStorage.setItem('youtube_token', res.access_token)
      if (onSuccess) onSuccess(res.access_token)
    }
  })
  
  tokenClient.requestAccessToken()
}

export async function searchYouTubeVideo(title, artist, token) {
  const q = encodeURIComponent(`${title} ${artist} official`)
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&maxResults=1`
  
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error("YouTube search failed")
  
  const data = await res.json()
  return data.items?.[0]?.id?.videoId || null
}

export async function createYouTubePlaylist(name, videoIds, token) {
  // 1. Create playlist
  const plRes = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet,status", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      snippet: { title: name, description: "Created by PlaylistSnap 🚀" },
      status: { privacyStatus: "private" }
    })
  })

  if (!plRes.ok) throw new Error("Failed to create YouTube playlist")
  
  const plData = await plRes.json()
  const playlistId = plData.id

  // 2. Add videos one by one
  for (const videoId of videoIds) {
    if (!videoId) continue
    await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        snippet: {
          playlistId,
          resourceId: { kind: "youtube#video", videoId }
        }
      })
    })
    // 100ms artificial delay to avoid hammering the API as per standard practice
    await new Promise(r => setTimeout(r, 100))
  }

  return `https://www.youtube.com/playlist?list=${playlistId}`
}
