'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { use } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Card } from '@/components/atoms/Card'
import { Navigation } from '@/components/organisms/Navigation'
import QRCode from 'qrcode'

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
    guests: Guest[]
}

export default function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { data: session, status } = useSession()
    const router = useRouter()
    const [invitation, setInvitation] = useState<Invitation | null>(null)
    const [guests, setGuests] = useState<Guest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [newGuest, setNewGuest] = useState({
        name: '',
        email: '',
        phone: '',
        isCouple: false,
        plusOneAllowed: false
    })

    const exportCsv = async () => {
        try {
            const res = await fetch(`/api/invitations/${id}/guests/export`)
            if (!res.ok) return
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `gaesteliste-${id}.csv`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch {
            console.error('Fehler beim CSV-Export')
        }
    }

    const fetchInvitation = useCallback(async () => {
        try {
            const response = await fetch(`/api/invitations/${id}`)
            if (response.ok) {
                const data = await response.json()
                setInvitation(data)
                setGuests(data.guests)
            }
        } catch {
            console.error('Fehler beim Laden der Einladung')
        } finally {
            setIsLoading(false)
        }
    }, [id])

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            fetchInvitation()
        }
    }, [status, router, fetchInvitation])

    const handleAddGuest = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newGuest.name.trim()) return

        try {
            const response = await fetch(`/api/invitations/${id}/guests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...newGuest,
                    // Bei Paaren ist plusOneAllowed irrelevant
                    plusOneAllowed: newGuest.isCouple ? undefined : newGuest.plusOneAllowed
                })
            })

            if (response.ok) {
                const guest = await response.json()
                setGuests(prev => [...prev, guest])
                setNewGuest({ name: '', email: '', phone: '', isCouple: false, plusOneAllowed: false })
            } else {
                const data = await response.json()
                setError(data.error || 'Fehler beim Hinzufügen des Gasts')
            }
        } catch {
            setError('Ein Fehler ist aufgetreten')
        }
    }

    const handleDeleteGuest = async (guestId: string) => {
        if (!confirm('Möchten Sie diesen Gast wirklich löschen?')) return

        try {
            const response = await fetch(`/api/invitations/${id}/guests/${guestId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setGuests(prev => prev.filter(g => g.id !== guestId))
            }
        } catch {
            setError('Fehler beim Löschen des Gasts')
        }
    }

    const copyGuestLink = (guestId: string) => {
        const link = `${window.location.origin}/guest/${guestId}`
        navigator.clipboard.writeText(link)
        alert('Link kopiert!')
    }

    const downloadQRCode = async (guestId: string, guestName: string) => {
        try {
            const link = `${window.location.origin}/guest/${guestId}`
            const qrDataUrl = await QRCode.toDataURL(link, {
                width: 512,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })
            
            // Konvertiere Data URL zu Blob
            const response = await fetch(qrDataUrl)
            const blob = await response.blob()
            
            // Erstelle Download-Link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `qr-code-${guestName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Fehler beim Generieren des QR-Codes:', error)
            setError('Fehler beim Generieren des QR-Codes')
        }
    }

    const togglePlusOneAllowed = async (guestId: string, current: boolean | undefined, isCouple: boolean) => {
        try {
            const response = await fetch(`/api/guest/${guestId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plusOneAllowed: !current })
            })
            if (response.ok) {
                const { guest } = await response.json()
                setGuests(prev => prev.map(g => g.id === guestId ? { ...g, plusOneAllowed: guest.plusOneAllowed, plusOne: guest.plusOne } : g))
            }
        } catch {
            setError('Fehler beim Aktualisieren der +1-Erlaubnis')
        }
    }

    if (status === 'loading' || isLoading) {
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

    if (!session || !invitation) {
        return null
    }

    return (
        <div className="guests-page">
            <Navigation />
            <div className="guests-container">
                <div className="guests-header">
                    <div className="guests-header-top">
                        <h1 className="guests-title">Gäste verwalten</h1>
                        <button className="guests-back-button" onClick={() => router.push('/dashboard')}>
                            Zurück zum Dashboard
                        </button>
                    </div>
                    <h2 className="guests-event-title">{invitation.title}</h2>
                    <p className="guests-event-details">
                        {new Date(invitation.date).toLocaleDateString('de-DE')} um {invitation.time} - {invitation.address}
                    </p>
                    <div style={{ marginTop: 12 }}>
                        <Button onClick={exportCsv}>CSV exportieren</Button>
                    </div>
                </div>

                <div className="guests-content">
                    {/* Neuen Gast hinzufügen */}
                    <div className="guests-add-card">
                        <h3 className="guests-add-title">Neuen Gast hinzufügen</h3>

                        {error && (
                            <div className="alert alert--error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAddGuest}>
                            <Input
                                label="Name"
                                value={newGuest.name}
                                onChange={(e) => setNewGuest(prev => ({ ...prev, name: e.target.value }))}
                                required
                                placeholder="Name des Gasts"
                            />

                            <Input
                                label="E-Mail (optional)"
                                type="email"
                                value={newGuest.email}
                                onChange={(e) => setNewGuest(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="E-Mail des Gasts"
                            />

                            <Input
                                label="Telefon (optional)"
                                type="text"
                                value={newGuest.phone}
                                onChange={(e) => setNewGuest(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="Telefonnummer des Gasts"
                            />

                            <div className="guest-form-group">
                                <label className="guest-form-label">Gast-Typ</label>
                                <div className="guest-type-switch">
                                    <label className={`guest-type-option ${newGuest.isCouple ? '' : 'selected'}`}
                                        onClick={() => setNewGuest(prev => ({ ...prev, isCouple: false }))}
                                    >
                                        <input
                                            type="radio"
                                            name="guestType"
                                            checked={!newGuest.isCouple}
                                            onChange={() => setNewGuest(prev => ({ ...prev, isCouple: false }))}
                                        />
                                        <span>Single</span>
                                    </label>
                                    <label className={`guest-type-option ${newGuest.isCouple ? 'selected' : ''}`}
                                        onClick={() => setNewGuest(prev => ({ ...prev, isCouple: true, plusOneAllowed: false }))}
                                    >
                                        <input
                                            type="radio"
                                            name="guestType"
                                            checked={newGuest.isCouple}
                                            onChange={() => setNewGuest(prev => ({ ...prev, isCouple: true, plusOneAllowed: false }))}
                                        />
                                        <span>Paar (zwei Personen)</span>
                                    </label>
                                </div>
                            </div>

                            {!newGuest.isCouple && (
                                <div className="guests-checkbox-group">
                                    <label className="guests-checkbox-label">
                                        <input
                                            type="checkbox"
                                            className="guests-checkbox"
                                            checked={newGuest.plusOneAllowed}
                                            onChange={(e) => setNewGuest(prev => ({ ...prev, plusOneAllowed: e.target.checked }))}
                                        />
                                        <span>+1 erlauben</span>
                                    </label>
                                </div>
                            )}

                            <Button type="submit" className="w-full">
                                Gast hinzufügen
                            </Button>
                        </form>
                    </div>

                    {/* Gästeliste */}
                    <div className="guests-list-section">
                        <h3 className="guests-list-title">Gästeliste ({guests.length})</h3>

                        {guests.length === 0 ? (
                            <div className="guests-list-empty">
                                <p>Noch keine Gäste hinzugefügt</p>
                            </div>
                        ) : (
                            <div className="guests-list">
                                {guests.map((guest) => (
                                    <div key={guest.id} className="guests-item-card">
                                        <div className="guests-item-content">
                                            <div className="guests-item-info" style={{ flex: 1 }}>
                                                <div className="guests-item-header">
                                                    <h4 className="guests-item-name" style={{ marginBottom: 0 }}>
                                                        {guest.name}
                                                        {guest.isCouple && <span className="guests-item-couple"> (Paar)</span>}
                                                    </h4>
                                                    <div className="guests-item-badges">
                                                        <span className={`badge ${guest.isAttending === true ? 'badge--attending' :
                                                            guest.isAttending === false ? 'badge--declined' :
                                                                'badge--pending'
                                                            }`}>
                                                            {guest.isAttending === true ? 'Zusage' :
                                                                guest.isAttending === false ? 'Absage' :
                                                                    'Ausstehend'}
                                                        </span>
                                                        {guest.plusOne && (
                                                            <span className="badge badge--allowed">+1</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {(guest.email || guest.phone) && (
                                                    <div className="guests-item-meta">
                                                        {guest.email && <span>{guest.email}</span>}
                                                        {guest.email && guest.phone && <span> · </span>}
                                                        {guest.phone && <span>{guest.phone}</span>}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="guests-item-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                <button
                                                    className="guests-item-button guests-item-button-outline guests-item-button-compact"
                                                    onClick={() => copyGuestLink(guest.id)}
                                                    aria-label="Link kopieren"
                                                >
                                                    📋
                                                </button>
                                                <button
                                                    className="guests-item-button guests-item-button-outline guests-item-button-compact"
                                                    onClick={() => downloadQRCode(guest.id, guest.name)}
                                                    aria-label="QR-Code herunterladen"
                                                    style={{ fontSize: '18px', lineHeight: 1 }}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="3" y="3" width="5" height="5" fill="currentColor"/>
                                                        <rect x="3" y="16" width="5" height="5" fill="currentColor"/>
                                                        <rect x="16" y="3" width="5" height="5" fill="currentColor"/>
                                                        <rect x="16" y="16" width="5" height="5" fill="currentColor"/>
                                                        <rect x="11" y="3" width="2" height="2" fill="currentColor"/>
                                                        <rect x="11" y="7" width="2" height="2" fill="currentColor"/>
                                                        <rect x="7" y="11" width="2" height="2" fill="currentColor"/>
                                                        <rect x="3" y="11" width="2" height="2" fill="currentColor"/>
                                                        <rect x="19" y="11" width="2" height="2" fill="currentColor"/>
                                                        <rect x="15" y="11" width="2" height="2" fill="currentColor"/>
                                                        <rect x="11" y="15" width="2" height="2" fill="currentColor"/>
                                                        <rect x="11" y="19" width="2" height="2" fill="currentColor"/>
                                                        <rect x="7" y="19" width="2" height="2" fill="currentColor"/>
                                                        <rect x="15" y="19" width="2" height="2" fill="currentColor"/>
                                                        <rect x="19" y="19" width="2" height="2" fill="currentColor"/>
                                                    </svg>
                                                </button>
                                                {!guest.isCouple && (
                                                    <button
                                                        className="guests-item-button guests-item-button-outline guests-item-button-compact"
                                                        onClick={() => togglePlusOneAllowed(guest.id, guest.plusOneAllowed, guest.isCouple)}
                                                        aria-label={guest.plusOneAllowed ? 'Plus One verbieten' : 'Plus One erlauben'}
                                                    >
                                                        {guest.plusOneAllowed ? '🚫1' : '➕1'}
                                                    </button>
                                                )}
                                                <button
                                                    className="guests-item-button guests-item-button-danger guests-item-button-compact"
                                                    onClick={() => handleDeleteGuest(guest.id)}
                                                    aria-label="Löschen"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
