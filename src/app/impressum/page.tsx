import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Impressum – Digital Invites',
    description: 'Impressum von Digital Invites mit Angaben zum Diensteanbieter und Kontakt.'
}

export default function ImpressumPage() {
    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <p style={{ marginBottom: '1rem' }}>
                <a href="/" className="btn btn--primary" aria-label="Zur Startseite">
                    ← Zur Startseite
                </a>
            </p>
            <h1 className="navigation-title" style={{ marginBottom: '1rem' }}>Impressum</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Angaben gemäß § 5 TMG</p>

            <div className="card">
                <h2 style={{ marginTop: 0 }}>Diensteanbieter</h2>
                <p>
                    Louis Christ<br />
                    Koloniestraße 29/16<br />
                    1210 Wien, Österreich
                </p>
                <p>
                    Kontakt: <a href="mailto:christ.louis96@gmail.com">christ.louis96@gmail.com</a>
                </p>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2>Haftung für Inhalte</h2>
                <p>
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
                    Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
                    übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
                    rechtswidrige Tätigkeit hinweisen.
                </p>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2>Haftung für Links</h2>
                <p>
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb
                    können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist
                    stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2>Urheberrecht</h2>
                <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
                    Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen
                    des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
            </div>
        </div>
    )
}


