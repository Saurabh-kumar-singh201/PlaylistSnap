import { useState, useRef } from 'react'
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react'

export default function UploadZone({ onImageSelected }) {
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      onImageSelected(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  const resetImage = (e) => {
    e.stopPropagation()
    setPreview(null)
    onImageSelected(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (preview) {
    return (
      <div className="relative group w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <img src={preview} alt="Tracklist preview" className="w-full object-cover max-h-[400px]" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col items-center justify-center backdrop-blur-sm">
           <button 
            onClick={resetImage}
            className="mb-4 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-3 transition shadow-lg backdrop-blur-md"
            title="Remove Image"
           >
              <X className="w-6 h-6" />
           </button>
           <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-full transition backdrop-blur-md"
           >
              Change Image
           </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden" 
        />
      </div>
    )
  }

  return (
    <div 
      className={`glass rounded-2xl p-10 md:p-14 border-2 border-dashed transition duration-300 cursor-pointer flex flex-col items-center justify-center text-center
        ${isDragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden" 
      />
      
      <div className="w-20 h-20 mb-6 bg-indigo-500/20 text-indigo-300 rounded-full flex items-center justify-center border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
        <UploadCloud className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-semibold mb-2 text-white/90">Click to upload</h3>
      <p className="text-neutral-400 text-lg mb-6">or drag and drop your tracklist image</p>
      
      <div className="flex items-center space-x-2 text-xs text-neutral-500 bg-black/20 px-4 py-2 rounded-full border border-white/5">
        <ImageIcon className="w-4 h-4" />
        <span>Supports JPG, PNG and WEBP</span>
      </div>
    </div>
  )
}
