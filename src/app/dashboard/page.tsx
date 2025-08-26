'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { Navigation } from '@/components/organisms/Navigation'

interface Invitation {
    id: string
    title: string
    date: string
    time: string
    address: string
    guests: Guest[]
}

interface Guest {
    id: string
    name: string
    isAttending: boolean | null
    isCouple: boolean
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            fetchInvitations()
        }
    }, [status, router])

    const fetchInvitations = async () => {
        try {
            const response = await fetch('/api/invitations')
            if (response.ok) {
                const data = await response.json()
                setInvitations(data)
            }
        } catch (error) {
            console.error('Fehler beim Laden der Einladungen:', error)
        } finally {
            setIsLoading(false)
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

    if (!session) {
        return null
    }

    return (
        <>
            <Navigation />
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <h1>Willkommen, {session.user?.name}!</h1>
                    <Button onClick={() => router.push('/invites/create')}>
                        Neue Einladung erstellen
                    </Button>
                </div>

                {invitations.length === 0 ? (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Noch keine Einladungen</h3>
                            <p style={{ marginBottom: '2rem', color: 'var(--secondary-color)' }}>
                                Erstellen Sie Ihre erste Einladung und laden Sie Gäste ein!
                            </p>
                            <Button onClick={() => router.push('/invites/create')}>
                                Erste Einladung erstellen
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {invitations.map((invitation) => (
                            <Card key={invitation.id}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem'
                                }}>
                                    <div>
                                        <h3 style={{ marginBottom: '0.5rem' }}>{invitation.title}</h3>
                                        <p style={{ color: 'var(--secondary-color)', marginBottom: '0.25rem' }}>
                                            {new Date(invitation.date).toLocaleDateString('de-DE')} um {invitation.time}
                                        </p>
                                        <p style={{ color: 'var(--secondary-color)' }}>{invitation.address}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/invites/${invitation.id}/guests`)}
                                        >
                                            Bearbeiten
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/invites/${invitation.id}/guests`)}
                                        >
                                            Gäste ({invitation.guests.length})
                                        </Button>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    fontSize: '0.875rem',
                                    color: 'var(--secondary-color)'
                                }}>
                                    <span>
                                        Zusagen: {invitation.guests.filter(g => g.isAttending === true).length}
                                    </span>
                                    <span>
                                        Absagen: {invitation.guests.filter(g => g.isAttending === false).length}
                                    </span>
                                    <span>
                                        Ausstehend: {invitation.guests.filter(g => g.isAttending === null).length}
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
