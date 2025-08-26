'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { use } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Card } from '@/components/atoms/Card'
import { Navigation } from '@/components/organisms/Navigation'

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
        isCouple: false
    })

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
                body: JSON.stringify(newGuest)
            })

            if (response.ok) {
                const guest = await response.json()
                setGuests(prev => [...prev, guest])
                setNewGuest({ name: '', email: '', phone: '', isCouple: false })
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

                            <div className="guests-checkbox-group">
                                <label className="guests-checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="guests-checkbox"
                                        checked={newGuest.isCouple}
                                        onChange={(e) => setNewGuest(prev => ({ ...prev, isCouple: e.target.checked }))}
                                    />
                                    <span className="guests-checkbox-text">Paar (zwei Personen)</span>
                                </label>
                            </div>

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
                                            <div className="guests-item-info">
                                                <h4 className="guests-item-name">
                                                    {guest.name}
                                                    {guest.isCouple && <span className="guests-item-couple"> (Paar)</span>}
                                                </h4>
                                                {guest.email && (
                                                    <p className="guests-item-contact">
                                                        {guest.email}
                                                    </p>
                                                )}
                                                {guest.phone && (
                                                    <p className="guests-item-contact">
                                                        {guest.phone}
                                                    </p>
                                                )}
                                                <div className="guests-item-status">
                                                    <span className={
                                                        guest.isAttending === true ? 'guests-item-status-attending' :
                                                            guest.isAttending === false ? 'guests-item-status-declined' :
                                                                'guests-item-status-pending'
                                                    }>
                                                        {guest.isAttending === true ? '✅ Zusage' :
                                                            guest.isAttending === false ? '❌ Absage' :
                                                                '⏳ Ausstehend'}
                                                    </span>
                                                    {guest.plusOne && <span>+1</span>}
                                                </div>
                                            </div>
                                            <div className="guests-item-actions">
                                                <button
                                                    className="guests-item-button guests-item-button-outline"
                                                    onClick={() => copyGuestLink(guest.id)}
                                                >
                                                    Link kopieren
                                                </button>
                                                <button
                                                    className="guests-item-button guests-item-button-danger"
                                                    onClick={() => handleDeleteGuest(guest.id)}
                                                >
                                                    Löschen
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
