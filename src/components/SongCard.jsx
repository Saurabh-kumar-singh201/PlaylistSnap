import { Check, Music } from 'lucide-react'

export default function SongCard({ song, onToggle }) {
  return (
    <div 
      onClick={() => onToggle(song.id)}
      className={`glass-panel p-4 rounded-xl flex items-center gap-4 cursor-pointer transition duration-300 transform hover:-translate-y-1 hover:shadow-xl
        ${song.selected ? 'border-indigo-500/50 bg-indigo-500/10' : 'opacity-60 grayscale-[50%]'}`}
    >
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition flex-shrink-0
        ${song.selected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-neutral-500'}
      `}>
        {song.selected && <Check className="w-4 h-4" />}
      </div>
      
      <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
        <Music className="w-5 h-5 text-neutral-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate">{song.title}</h4>
        <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
      </div>
    </div>
  )
}
