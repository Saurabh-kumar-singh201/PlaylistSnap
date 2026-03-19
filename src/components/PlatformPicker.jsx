import { PlayCircle, Youtube, Check } from 'lucide-react'

export default function PlatformPicker({ onSelect, selectedPlatform, auth }) {
  const { spotifyToken, youtubeToken, loginSpotify, loginYoutube } = auth

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Spotify Card */}
      <div 
        onClick={() => {
          if (!spotifyToken) loginSpotify()
          else onSelect('spotify')
        }}
        className={`glass p-6 rounded-2xl border-2 transition duration-300 cursor-pointer text-left relative overflow-hidden group
          ${selectedPlatform === 'spotify' ? 'border-[#1DB954]' : 'border-white/10 hover:border-[#1DB954]/50'}`}
      >
        <div className="flex items-center justify-between mb-4 relative z-10">
           <div className="w-12 h-12 bg-[#1DB954]/20 text-[#1DB954] rounded-full flex items-center justify-center">
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.56.3z"/></svg>
           </div>
           {spotifyToken && <span className="bg-[#1DB954]/20 text-[#1DB954] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Connected</span>}
        </div>
        <h3 className="text-xl font-bold text-white relative z-10">Spotify</h3>
        <p className="text-neutral-400 text-sm mt-1 relative z-10">
          {!spotifyToken ? 'Click to connect account' : 'Save as a Spotify playlist'}
        </p>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/0 to-[#1DB954]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* YouTube Card */}
      <div 
        onClick={() => {
          if (!youtubeToken) loginYoutube()
          else onSelect('youtube')
        }}
        className={`glass p-6 rounded-2xl border-2 transition duration-300 cursor-pointer text-left relative overflow-hidden group
          ${selectedPlatform === 'youtube' ? 'border-[#FF0000]' : 'border-white/10 hover:border-[#FF0000]/50'}`}
      >
        <div className="flex items-center justify-between mb-4 relative z-10">
           <div className="w-12 h-12 bg-[#FF0000]/20 text-[#FF0000] rounded-full flex items-center justify-center">
             <Youtube className="w-6 h-6" />
           </div>
           {youtubeToken && <span className="bg-[#FF0000]/20 text-[#FF0000] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Connected</span>}
        </div>
        <h3 className="text-xl font-bold text-white relative z-10">YouTube</h3>
        <p className="text-neutral-400 text-sm mt-1 relative z-10">
          {!youtubeToken ? 'Click to connect account' : 'Save as a YouTube playlist'}
        </p>
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/0 to-[#FF0000]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  )
}
