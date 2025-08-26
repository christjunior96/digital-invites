'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { Card } from '@/components/atoms/Card'
import { Navigation } from '@/components/organisms/Navigation'

export default function CreateInvitationPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        address: '',
        date: '',
        time: '',
        description: '',
        backgroundColor: '#ffffff',
        contactInfo: ''
    })

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/invitations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                const invitation = await response.json()
                router.push(`/invites/${invitation.id}/guests`)
            } else {
                const data = await response.json()
                setError(data.error || 'Fehler beim Erstellen der Einladung')
            }
        } catch {
            setError('Ein Fehler ist aufgetreten')
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'loading') {
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

    if (!session) {
        return null
    }

    return (
        <>
            <Navigation />
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1>Neue Einladung erstellen</h1>
                        <p style={{ color: 'var(--secondary-color)', marginTop: '0.5rem' }}>
                            Erstellen Sie eine neue Einladung für Ihre Veranstaltung
                        </p>
                    </div>

                    <Card>
                        {error && (
                            <div className="alert alert--error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Titel der Einladung"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                required
                                placeholder="z.B. Geburtstagsfeier, Hochzeit, etc."
                            />

                            <Input
                                label="Adresse"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                required
                                placeholder="Vollständige Adresse der Veranstaltung"
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input
                                    label="Datum"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleChange('date', e.target.value)}
                                    required
                                />

                                <Input
                                    label="Uhrzeit"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => handleChange('time', e.target.value)}
                                    required
                                />
                            </div>

                            <Textarea
                                label="Beschreibung (optional)"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Weitere Details zur Veranstaltung..."
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Hintergrundfarbe</label>
                                    <input
                                        type="color"
                                        value={formData.backgroundColor}
                                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                        style={{
                                            width: '100%',
                                            height: '50px',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Vorschau</label>
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '50px',
                                            backgroundColor: formData.backgroundColor,
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: formData.backgroundColor === '#ffffff' ? '#000' : '#fff'
                                        }}
                                    >
                                        Vorschau
                                    </div>
                                </div>
                            </div>

                            <Textarea
                                label="Kontaktinformationen (optional)"
                                value={formData.contactInfo}
                                onChange={(e) => handleChange('contactInfo', e.target.value)}
                                placeholder="Telefonnummer, E-Mail oder andere Kontaktdaten für Rückfragen"
                            />

                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                marginTop: '2rem',
                                justifyContent: 'flex-end'
                            }}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    Abbrechen
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Erstellen...' : 'Einladung erstellen'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    )
}
