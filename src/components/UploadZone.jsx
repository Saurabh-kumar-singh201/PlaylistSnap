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
      <div className="relative group w-full overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/25">
        <img src={preview} alt="Tracklist preview" className="w-full max-h-[360px] object-cover" />
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-[linear-gradient(180deg,rgba(7,5,19,0.08),rgba(7,5,19,0.66))] opacity-0 transition group-hover:opacity-100">
          <button
            onClick={resetImage}
            className="rounded-full border border-white/15 bg-white text-[#140f2c] p-2.5 shadow-lg"
            title="Remove Image"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-white/15 bg-white/12 px-5 py-2 text-sm font-medium text-white backdrop-blur-md"
          >
            Change image
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
      className={`upload-surface rounded-[1.55rem] p-8 md:p-10 border cursor-pointer text-center transition duration-300 ${
        isDragging ? 'border-white/40 bg-white/12' : 'border-white/10 hover:border-white/20'
      }`}
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

      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white">
        <UploadCloud className="w-8 h-8" />
      </div>

      <h3 className="text-2xl md:text-3xl font-semibold tracking-[-0.05em] text-white">Drop your image here</h3>
      <p className="mt-3 text-sm md:text-base leading-7 text-white/62 max-w-xl mx-auto">
        Upload a screenshot, poster, or handwritten tracklist. Supported formats: JPG, PNG, and WEBP.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3.5 py-2 text-[0.78rem] text-white/62">
        <ImageIcon className="w-4 h-4" />
        <span>Click to browse or drag and drop</span>
      </div>
    </div>
  )
}
