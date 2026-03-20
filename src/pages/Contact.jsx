import LegalPage from '../components/LegalPage'

export default function Contact() {
  return (
    <LegalPage
      eyebrow="Support"
      title="Contact"
      description="Need help with PlaylistSnap, OAuth access, or a playlist issue? Reach out here."
    >
      <section>
        <h2 className="text-xl text-[var(--text)] font-semibold mb-2">Support Email</h2>
        <p><a className="text-[var(--text)] underline underline-offset-4" href="mailto:iamthegreatsk201@gmail.com">iamthegreatsk201@gmail.com</a></p>
      </section>
      <section>
        <h2 className="text-xl text-[var(--text)] font-semibold mb-2">What to include</h2>
        <p>If something breaks, include the page you were on, the action you took, and any visible error message so the issue can be reproduced faster.</p>
      </section>
    </LegalPage>
  )
}
