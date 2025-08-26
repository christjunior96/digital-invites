'use client'

import { useEffect, useState } from 'react'
import { use, useCallback } from 'react'
import { Button } from '@/components/atoms/Button'

import { Textarea } from '@/components/atoms/Textarea'
import { Card } from '@/components/atoms/Card'
import { Confetti } from '@/components/atoms/Confetti'
import { CelebrationConfetti } from '@/components/atoms/CelebrationConfetti'

interface Guest {
    id: string
    name: string
    email?: string
    phone?: string
    isCouple: boolean
    plusOne?: boolean
    isAttending: boolean | null
    notes?: string
}

interface Invitation {
    id: string
    title: string
    date: string
    time: string
    address: string
    description?: string
    backgroundImage?: string
    backgroundColor?: string
    contactInfo?: string
}

export default function GuestPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [guest, setGuest] = useState<Guest | null>(null)
    const [invitation, setInvitation] = useState<Invitation | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showCelebration, setShowCelebration] = useState(false)
    const [hasShownCelebration, setHasShownCelebration] = useState(false)
    const [formData, setFormData] = useState({
        isAttending: null as boolean | null,
        plusOne: false,
        notes: ''
    })

    const fetchGuestData = useCallback(async () => {
        try {
            const response = await fetch(`/api/guest/${id}`)
            if (response.ok) {
                const data = await response.json()
                setGuest(data.guest)
                setInvitation(data.invitation)

                // Vorausfüllen der Formulardaten
                if (data.guest.isAttending !== null) {
                    setFormData(prev => ({
                        ...prev,
                        isAttending: data.guest.isAttending,
                        plusOne: data.guest.plusOne || false,
                        notes: data.guest.notes || ''
                    }))
                    setIsSubmitted(true)

                    // Zeige Konfetti, wenn bereits eine Antwort gegeben wurde
                    if (data.guest.isAttending !== null && !hasShownCelebration) {
                        setShowCelebration(true)
                        setHasShownCelebration(true)
                    }
                }
            } else {
                setError('Einladung nicht gefunden')
            }
        } catch {
            setError('Ein Fehler ist aufgetreten')
        } finally {
            setIsLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchGuestData()
    }, [fetchGuestData])

    // Setze Hintergrund auf body
    useEffect(() => {
        if (invitation) {
            if (invitation.backgroundImage) {
                // Hintergrundbild auf body setzen
                document.body.style.background = `url(${invitation.backgroundImage})`
                document.body.style.backgroundSize = 'cover'
                document.body.style.backgroundPosition = 'center'
                document.body.style.backgroundAttachment = 'fixed'
                document.body.style.backgroundRepeat = 'no-repeat'
                document.body.style.animation = 'none'
                document.body.className = document.body.className.replace('animated-gradient', '')
            } else {
                // Animierter Gradient auf body setzen
                document.body.style.background = 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 25%, #45B7D1 50%, #96CEB4 75%, #FFEAA7 100%)'
                document.body.style.backgroundSize = '400% 400%'
                document.body.style.backgroundPosition = '0% 50%'
                document.body.style.backgroundAttachment = 'fixed'
                document.body.style.backgroundRepeat = 'no-repeat'
                document.body.style.animation = 'gradientShift 8s ease infinite'
                document.body.className = document.body.className + ' animated-gradient'
            }

            // Party-Lights auf body setzen (nur wenn kein Hintergrundbild)
            if (!invitation.backgroundImage) {
                // Erstelle Party-Lights Element
                let partyLights = document.getElementById('party-lights')
                if (!partyLights) {
                    partyLights = document.createElement('div')
                    partyLights.id = 'party-lights'
                    partyLights.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: 
                            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 90% 90%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
                        animation: lights 4s ease-in-out infinite alternate;
                        pointer-events: none;
                        z-index: 1;
                    `
                    document.body.appendChild(partyLights)
                }
            } else {
                // Entferne Party-Lights wenn Hintergrundbild gesetzt ist
                const partyLights = document.getElementById('party-lights')
                if (partyLights) {
                    partyLights.remove()
                }
            }
        }

        // Cleanup beim Verlassen der Komponente
        return () => {
            document.body.style.background = ''
            document.body.style.backgroundSize = ''
            document.body.style.backgroundPosition = ''
            document.body.style.backgroundAttachment = ''
            document.body.style.backgroundRepeat = ''
            document.body.style.animation = ''
            document.body.className = document.body.className.replace('animated-gradient', '')

            // Entferne Party-Lights
            const partyLights = document.getElementById('party-lights')
            if (partyLights) {
                partyLights.remove()
            }
        }
    }, [invitation])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.isAttending === null) {
            setError('Bitte wählen Sie aus, ob Sie kommen möchten')
            return
        }

        try {
            const response = await fetch(`/api/guest/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setIsSubmitted(true)
                setError('')

                // Starte Konfetti-Animation für alle Antworten
                setShowCelebration(true)
                setHasShownCelebration(true)

                // Stoppe die Konfetti-Animation nach 5 Sekunden
                setTimeout(() => {
                    setShowCelebration(false)
                }, 5000)
            } else {
                const data = await response.json()
                setError(data.error || 'Fehler beim Speichern')
            }
        } catch {
            setError('Ein Fehler ist aufgetreten')
        }
    }

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div>Laden...</div>
            </div>
        )
    }

    if (error || !guest || !invitation) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Card>
                    <h2>Fehler</h2>
                    <p>{error || 'Einladung nicht gefunden'}</p>
                </Card>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            padding: '2rem'
        }}>
            {/* Konfetti nur anzeigen, wenn kein Hintergrundbild gesetzt ist */}
            {!invitation.backgroundImage && <Confetti />}

            {/* Feier-Konfetti anzeigen, wenn der Gast antwortet */}
            <CelebrationConfetti trigger={showCelebration} isAttending={formData.isAttending || false} />



            <div className="container" style={{
                maxWidth: '600px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 2
            }}>
                <Card>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ marginBottom: '1rem' }}>{invitation.title}</h1>
                        <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                            {new Date(invitation.date).toLocaleDateString('de-DE', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                            um {invitation.time} Uhr
                        </p>
                        <p style={{ fontSize: '1rem', color: 'var(--secondary-color)' }}>
                            {invitation.address}
                        </p>
                    </div>

                    {invitation.description && (
                        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <p>{invitation.description}</p>
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>
                            Hallo {guest.name}!
                        </h3>
                        <p style={{ color: 'var(--secondary-color)' }}>
                            Bitte bestätigen Sie Ihre Teilnahme an der Veranstaltung.
                        </p>
                    </div>

                    {isSubmitted ? (
                        <div style={{ textAlign: 'center' }}>
                            <div className="alert alert--success">
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '1rem',
                                    background: formData.isAttending
                                        ? 'linear-gradient(135deg, #FF6B6B, #4ECDC4)'
                                        : 'inherit',
                                    WebkitBackgroundClip: formData.isAttending ? 'text' : 'inherit',
                                    WebkitTextFillColor: formData.isAttending ? 'transparent' : 'inherit'
                                }}>
                                    {formData.isAttending ? '🎉 Vielen Dank für Ihre Zusage! 🎉' : 'Vielen Dank für Ihre Antwort!'}
                                </h3>
                                <p style={{ fontSize: '1.1rem' }}>
                                    {formData.isAttending
                                        ? 'Wir freuen uns riesig auf Ihr Kommen! Es wird eine fantastische Party! 🎊'
                                        : 'Schade, dass Sie nicht kommen können. Wir werden Sie vermissen! 😔'
                                    }
                                </p>
                                {formData.notes && (
                                    <p style={{ marginTop: '1rem' }}>
                                        <strong>Ihre Anmerkung:</strong> {formData.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="alert alert--error">
                                    {error}
                                </div>
                            )}

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500' }}>
                                    Kommen Sie zur Veranstaltung?
                                </label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="radio"
                                            name="isAttending"
                                            value="true"
                                            checked={formData.isAttending === true}
                                            onChange={() => setFormData(prev => ({ ...prev, isAttending: true }))}
                                        />
                                        Ja, ich komme
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="radio"
                                            name="isAttending"
                                            value="false"
                                            checked={formData.isAttending === false}
                                            onChange={() => setFormData(prev => ({ ...prev, isAttending: false }))}
                                        />
                                        Nein, ich kann nicht kommen
                                    </label>
                                </div>
                            </div>

                            {!guest.isCouple && formData.isAttending === true && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.plusOne}
                                            onChange={(e) => setFormData(prev => ({ ...prev, plusOne: e.target.checked }))}
                                        />
                                        Ich bringe eine Begleitperson mit (+1)
                                    </label>
                                </div>
                            )}

                            <Textarea
                                label="Anmerkungen (optional)"
                                value={formData.notes}
                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Allergien, besondere Wünsche oder andere Anmerkungen..."
                            />

                            <Button type="submit" className="w-full">
                                Antwort senden
                            </Button>
                        </form>
                    )}

                    {invitation.contactInfo && (
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            backgroundColor: 'var(--background-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem'
                        }}>
                            <h4 style={{ marginBottom: '0.5rem' }}>Kontakt für Rückfragen:</h4>
                            <p style={{ color: 'var(--secondary-color)' }}>{invitation.contactInfo}</p>
                        </div>
                    )}
                </Card>
            </div>


        </div>
    )
}
