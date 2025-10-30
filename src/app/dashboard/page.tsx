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
    plusOne?: boolean
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Funktion zur Berechnung der Personenanzahl
    const calculatePersonCount = (guests: Guest[]) => {
        return guests.reduce((total, guest) => {
            if (guest.isCouple) {
                return total + 2 // Paare zählen als 2 Personen
            } else if (guest.plusOne) {
                return total + 2 // Einzelpersonen mit +1 zählen als 2 Personen
            } else {
                return total + 1 // Einzelpersonen zählen als 1 Person
            }
        }, 0)
    }

    // Funktion zur Berechnung der Personenanzahl der Zusagen
    const calculateAttendingPersonCount = (guests: Guest[]) => {
        return guests.reduce((total, guest) => {
            if (guest.isAttending === true) {
                if (guest.isCouple) {
                    return total + 2 // Paare zählen als 2 Personen
                } else if (guest.plusOne) {
                    return total + 2 // Einzelpersonen mit +1 zählen als 2 Personen
                } else {
                    return total + 1 // Einzelpersonen zählen als 1 Person
                }
            }
            return total
        }, 0)
    }

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
            <div className="dashboard-loading">
                <div className="dashboard-loading-content">
                    <div className="dashboard-loading-spinner" />
                    <p className="dashboard-loading-text">Lade deine Einladungen...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Subtile Party-Elemente */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
                    radial-gradient(circle at 10% 20%, rgba(255, 107, 107, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 90% 80%, rgba(78, 205, 196, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(69, 183, 209, 0.03) 0%, transparent 50%)
                `,
                pointerEvents: 'none'
            }} />

            <Navigation />

            <div className="container" style={{
                paddingTop: '2rem',
                paddingBottom: '2rem',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Header Section */}
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">
                            Willkommen, {session.user?.name}! 🎉
                        </h1>
                        <p className="dashboard-subtitle">
                            Verwalte deine Einladungen und organisiere perfekte Events
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/invites/create')}
                        className="dashboard-create-button"
                    >
                        🎊 Neue Einladung erstellen
                    </button>
                </div>

                {/* Stats Section */}
                {invitations.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        <Card style={{
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '2px solid rgba(255, 107, 107, 0.2)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#FF6B6B' }}>
                                {invitations.length}
                            </h3>
                            <p style={{ margin: 0, color: '#666' }}>
                                {invitations.length === 1 ? 'Einladung' : 'Einladungen'}
                            </p>
                        </Card>

                        <Card style={{
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '2px solid rgba(78, 205, 196, 0.2)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#4ECDC4' }}>
                                {invitations.reduce((total, inv) => total + inv.guests.length, 0)}
                            </h3>
                            <p style={{ margin: 0, color: '#666' }}>Gäste insgesamt</p>
                        </Card>

                        <Card style={{
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '2px solid rgba(255, 193, 7, 0.2)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#FFC107' }}>
                                {invitations.reduce((total, inv) => total + calculatePersonCount(inv.guests), 0)}
                            </h3>
                            <p style={{ margin: 0, color: '#666' }}>Personen insgesamt</p>
                        </Card>

                        <Card style={{
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '2px solid rgba(69, 183, 209, 0.2)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#45B7D1' }}>
                                {invitations.reduce((total, inv) =>
                                    total + inv.guests.filter(g => g.isAttending === true).length, 0
                                )}
                            </h3>
                            <p style={{ margin: 0, color: '#666' }}>Zusagen</p>
                        </Card>
                    </div>
                )}

                {/* Invitations Section */}
                {invitations.length === 0 ? (
                    <Card style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎊</div>
                        <h3 style={{
                            marginBottom: '1rem',
                            fontSize: '1.5rem',
                            color: '#333'
                        }}>
                            Noch keine Einladungen
                        </h3>
                        <p style={{
                            marginBottom: '2rem',
                            color: '#666',
                            fontSize: '1.1rem'
                        }}>
                            Erstelle deine erste Einladung und starte die Party! 🎉
                        </p>
                        <Button
                            onClick={() => router.push('/invites/create')}
                            style={{
                                background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                                border: 'none',
                                borderRadius: '15px',
                                padding: '1rem 2rem',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                color: 'white',
                                boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
                            }}
                        >
                            🎊 Erste Einladung erstellen
                        </Button>
                    </Card>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {invitations.map((invitation) => (
                            <Card key={invitation.id} style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
                                }}
                                onClick={() => router.push(`/invites/${invitation.id}/guests`)}
                            >
                                <div className="dashboard-invitation-header">
                                    <div>
                                        <h3 className="dashboard-invitation-title">
                                            {invitation.title}
                                        </h3>
                                        <p className="dashboard-invitation-date">
                                            📅 {new Date(invitation.date).toLocaleDateString('de-DE', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })} um {invitation.time}
                                        </p>
                                        <p className="dashboard-invitation-address">
                                            📍 {invitation.address}
                                        </p>
                                    </div>
                                    <div className="dashboard-invitation-actions">
                                        <button
                                            className="dashboard-invitation-button dashboard-invitation-button-outline-danger"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(`/invites/${invitation.id}/edit`)
                                            }}
                                        >
                                            ✏️ Bearbeiten
                                        </button>
                                        <button
                                            className="dashboard-invitation-button dashboard-invitation-button-outline-teal"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(`/invites/${invitation.id}/guests`)
                                            }}
                                        >
                                            👥 Gäste ({invitation.guests.length})
                                        </button>
                                    </div>
                                </div>

                                <div className="dashboard-invitation-stats">
                                    <span className="dashboard-invitation-stat dashboard-invitation-stat-attending">
                                        <span>✅</span>
                                        Zusagen: {invitation.guests.filter(g => g.isAttending === true).length} ({calculateAttendingPersonCount(invitation.guests)} Personen)
                                    </span>
                                    <span className="dashboard-invitation-stat dashboard-invitation-stat-declined">
                                        <span>❌</span>
                                        Absagen: {invitation.guests.filter(g => g.isAttending === false).length}
                                    </span>
                                    <span className="dashboard-invitation-stat dashboard-invitation-stat-pending">
                                        <span>⏳</span>
                                        Ausstehend: {invitation.guests.filter(g => g.isAttending === null).length}
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
