'use client'

import { useEffect, useState } from 'react'

export function PWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
    const [showInstallButton, setShowInstallButton] = useState(false)

    useEffect(() => {
        // Service Worker registrieren
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered successfully:', registration)
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error)
                })
        }

        // PWA Install Prompt abfangen
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setShowInstallButton(true)
        }

        // PWA Install Event
        const handleAppInstalled = () => {
            console.log('PWA was installed')
            setShowInstallButton(false)
            setDeferredPrompt(null)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        // Type assertion für PWA Install Prompt
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prompt = deferredPrompt as any
        prompt.prompt()
        const { outcome } = await prompt.userChoice

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt')
        } else {
            console.log('User dismissed the install prompt')
        }

        setDeferredPrompt(null)
        setShowInstallButton(false)
    }

    // Install-Button nur anzeigen, wenn PWA installierbar ist
    if (!showInstallButton) return null

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '25px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
        }}
            onClick={handleInstallClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)'
            }}
        >
            📱 App installieren
        </div>
    )
}
