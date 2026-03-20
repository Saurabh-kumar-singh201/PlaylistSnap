import LegalPage from '../components/LegalPage'

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      description="This page explains what PlaylistSnap processes when you upload an image and connect your YouTube account."
    >
      <section>
        <h2 className="text-xl text-[var(--text)] font-semibold mb-2">What PlaylistSnap does</h2>
        <p>PlaylistSnap converts a tracklist image into a YouTube playlist. You upload an image, the app extracts song names, and it creates a playlist in your connected YouTube account.</p>
      </section>
      <section>
        <h2 className="text-xl text-[var(--text)] font-semibold mb-2">What data is processed</h2>
        <p>The app processes the image you upload, the extracted song list, your playlist title, and the YouTube OAuth token needed to create playlists on your behalf.</p>
      </section>
      <section>
        <h2 className="text-xl text-[var(--text)] font-semibold mb-2">How tokens are stored</h2>
        <p>YouTube access tokens are stored in your browser session storage for the current session. They are used only to search for videos and create the playlist you request.</p>
      </section>
      <section>
        <h2 className="text-xl text-[var(--text)] font-semibold mb-2">Third-party services</h2>
        <p>PlaylistSnap relies on Google Identity Services, YouTube Data API, and the configured AI extraction service. Your use of those services is also subject to their own terms and privacy policies.</p>
      </section>
      <section>
        <h2 className="text-xl text-[var(--text)] font-semibold mb-2">Contact</h2>
        <p>For questions about this app or your data, contact <a className="text-[var(--text)] underline underline-offset-4" href="mailto:iamthegreatsk201@gmail.com">iamthegreatsk201@gmail.com</a>.</p>
      </section>
    </LegalPage>
  )
}
