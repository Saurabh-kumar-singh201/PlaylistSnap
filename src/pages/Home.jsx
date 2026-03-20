import { useState } from 'react'
import { Loader2, AlertCircle, ArrowLeft, ExternalLink, RefreshCw, Music, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'

import UploadZone from '../components/UploadZone'
import SongCard from '../components/SongCard'
import PlatformPicker from '../components/PlatformPicker'

import { extractSongsFromImage } from '../services/gemini'
import { useAuth } from '../hooks/useAuth'
import { searchYouTubeVideo, createYouTubePlaylist } from '../services/youtube'

function ScreenFrame({ children }) {
  return (
    <section className="min-h-screen flex items-center py-3 md:py-4">
      <div className="tablet-shell w-full rounded-[2.5rem] md:rounded-[3rem] p-3 md:p-4">
        <div className="tablet-screen rounded-[2rem] md:rounded-[2.6rem] min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-2.5rem)] overflow-hidden">
          <div className="grid md:grid-cols-[72px_minmax(0,1fr)] min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-2.5rem)]">
            <aside className="hidden md:flex flex-col items-center py-6 gap-5 border-r border-white/8 bg-white/[0.03]">
              <div className="nav-dot nav-dot--active" />
              <div className="nav-dot" />
              <div className="nav-dot" />
              <div className="nav-dot" />
              <div className="nav-spacer" />
              <div className="nav-dot nav-dot--small" />
            </aside>
            <div className="relative p-5 md:p-8">
              <div className="screen-glow" />
              <div className="relative z-10 max-w-4xl">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const auth = useAuth()

  const [step, setStep] = useState('upload')
  const [isExtracting, setIsExtracting] = useState(false)
  const [songs, setSongs] = useState([])
  const [error, setError] = useState(null)
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [playlistName, setPlaylistName] = useState(`PlaylistSnap - ${new Date().toLocaleDateString()}`)
  const [creatingStatus, setCreatingStatus] = useState('')
  const [playlistUrl, setPlaylistUrl] = useState(null)
  const [notFoundSongs, setNotFoundSongs] = useState([])

  const resetAll = () => {
    setStep('upload')
    setSongs([])
    setError(null)
    setSelectedPlatform(null)
    setPlaylistUrl(null)
    setNotFoundSongs([])
    setIsExtracting(false)
  }

  const handleAuthError = (message) => {
    setError(message)
  }

  const handleImageSelected = async (file) => {
    if (!file) return resetAll()
    setIsExtracting(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const extracted = await extractSongsFromImage(reader.result, file.type)
          setSongs(extracted)
          setStep('select_songs')
        } catch (err) {
          setError(err.message || 'Failed to extract songs.')
          setStep('upload')
        } finally {
          setIsExtracting(false)
        }
      }
      reader.readAsDataURL(file)
    } catch {
      setError('Failed to read file')
      setIsExtracting(false)
    }
  }

  const toggleSongSelection = (id) => {
    setSongs(songs.map((song) => (
      song.id === id ? { ...song, selected: !song.selected } : song
    )))
  }

  const toggleAll = () => {
    const allSelected = songs.every((song) => song.selected)
    setSongs(songs.map((song) => ({ ...song, selected: !allSelected })))
  }

  const handleCreatePlaylist = async () => {
    if (!selectedPlatform || !playlistName.trim()) return

    setStep('creating')
    setError(null)
    setNotFoundSongs([])

    const selectedSongs = songs.filter((song) => song.selected)
    const videoIds = []
    const notFound = []

    try {
      for (let i = 0; i < selectedSongs.length; i++) {
        const { title, artist } = selectedSongs[i]
        setCreatingStatus(`Searching for "${title}" (${i + 1}/${selectedSongs.length})`)

        const videoId = await searchYouTubeVideo(title, artist, auth.youtubeToken)
        if (videoId) videoIds.push(videoId)
        else notFound.push(selectedSongs[i])
      }

      setCreatingStatus('Finalizing playlist...')
      const url = await createYouTubePlaylist(playlistName, videoIds, auth.youtubeToken)

      setPlaylistUrl(url)
      setNotFoundSongs(notFound)
      setStep('success')

      confetti({
        particleCount: 90,
        spread: 48,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#d7c2ff', '#7a5cff']
      })
    } catch (err) {
      setError(err.message || 'Failed to create playlist')
      setStep('platform')
    }
  }

  const selectedCount = songs.filter((song) => song.selected).length

  return (
    <ScreenFrame>
      {error && (
        <div className="mb-5 rounded-[1.1rem] border border-[#ff8a8a]/30 bg-[#2c1633]/70 px-4 py-3 text-sm text-[#ffd4d4] backdrop-blur-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {(step === 'upload' || isExtracting) && (
        <div className="max-w-2xl pt-2 md:pt-4">
          <div className="mb-5 md:mb-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-[-0.06em] text-white">PlaylistSnap</h1>
            <p className="text-sm md:text-base text-white/68 mt-2 max-w-lg">
              Upload a playlist screenshot or tracklist image and turn it into a YouTube playlist in minutes.
            </p>
          </div>

          <div className="device-panel rounded-[1.8rem] p-4 md:p-6">
            <UploadZone onImageSelected={handleImageSelected} />

            {isExtracting && (
              <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-black/20 px-6 py-8 text-center text-white/80">
                <Loader2 className="w-7 h-7 animate-spin mx-auto mb-3 text-white" />
                <h3 className="text-xl font-semibold text-white">Reading your image</h3>
                <p className="text-sm text-white/60 mt-2">This usually takes 5 to 10 seconds.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'select_songs' && (
        <div className="max-w-4xl pt-4 md:pt-8">
          <button onClick={resetAll} className="inline-flex items-center text-white/68 hover:text-white transition text-sm mb-5 font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to upload
          </button>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-white/52 text-xs uppercase tracking-[0.22em]">
                <Sparkles className="w-3.5 h-3.5" />
                Review
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.05em] text-white mt-3">Select the songs you want</h2>
              <p className="text-white/62 mt-2">{selectedCount} of {songs.length} selected</p>
            </div>
            <button
              onClick={toggleAll}
              className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-medium text-white/88"
            >
              {selectedCount === songs.length ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          <div className="device-panel rounded-[1.8rem] p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[430px] overflow-y-auto pr-1 custom-scrollbar">
              {songs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onToggle={toggleSongSelection}
                />
              ))}
            </div>

            <div className="pt-5 mt-5 border-t border-white/10 flex justify-end">
              <button
                disabled={selectedCount === 0}
                onClick={() => setStep('platform')}
                className="primary-button disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-full text-sm font-semibold transition"
              >
                Continue ({selectedCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'platform' && (
        <div className="max-w-3xl pt-4 md:pt-8">
          <button onClick={() => setStep('select_songs')} className="inline-flex items-center text-white/68 hover:text-white transition text-sm mb-5 font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to songs
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-2 text-white/52 text-xs uppercase tracking-[0.22em]">
              <Sparkles className="w-3.5 h-3.5" />
              Create
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.05em] text-white mt-3">Create the playlist</h2>
            <p className="text-white/62 mt-2">Connect YouTube and confirm the playlist name.</p>
          </div>

          <div className="device-panel rounded-[1.8rem] p-4 md:p-6 space-y-5">
            <PlatformPicker
              auth={auth}
              selectedPlatform={selectedPlatform}
              onSelect={setSelectedPlatform}
              onAuthError={handleAuthError}
            />

            {selectedPlatform && (
              <div className="border-t border-white/10 pt-5 space-y-3">
                <label className="block text-[0.72rem] font-medium text-white/56 uppercase tracking-[0.2em]">Playlist Name</label>
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full rounded-[1rem] border border-white/12 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-[#a58cff] transition text-base"
                  placeholder="My YouTube Playlist"
                />
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!playlistName.trim()}
                  className="w-full primary-button disabled:opacity-50 text-base px-6 py-3 rounded-[1rem] font-semibold transition"
                >
                  Create YouTube Playlist
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'creating' && (
        <div className="max-w-xl pt-10 md:pt-16">
          <div className="device-panel rounded-[1.8rem] px-6 py-10 text-center">
            <div className="relative mx-auto mb-5 w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-white/12 border-t-white animate-spin" />
              <Music className="w-7 h-7 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Building your playlist</h3>
            <p className="text-white/62 mt-2">{creatingStatus}</p>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="max-w-2xl pt-8 md:pt-12">
          <div className="device-panel rounded-[1.8rem] px-6 py-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-full border border-white/12 bg-white/8 flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-white mt-5">Playlist created</h2>
            <p className="text-white/62 mt-3 max-w-lg mx-auto">
              Added {selectedCount - notFoundSongs.length} of {selectedCount} songs to your YouTube account.
            </p>

            {notFoundSongs.length > 0 && (
              <div className="mt-6 rounded-[1.2rem] border border-white/10 bg-black/18 p-4 text-left">
                <h4 className="text-white/88 font-semibold mb-3 flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4" /> Not found
                </h4>
                <ul className="space-y-2 text-[0.84rem] text-white/62 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {notFoundSongs.map((song, index) => (
                    <li key={index} className="truncate">{song.title} - {song.artist}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button inline-flex items-center justify-center gap-3 px-6 py-3 rounded-[0.95rem] font-semibold text-base transition"
              >
                Open in YouTube
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={resetAll}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[0.95rem] font-semibold text-sm text-white bg-white/6 hover:bg-white/10 transition border border-white/12"
              >
                <RefreshCw className="w-4 h-4" /> Start over
              </button>
            </div>
          </div>
        </div>
      )}
    </ScreenFrame>
  )
}
