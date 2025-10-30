'use client'

import { useEffect, useState } from 'react'
import { use, useCallback } from 'react'
import { Card } from '@/components/atoms/Card'
import { Confetti } from '@/components/atoms/Confetti'
import { CelebrationConfetti } from '@/components/atoms/CelebrationConfetti'
import { CalendarButton } from '@/components/atoms/CalendarButton'

interface Guest {
    id: string
    name: string
    email?: string
    phone?: string
    isCouple: boolean
    plusOne?: boolean
    plusOneAllowed?: boolean
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
    contactInfo?: string
    spotifyPlaylist?: string
    photoUploadLink?: string
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
    const [dynQuestions, setDynQuestions] = useState<any[]>([])
    const [answersP1, setAnswersP1] = useState<Record<string, { text?: string; optionIds?: string[] }>>({})
    const [answersP2, setAnswersP2] = useState<Record<string, { text?: string; optionIds?: string[] }>>({})

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

    useEffect(() => {
        const loadQA = async () => {
            try {
                const res = await fetch(`/api/guest/${id}/answers`)
                if (!res.ok) return
                const data = await res.json()
                setDynQuestions(data.invitationQuestions || [])
                const a1: Record<string, { text?: string; optionIds?: string[] }> = {}
                const a2: Record<string, { text?: string; optionIds?: string[] }> = {}
                for (const ans of data.answers || []) {
                    const target = ans.personIndex === 2 ? a2 : a1
                    if (ans.textAnswer) target[ans.invitationQuestionId] = { ...(target[ans.invitationQuestionId] || {}), text: ans.textAnswer }
                    if (ans.selectedOptions?.length) target[ans.invitationQuestionId] = { ...(target[ans.invitationQuestionId] || {}), optionIds: ans.selectedOptions.map((o: any) => o.optionId) }
                }
                setAnswersP1(a1)
                setAnswersP2(a2)
            } catch {}
        }
        loadQA()
    }, [id])

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
                if (formData.isAttending === true) {
                    const hasSecond = guest.isCouple || (guest.plusOneAllowed === true && formData.plusOne === true)
                    const payload = {
                        answers: [
                            ...dynQuestions.map((iq: any) => {
                                const val = answersP1[iq.id] || {}
                                return {
                                    invitationQuestionId: iq.id,
                                    textAnswer: iq.question.type === 'TEXT' ? (val.text ?? null) : null,
                                    optionIds: (iq.question.type === 'SINGLE' || iq.question.type === 'MULTI') ? (val.optionIds ?? []) : [],
                                    personIndex: 1
                                }
                            }),
                            ...(hasSecond ? dynQuestions.map((iq: any) => {
                                const val = answersP2[iq.id] || {}
                                return {
                                    invitationQuestionId: iq.id,
                                    textAnswer: iq.question.type === 'TEXT' ? (val.text ?? null) : null,
                                    optionIds: (iq.question.type === 'SINGLE' || iq.question.type === 'MULTI') ? (val.optionIds ?? []) : [],
                                    personIndex: 2
                                }
                            }) : [])
                        ]
                    }
                    await fetch(`/api/guest/${id}/answers`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    })
                }

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
            <div className="guest-loading">
                <div>Laden...</div>
            </div>
        )
    }

    if (error || !guest || !invitation) {
        return (
            <div className="guest-error">
                <Card>
                    <h2>Fehler</h2>
                    <p>{error || 'Einladung nicht gefunden'}</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="guest-page">
            {/* Konfetti nur anzeigen, wenn kein Hintergrundbild gesetzt ist */}
            {!invitation.backgroundImage && <Confetti />}

            {/* Feier-Konfetti anzeigen, wenn der Gast antwortet */}
            <CelebrationConfetti trigger={showCelebration} isAttending={formData.isAttending || false} />

            <div className="guest-container">
                <Card>
                    <div className="guest-header">
                        <h1 className="guest-title">{invitation.title}</h1>
                        <p className="guest-date">
                            {new Date(invitation.date).toLocaleDateString('de-DE', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        <p className="guest-date">
                            um {invitation.time} Uhr
                        </p>
                        <p className="guest-address">
                            {invitation.address}
                        </p>
                    </div>

                    {invitation.description && (
                        <div className="guest-description">
                            <p>{invitation.description}</p>
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>
                            Hallo {guest.name}!
                        </h3>
                        {!isSubmitted && (
                            <p style={{ color: 'var(--secondary-color)' }}>
                                Bitte bestätigen Sie Ihre Teilnahme an der Veranstaltung.
                            </p>
                        )}
                    </div>

                    {isSubmitted ? (
                        <div className="guest-success-message">
                            <h3 className="guest-success-title">
                                {formData.isAttending ? '🎉 Vielen Dank für Ihre Zusage! 🎉' : 'Vielen Dank für Ihre Antwort!'}
                            </h3>
                            <p className="guest-success-text">
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

                            {/* Links nur anzeigen, wenn der Gast zugesagt hat */}
                            {formData.isAttending && (
                                <div className="guest-links-section">
                                    {invitation.spotifyPlaylist && (
                                        <a
                                            href={invitation.spotifyPlaylist}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="guest-link-button guest-spotify-button"
                                        >
                                            🎵 Spotify Playlist hören
                                        </a>
                                    )}

                                    {invitation.photoUploadLink && (
                                        <a
                                            href={invitation.photoUploadLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="guest-link-button guest-photo-button"
                                        >
                                            📸 Fotos hochladen
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Kalender-Button nur anzeigen, wenn der Gast zugesagt hat */}
                            {formData.isAttending && (
                                <CalendarButton
                                    title={invitation.title}
                                    date={invitation.date}
                                    time={invitation.time}
                                    address={invitation.address}
                                    description={invitation.description}
                                />
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="guest-form">
                            {error && (
                                <div className="guest-error-message">
                                    {error}
                                </div>
                            )}

                            <div className="guest-form-group">
                                <label className="guest-form-label">
                                    Kommen Sie zur Veranstaltung?
                                </label>
                                <div className="guest-radio-group">
                                    <label className={`guest-radio-option ${formData.isAttending === true ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="isAttending"
                                            value="true"
                                            checked={formData.isAttending === true}
                                            onChange={() => setFormData(prev => ({ ...prev, isAttending: true }))}
                                        />
                                        <span>Ja, ich komme</span>
                                    </label>
                                    <label className={`guest-radio-option ${formData.isAttending === false ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="isAttending"
                                            value="false"
                                            checked={formData.isAttending === false}
                                            onChange={() => setFormData(prev => ({ ...prev, isAttending: false }))}
                                        />
                                        <span>Nein, ich kann nicht kommen</span>
                                    </label>
                                </div>
                            </div>

                            {!guest.isCouple && guest.plusOneAllowed === true && formData.isAttending === true && (
                                <div className="guest-form-group">
                                    <label className="guest-checkbox-group">
                                        <input
                                            type="checkbox"
                                            className="guest-checkbox"
                                            checked={formData.plusOne}
                                            onChange={(e) => setFormData(prev => ({ ...prev, plusOne: e.target.checked }))}
                                        />
                                        <span>Ich bringe eine Begleitperson mit (+1)</span>
                                    </label>
                                </div>
                            )}

                            <div className="guest-form-group">
                                <label className="guest-notes-label">Anmerkungen (optional)</label>
                                <textarea
                                    className="guest-notes-textarea"
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Allergien, besondere Wünsche oder andere Anmerkungen..."
                                />
                            </div>

                            {dynQuestions.length > 0 && formData.isAttending === true && (
                                <div className="guest-form-group" style={{ marginTop: '1rem' }}>
                                    <label className="guest-form-label">Zusätzliche Fragen</label>
                                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                                        {dynQuestions.map((iq: any) => (
                                            <div key={iq.id}>
                                                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                                                    {iq.question.prompt}{iq.required ? ' *' : ''}
                                                </div>
                                                {iq.question.type === 'TEXT' && (
                                                    <input
                                                        type="text"
                                                        value={answersP1[iq.id]?.text || ''}
                                                        onChange={(e) => setAnswersP1(prev => ({ ...prev, [iq.id]: { ...(prev[iq.id] || {}), text: e.target.value } }))}
                                                        style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #e5e7eb' }}
                                                    />
                                                )}
                                                {iq.question.type === 'SINGLE' && (
                                                    <div style={{ display: 'grid', gap: 6 }}>
                                                        {iq.question.options.map((opt: any) => (
                                                            <label key={opt.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                                <input
                                                                    type="radio"
                                                                    name={`q-${iq.id}`}
                                                                    checked={(answersP1[iq.id]?.optionIds || [])[0] === opt.id}
                                                                    onChange={() => setAnswersP1(prev => ({ ...prev, [iq.id]: { optionIds: [opt.id] } }))}
                                                                />
                                                                <span>{opt.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                                {iq.question.type === 'MULTI' && (
                                                    <div style={{ display: 'grid', gap: 6 }}>
                                                        {iq.question.options.map((opt: any) => {
                                                            const selected = (answersP1[iq.id]?.optionIds || []).includes(opt.id)
                                                            return (
                                                                <label key={opt.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selected}
                                                                        onChange={(e) => setAnswersP1(prev => {
                                                                            const current = new Set(prev[iq.id]?.optionIds || [])
                                                                            if (e.target.checked) current.add(opt.id); else current.delete(opt.id)
                                                                            return { ...prev, [iq.id]: { optionIds: Array.from(current) } }
                                                                        })}
                                                                    />
                                                                    <span>{opt.label}</span>
                                                                </label>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {dynQuestions.length > 0 && formData.isAttending === true && (guest.isCouple || (guest.plusOneAllowed === true && formData.plusOne === true)) && (
                                <div className="guest-form-group" style={{ marginTop: '1rem' }}>
                                    <label className="guest-form-label">Zusätzliche Fragen (Person 2)</label>
                                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                                        {dynQuestions.map((iq: any) => (
                                            <div key={iq.id}>
                                                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                                                    {iq.question.prompt}{iq.required ? ' *' : ''}
                                                </div>
                                                {iq.question.type === 'TEXT' && (
                                                    <input
                                                        type="text"
                                                        value={answersP2[iq.id]?.text || ''}
                                                        onChange={(e) => setAnswersP2(prev => ({ ...prev, [iq.id]: { ...(prev[iq.id] || {}), text: e.target.value } }))}
                                                        style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #e5e7eb' }}
                                                    />
                                                )}
                                                {iq.question.type === 'SINGLE' && (
                                                    <div style={{ display: 'grid', gap: 6 }}>
                                                        {iq.question.options.map((opt: any) => (
                                                            <label key={opt.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                                <input
                                                                    type="radio"
                                                                    name={`q2-${iq.id}`}
                                                                    checked={(answersP2[iq.id]?.optionIds || [])[0] === opt.id}
                                                                    onChange={() => setAnswersP2(prev => ({ ...prev, [iq.id]: { optionIds: [opt.id] } }))}
                                                                />
                                                                <span>{opt.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                                {iq.question.type === 'MULTI' && (
                                                    <div style={{ display: 'grid', gap: 6 }}>
                                                        {iq.question.options.map((opt: any) => {
                                                            const selected = (answersP2[iq.id]?.optionIds || []).includes(opt.id)
                                                            return (
                                                                <label key={opt.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selected}
                                                                        onChange={(e) => setAnswersP2(prev => {
                                                                            const current = new Set(prev[iq.id]?.optionIds || [])
                                                                            if (e.target.checked) current.add(opt.id); else current.delete(opt.id)
                                                                            return { ...prev, [iq.id]: { optionIds: Array.from(current) } }
                                                                        })}
                                                                    />
                                                                    <span>{opt.label}</span>
                                                                </label>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="guest-submit-button">
                                Antwort senden
                            </button>
                        </form>
                    )}

                    {invitation.contactInfo && (
                        <div className="guest-response-info">
                            <h4 className="guest-response-title">Kontakt für Rückfragen:</h4>
                            <p className="guest-response-details">{invitation.contactInfo}</p>
                        </div>
                    )}
                </Card>
            </div>


        </div>
    )
}
