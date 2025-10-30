import type { Metadata } from 'next'
import Script from 'next/script'
import LandingClient from './LandingClient'

export const metadata: Metadata = {
  title: 'Digital Invites – Moderne digitale Einladungen erstellen | Gästelisten & RSVP',
  description: 'Erstellen Sie in Minuten wunderschöne, digitale Einladungen. Gästelisten, RSVP-Tracking, Spotify, Foto-Upload und mehr – alles an einem Ort.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Digital Invites – Moderne digitale Einladungen',
    description: 'Gästelisten, RSVP-Tracking, Spotify, Foto-Upload und mehr – alles an einem Ort.',
    url: '/',
    siteName: 'Digital Invites',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Invites – Moderne digitale Einladungen',
    description: 'Gästelisten, RSVP-Tracking, Spotify, Foto-Upload und mehr – alles an einem Ort.'
  }
}

export default function HomePage() {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Digital Invites',
    url: typeof window === 'undefined' ? 'https://example.com' : window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: '{search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Digital Invites',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR'
    }
  }

  return (
    <>
      <Script id="ld-website" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(websiteJsonLd)}
      </Script>
      <Script id="ld-app" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(appJsonLd)}
      </Script>
      <LandingClient />
    </>
  )
}
