import { useState } from 'react'
import { Loader2, AlertCircle, ArrowLeft, ExternalLink, RefreshCw, Music } from 'lucide-react'
import confetti from 'canvas-confetti'

import UploadZone from '../components/UploadZone'
import SongCard from '../components/SongCard'
import PlatformPicker from '../components/PlatformPicker'

import { extractSongsFromImage } from '../services/gemini'
import { useAuth } from '../hooks/useAuth'
import { searchSpotifyTrack, createSpotifyPlaylist } from '../services/spotify'
import { searchYouTubeVideo, createYouTubePlaylist } from '../services/youtube'

export default function Home() {
  const auth = useAuth()
  
  const [step, setStep] = useState('upload')
  const [isExtracting, setIsExtracting] = useState(false)
  
  const [songs, setSongs] = useState([])
  const [error, setError] = useState(null)
  
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [playlistName, setPlaylistName] = useState('PlaylistSnap - ' + new Date().toLocaleDateString())
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
        } finally {
          setIsExtracting(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to read file')
      setIsExtracting(false)
    }
  }

  const toggleSongSelection = (id) => {
    setSongs(songs.map(s => s.id === id ? { ...s, selected: !s.selected } : s))
  }

  const toggleAll = () => {
    const allSelected = songs.every(s => s.selected)
    setSongs(songs.map(s => ({ ...s, selected: !allSelected })))
  }

  const handleCreatePlaylist = async () => {
    if (!selectedPlatform || !playlistName.trim()) return
    setStep('creating')
    setError(null)
    setNotFoundSongs([])
    
    const selectedSongs = songs.filter(s => s.selected)
    const urisOrIds = []
    const notFound = []

    try {
      for (let i = 0; i < selectedSongs.length; i++) {
        const { title, artist } = selectedSongs[i]
        setCreatingStatus(`Searching for "${title}" (${i + 1}/${selectedSongs.length})`)
        
        if (selectedPlatform === 'spotify') {
          const track = await searchSpotifyTrack(title, artist, auth.spotifyToken)
          if (track) urisOrIds.push(track.uri)
          else notFound.push(selectedSongs[i])
        } else {
          const videoId = await searchYouTubeVideo(title, artist, auth.youtubeToken)
          if (videoId) urisOrIds.push(videoId)
          else notFound.push(selectedSongs[i])
        }
      }

      setCreatingStatus('Finalizing playlist...')
      let url = ''
      if (selectedPlatform === 'spotify') {
        url = await createSpotifyPlaylist(playlistName, urisOrIds, auth.spotifyToken)
      } else {
        url = await createYouTubePlaylist(playlistName, urisOrIds, auth.youtubeToken)
      }

      setPlaylistUrl(url)
      setNotFoundSongs(notFound)
      setStep('success')
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#1DB954', '#FF0000']
      })
      
    } catch (err) {
      setError(err.message || 'Failed to create playlist')
      setStep('platform')
    }
  }

  const selectedCount = songs.filter(s => s.selected).length

  return (
    <div className="py-12 md:py-20 flex flex-col items-center min-h-[90vh]">
      <header className="text-center space-y-6 max-w-2xl mb-12 relative z-20">
        <div className="inline-flex items-center justify-center p-2 bg-indigo-500/10 rounded-2xl mb-2 border border-indigo-500/20">
          <span className="text-indigo-300 font-medium text-sm tracking-wide px-2 uppercase shadow-xl">Beta v1.0</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent drop-shadow-sm">Playlist</span>
          <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-md">Snap</span>
        </h1>
        <p className={`text-xl text-neutral-400 leading-relaxed font-light transition-opacity duration-300 ${step !== 'upload' ? 'hidden' : 'block'}`}>
          Upload a tracklist image and let AI instantly create your Spotify or YouTube playlist.
        </p>
      </header>
      
      <main className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-20">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-red-400 shadow-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {(step === 'upload' || isExtracting) && (
          <div className="space-y-8">
            <UploadZone onImageSelected={handleImageSelected} />
            {isExtracting && (
              <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                <h3 className="text-xl font-medium text-white">Extracting songs with AI...</h3>
                <p className="text-neutral-400">This usually takes about 5-10 seconds.</p>
              </div>
            )}
          </div>
        )}

        {step === 'select_songs' && (
          <div className="glass p-8 rounded-3xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <button onClick={resetAll} className="flex items-center text-indigo-400 hover:text-indigo-300 transition text-sm mb-4 font-medium">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Start Over
                </button>
                <h3 className="text-3xl font-bold text-white tracking-tight">Found {songs.length} songs</h3>
                <p className="text-neutral-400 mt-1">{selectedCount} of {songs.length} songs selected</p>
              </div>
              <button 
                onClick={toggleAll}
                className="text-sm px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full transition text-white border border-white/10 font-medium"
              >
                {selectedCount === songs.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {songs.map(song => (
                <SongCard 
                  key={song.id} 
                  song={song} 
                  onToggle={toggleSongSelection} 
                />
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
               <button 
                 disabled={selectedCount === 0}
                 onClick={() => setStep('platform')}
                 className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-full font-medium transition shadow-lg shadow-indigo-500/25 flex items-center shadow-md scale-100 hover:scale-[1.02] active:scale-95 duration-200"
               >
                 Continue to Platform ({selectedCount})
               </button>
            </div>
          </div>
        )}

        {step === 'platform' && (
          <div className="glass p-10 rounded-3xl space-y-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setStep('select_songs')} className="flex items-center text-indigo-400 hover:text-indigo-300 transition text-sm mb-2 font-medium">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to songs
            </button>
            
            <div>
              <h3 className="text-3xl font-bold text-white tracking-tight mb-2">Choose your platform</h3>
              <p className="text-neutral-400">Select where you want to save this playlist.</p>
            </div>

            <PlatformPicker 
              auth={auth} 
              selectedPlatform={selectedPlatform} 
              onSelect={setSelectedPlatform} 
            />

            {selectedPlatform && (
              <div className="pt-8 border-t border-white/10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <label className="block text-sm font-medium text-neutral-300">Playlist Name</label>
                <input 
                  type="text" 
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition font-medium text-lg"
                  placeholder="My Awesome Playlist"
                />
                <button 
                  onClick={handleCreatePlaylist}
                  disabled={!playlistName.trim()}
                  className="w-full bg-white text-black hover:bg-neutral-200 disabled:opacity-50 text-xl px-8 py-4 rounded-xl font-bold transition shadow-lg shadow-white/10 mt-4 flex justify-center scale-100 hover:scale-[1.01] active:scale-95 duration-200"
                >
                  Create {selectedPlatform === 'spotify' ? 'Spotify' : 'YouTube'} Playlist
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'creating' && (
          <div className="glass p-16 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative">
               <div className="w-24 h-24 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
               <Music className="w-10 h-10 text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
               <h3 className="text-3xl font-bold text-white mb-3">Building your playlist...</h3>
               <p className="text-indigo-300 font-medium text-lg">{creatingStatus}</p>
            </div>
          </div>
        )}

        {step === 'success' && (
           <div className="glass p-10 md:p-14 rounded-3xl text-center space-y-8 shadow-2xl animate-in zoom-in-95 duration-500 border border-green-500/20">
             <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
               <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
             </div>
             
             <div>
               <h2 className="text-4xl font-extrabold text-white mb-3">Playlist Created!</h2>
               <p className="text-xl text-neutral-300 font-light max-w-lg mx-auto">
                 Successfully added <span className="text-white font-semibold">{selectedCount - notFoundSongs.length}</span> of {selectedCount} songs to your {selectedPlatform === 'spotify' ? 'Spotify' : 'YouTube'} account.
               </p>
             </div>

             {notFoundSongs.length > 0 && (
               <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 text-left inline-block w-full max-w-md shadow-inner">
                 <h4 className="text-orange-400 font-semibold mb-3 flex items-center gap-2">
                   <AlertCircle className="w-5 h-5" /> Couldn't find {notFoundSongs.length} {notFoundSongs.length === 1 ? 'song' : 'songs'}:
                 </h4>
                 <ul className="space-y-2 text-sm text-neutral-400 max-h-32 overflow-y-auto pr-2 custom-scrollbar font-medium">
                   {notFoundSongs.map((s, i) => (
                     <li key={i} className="flex gap-2">
                        <span className="text-orange-500/50">•</span>
                        <span className="truncate">{s.title} - {s.artist}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             )}

             <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 items-center">
               <a 
                 href={playlistUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition text-white shadow-xl hover:-translate-y-1 ${selectedPlatform === 'spotify' ? 'bg-[#1DB954] hover:bg-[#1ed760] shadow-[#1DB954]/20' : 'bg-[#FF0000] hover:bg-[#ff3333] shadow-[#FF0000]/20'}`}
               >
                 Open in {selectedPlatform === 'spotify' ? 'Spotify' : 'YouTube'}
                 <ExternalLink className="w-5 h-5" />
               </a>
               <button 
                 onClick={resetAll}
                 className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-neutral-300 bg-white/5 hover:bg-white/10 hover:text-white transition"
               >
                 <RefreshCw className="w-5 h-5" /> Start Over
               </button>
             </div>
           </div>
        )}

      </main>
    </div>
  )
}
