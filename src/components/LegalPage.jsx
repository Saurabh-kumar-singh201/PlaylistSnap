import { Link } from 'react-router-dom'

export default function LegalPage({ eyebrow, title, description, children }) {
  return (
    <div className="py-10 md:py-14">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm text-[var(--muted)] hover:text-[var(--text)] transition mb-6">
          Back to PlaylistSnap
        </Link>
        <div className="surface rounded-[1.75rem] p-6 md:p-8 border border-[var(--line)]">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="text-3xl md:text-4xl text-[var(--text)] font-semibold tracking-[-0.04em] mt-3">{title}</h1>
          {description && <p className="text-[var(--muted)] mt-3 max-w-2xl leading-7">{description}</p>}
          <div className="mt-8 space-y-6 text-[0.98rem] leading-7 text-[var(--muted)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
