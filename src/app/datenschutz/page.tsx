import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Datenschutzerklärung – Digital Invites',
    description: 'Informationen zum Datenschutz gemäß DSGVO für Digital Invites.'
}

export default function DatenschutzPage() {
    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <p style={{ marginBottom: '1rem' }}>
                <a href="/" className="btn btn--primary" aria-label="Zur Startseite">
                    ← Zur Startseite
                </a>
            </p>
            <h1 className="navigation-title" style={{ marginBottom: '1rem' }}>Datenschutzerklärung</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Stand: {new Date().toLocaleDateString('de-DE')}</p>

            <div className="card">
                <h2 style={{ marginTop: 0 }}>Verantwortlicher</h2>
                <p>
                    Louis Christ<br />
                    Koloniestraße 29/16<br />
                    1210 Wien, Österreich<br />
                    E-Mail: <a href="mailto:christ.louis96@gmail.com">christ.louis96@gmail.com</a>
                </p>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2>Verarbeitungszwecke</h2>
                <p>Bereitstellung der Plattform, Nutzerverwaltung, Einladungen, Gästelisten, RSVP-Verwaltung, statistische Auswertungen.</p>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2>Rechtsgrundlagen</h2>
                <p>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung), Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen), ggf. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</p>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2>Logfiles und Cookies</h2>
                <p>Technisch notwendige Cookies und Server-Logfiles werden zur Sicherstellung des Betriebs und der Sicherheit eingesetzt.</p>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2>Datenweitergabe</h2>
                <p>Es erfolgt keine Weitergabe an Dritte, außer es ist zur Erfüllung der Zwecke erforderlich oder gesetzlich vorgeschrieben.</p>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2>Speicherdauer</h2>
                <p>Personenbezogene Daten werden gelöscht, sobald der Zweck entfällt und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2>Betroffenenrechte</h2>
                <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch.</p>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2>Kontakt und Beschwerden</h2>
                <p>Wenden Sie sich bei Fragen an die oben genannte E-Mail. Zudem besteht ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde.</p>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2>Änderungen dieser Erklärung</h2>
                <p>Wir behalten uns Aktualisierungen dieser Datenschutzerklärung vor, um sie an geänderte Rechtslagen oder bei Änderungen des Dienstes anzupassen.</p>
            </div>
        </div>
    )
}


