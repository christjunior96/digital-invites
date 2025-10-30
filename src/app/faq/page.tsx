import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ – Digital Invites | Häufige Fragen',
  description: 'Antworten auf die häufigsten Fragen zu Digital Invites: Einladungen, Gäste, +1, Datenschutz, PWA und mehr.'
}

const faqs = [
  {
    question: 'Was ist Digital Invites?',
    answer: 'Eine Web-App zum Erstellen digitaler Einladungen, Verwalten von Gästelisten und Erfassen von Zusagen.'
  },
  {
    question: 'Kostet Digital Invites etwas?',
    answer: 'Es gibt eine kostenlose Nutzung. Zukünftige Premium-Funktionen können kostenpflichtig werden.'
  },
  {
    question: 'Wie versende ich Einladungen?',
    answer: 'Per personalisiertem Link über E-Mail, Messenger oder QR-Code.'
  },
  {
    question: 'Können Gäste mit +1 kommen?',
    answer: 'Ja, pro Gast kann individuell eine Begleitperson erlaubt werden. Paare haben kein +1.'
  },
  {
    question: 'Wie funktioniert das RSVP-Tracking?',
    answer: 'Gäste antworten über ihren individuellen Link. Zusagen/Absagen und Personenanzahl werden automatisch gezählt.'
  },
  {
    question: 'Sind meine Daten sicher?',
    answer: 'Wir achten auf Datenschutz nach DSGVO-Grundsätzen. Details finden Sie in unserer Datenschutzerklärung.'
  },
  {
    question: 'Kann ich meine Daten exportieren?',
    answer: 'Geplante Exportfunktionen (CSV) sind vorgesehen.'
  },
  {
    question: 'Gibt es eine App?',
    answer: 'Digital Invites ist eine PWA und kann zum Homescreen hinzugefügt werden (Offline-Grundfunktionen).' 
  },
  {
    question: 'Wie erreiche ich den Support?',
    answer: 'Kontaktmöglichkeiten finden Sie im Impressum oder direkt innerhalb der App.'
  }
]

export default function FAQPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/" className="btn btn--primary" aria-label="Zur Startseite">
          ← Zur Startseite
        </Link>
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="navigation-title" style={{ marginBottom: '1rem' }}>FAQ</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Antworten auf häufige Fragen rund um Digital Invites.</p>
      <div className="guests-list" style={{ display: 'grid', gap: '1rem' }}>
        {faqs.map((item) => (
          <div className="card" key={item.question}>
            <h2 style={{ marginTop: 0, marginBottom: '.5rem' }}>{item.question}</h2>
            <p style={{ margin: 0, color: '#555' }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}


