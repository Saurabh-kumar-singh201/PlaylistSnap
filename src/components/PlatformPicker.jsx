import { Youtube, Check } from 'lucide-react'

export default function PlatformPicker({ onSelect, selectedPlatform, auth, onAuthError }) {
  const { youtubeToken, loginYoutube } = auth

  return (
    <div className="grid grid-cols-1 gap-4">
      <div 
        onClick={async () => {
          if (!youtubeToken) {
            try {
              await loginYoutube()
            } catch (error) {
              onAuthError?.(error.message || 'Failed to connect to YouTube.')
            }
            return
          }

          onSelect('youtube')
        }}
        className={`rounded-[1.5rem] transition cursor-pointer text-left border p-5
          ${selectedPlatform === 'youtube' ? 'border-white/24 bg-white/12' : 'border-white/10 bg-white/5 hover:border-white/18'}`}
      >
        <div className="flex items-center justify-between mb-4">
           <div className="w-11 h-11 bg-white/8 text-white rounded-full flex items-center justify-center border border-white/10">
             <Youtube className="w-5 h-5" />
           </div>
           {youtubeToken && <span className="bg-white/8 text-white text-[0.68rem] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10"><Check className="w-3 h-3" /> Connected</span>}
        </div>
        <p className="text-[0.72rem] font-semibold tracking-[0.22em] uppercase text-white/46">Destination</p>
        <h3 className="text-xl text-white font-semibold mt-2">YouTube</h3>
        <p className="text-white/58 text-[0.92rem] mt-2 max-w-md leading-6">
          {!youtubeToken ? 'Connect your account, then create the playlist in one step.' : 'Your account is ready. Select YouTube to continue.'}
        </p>
      </div>
    </div>
  )
}
