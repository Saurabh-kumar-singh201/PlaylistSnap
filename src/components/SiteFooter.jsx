import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--line)]">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-6 flex flex-col gap-3 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[0.82rem] font-semibold tracking-[0.16em] uppercase text-[var(--text)]">PlaylistSnap</span>
          <span>Image to private YouTube playlist</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/privacy" className="hover:text-[var(--text)] transition">Privacy</Link>
          <Link to="/terms" className="hover:text-[var(--text)] transition">Terms</Link>
          <Link to="/contact" className="hover:text-[var(--text)] transition">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
