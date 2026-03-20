import { Check, Music } from 'lucide-react'

export default function SongCard({ song, onToggle }) {
  return (
    <div 
      onClick={() => onToggle(song.id)}
      className={`rounded-[1.25rem] flex items-center gap-3 cursor-pointer transition border p-4
        ${song.selected ? 'border-white/24 bg-white/12' : 'border-white/10 bg-white/5 hover:border-white/18 opacity-75'}`}
    >
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition flex-shrink-0
        ${song.selected ? 'bg-white border-white text-[#140f2c]' : 'border-white/28'}
      `}>
        {song.selected && <Check className="w-3.5 h-3.5" />}
      </div>
      
      <div className="w-10 h-10 rounded-xl bg-white/6 flex items-center justify-center flex-shrink-0 border border-white/10">
        <Music className="w-4 h-4 text-white/62" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-white text-[0.98rem] font-medium truncate">{song.title}</h4>
        <p className="text-white/56 text-[0.84rem] truncate">{song.artist}</p>
      </div>
    </div>
  )
}
