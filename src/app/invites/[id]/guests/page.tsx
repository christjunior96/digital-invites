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

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            fetchInvitation()
        }
    }, [status, router, id, fetchInvitation])

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
        <>
            <Navigation />
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                    }}>
                        <h1>Gäste verwalten</h1>
                        <Button onClick={() => router.push('/dashboard')}>
                            Zurück zum Dashboard
                        </Button>
                    </div>
                    <h2 style={{ color: 'var(--secondary-color)' }}>{invitation.title}</h2>
                    <p style={{ color: 'var(--secondary-color)' }}>
                        {new Date(invitation.date).toLocaleDateString('de-DE')} um {invitation.time} - {invitation.address}
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
                    {/* Neuen Gast hinzufügen */}
                    <Card>
                        <h3 style={{ marginBottom: '1rem' }}>Neuen Gast hinzufügen</h3>

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

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={newGuest.isCouple}
                                        onChange={(e) => setNewGuest(prev => ({ ...prev, isCouple: e.target.checked }))}
                                    />
                                    Paar (zwei Personen)
                                </label>
                            </div>

                            <Button type="submit" className="w-full">
                                Gast hinzufügen
                            </Button>
                        </form>
                    </Card>

                    {/* Gästeliste */}
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Gästeliste ({guests.length})</h3>

                        {guests.length === 0 ? (
                            <Card>
                                <p style={{ textAlign: 'center', color: 'var(--secondary-color)' }}>
                                    Noch keine Gäste hinzugefügt
                                </p>
                            </Card>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {guests.map((guest) => (
                                    <Card key={guest.id} padding="sm">
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start'
                                        }}>
                                            <div>
                                                <h4 style={{ marginBottom: '0.25rem' }}>
                                                    {guest.name}
                                                    {guest.isCouple && <span style={{ color: 'var(--secondary-color)' }}> (Paar)</span>}
                                                </h4>
                                                {guest.email && (
                                                    <p style={{ fontSize: '0.875rem', color: 'var(--secondary-color)' }}>
                                                        {guest.email}
                                                    </p>
                                                )}
                                                {guest.phone && (
                                                    <p style={{ fontSize: '0.875rem', color: 'var(--secondary-color)' }}>
                                                        {guest.phone}
                                                    </p>
                                                )}
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '1rem',
                                                    fontSize: '0.875rem',
                                                    marginTop: '0.5rem'
                                                }}>
                                                    <span style={{
                                                        color: guest.isAttending === true ? 'var(--success-color)' :
                                                            guest.isAttending === false ? 'var(--error-color)' :
                                                                'var(--secondary-color)'
                                                    }}>
                                                        {guest.isAttending === true ? '✅ Zusage' :
                                                            guest.isAttending === false ? '❌ Absage' :
                                                                '⏳ Ausstehend'}
                                                    </span>
                                                    {guest.plusOne && <span>+1</span>}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => copyGuestLink(guest.id)}
                                                >
                                                    Link kopieren
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteGuest(guest.id)}
                                                >
                                                    Löschen
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
