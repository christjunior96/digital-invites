'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="landing-loading">
        <div className="loading-spinner"></div>
        <p>Laden...</p>
      </div>
    )
  }

  return (
    <div className="landing-page">
      {/* Header mit Navigation */}
      <header className="landing-header">
        <div className="landing-container">
          <div className="landing-logo">
            <h1>Digital Invites</h1>
          </div>
          <div className="landing-auth">
            {!session ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/login')}
                  className="landing-login-btn"
                >
                  Anmelden
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push('/register')}
                  className="landing-register-btn"
                >
                  Registrieren
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                Zum Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="hero-content">
            <h2 className="hero-title">
              Erstellen Sie wunderschöne digitale Einladungen
            </h2>
            <p className="hero-subtitle">
              Verwalten Sie Ihre Veranstaltungen, Gästelisten und Antworten - alles an einem Ort
            </p>
            <div className="hero-buttons">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/register')}
                className="hero-cta-primary"
              >
                Jetzt kostenlos starten
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/login')}
                className="hero-cta-secondary"
              >
                Bereits Kunde? Anmelden
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-preview">
              <div className="preview-card">
                <div className="preview-header">
                  <h3>Geburtstagsfeier</h3>
                  <p>Samstag, 15. Juni 2024</p>
                  <p>um 19:00 Uhr</p>
                </div>
                <div className="preview-body">
                  <p>Feiern Sie mit uns! 🎉</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-container">
          <h2 className="section-title">Alles was Sie brauchen</h2>
          <div className="features-grid">
            <Card className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Schöne Designs</h3>
              <p>Wählen Sie aus verschiedenen Vorlagen oder erstellen Sie Ihre eigene einzigartige Einladung</p>
            </Card>
            <Card className="feature-card">
              <div className="feature-icon">📧</div>
              <h3>Einfache Verteilung</h3>
              <p>Teilen Sie Ihre Einladung per E-Mail, WhatsApp oder über einen persönlichen Link</p>
            </Card>
            <Card className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Gästeliste verwalten</h3>
              <p>Behalten Sie den Überblick über Ihre Gäste und deren Antworten</p>
            </Card>
            <Card className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Übersichtliche Statistiken</h3>
              <p>Sehen Sie auf einen Blick, wer kommt und wer nicht</p>
            </Card>
            <Card className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>Spotify Integration</h3>
              <p>Fügen Sie Ihre Playlist hinzu und lassen Sie Gäste Musik vorschlagen</p>
            </Card>
            <Card className="feature-card">
              <div className="feature-icon">📸</div>
              <h3>Foto-Upload</h3>
              <p>Gäste können Fotos hochladen und Erinnerungen teilen</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="landing-how-it-works">
        <div className="landing-container">
          <h2 className="section-title">So einfach geht&apos;s</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>Einladung erstellen</h3>
              <p>Wählen Sie ein Design und fügen Sie Ihre Veranstaltungsdetails hinzu</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>Gäste einladen</h3>
              <p>Fügen Sie Ihre Gästeliste hinzu und versenden Sie die Einladungen</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>Antworten verwalten</h3>
              <p>Verfolgen Sie die Antworten Ihrer Gäste in Echtzeit</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-container">
          <Card className="cta-card">
            <h2>Bereit für Ihre nächste Veranstaltung?</h2>
            <p>Erstellen Sie noch heute Ihre erste digitale Einladung</p>
            <div className="cta-buttons">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/register')}
              >
                Kostenlos registrieren
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Digital Invites</h3>
              <p>Die moderne Lösung für Ihre Veranstaltungen</p>
            </div>
            <div className="footer-section">
              <h4>Features</h4>
              <ul>
                <li>Digitale Einladungen</li>
                <li>Gästeliste verwalten</li>
                <li>RSVP Tracking</li>
                <li>Spotify Integration</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>Hilfe-Center</li>
                <li>Kontakt</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Digital Invites. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
