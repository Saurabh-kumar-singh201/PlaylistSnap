import LegalPage from '../components/LegalPage'

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service"
      description="These terms govern use of PlaylistSnap as a lightweight tool for creating private YouTube playlists from tracklist images."
    >
      <section>
        <h2 className="text-xl text-[var(--text)] font-semibold mb-2">Use of the service</h2>
        <p>You may use PlaylistSnap to upload tracklist images, extract song information, and create YouTube playlists in accounts you are authorized to use.</p>
      </section>
      <section>
        <h2 className="text-xl text-[var(--text)] font-semibold mb-2">Third-party platform rules</h2>
        <p>You are responsible for complying with Google and YouTube platform policies. PlaylistSnap depends on those third-party APIs and may stop working if their limits, terms, or availability change.</p>
      </section>
      <section>
        <h2 className="text-xl text-[var(--text)] font-semibold mb-2">Availability</h2>
        <p>The service is provided as-is without guarantees of uninterrupted availability, perfect extraction quality, or exact song matching.</p>
      </section>
      <section>
        <h2 className="text-xl text-[var(--text)] font-semibold mb-2">Liability</h2>
        <p>To the extent permitted by law, PlaylistSnap is not liable for indirect or incidental losses arising from use of the app or connected third-party services.</p>
      </section>
    </LegalPage>
  )
}
