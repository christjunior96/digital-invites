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
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #FF6B6B',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>Lade deine Einladungen...</p>
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
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem',
                    padding: '2rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '0.5rem'
                        }}>
                            Willkommen, {session.user?.name}! 🎉
                        </h1>
                        <p style={{
                            margin: 0,
                            color: '#666',
                            fontSize: '1.1rem'
                        }}>
                            Verwalte deine Einladungen und organisiere perfekte Events
                        </p>
                    </div>
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
                            boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        🎊 Neue Einladung erstellen
                    </Button>
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
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div>
                                        <h3 style={{
                                            marginBottom: '0.5rem',
                                            fontSize: '1.5rem',
                                            color: '#333'
                                        }}>
                                            {invitation.title}
                                        </h3>
                                        <p style={{
                                            color: '#666',
                                            marginBottom: '0.25rem',
                                            fontSize: '1.1rem'
                                        }}>
                                            📅 {new Date(invitation.date).toLocaleDateString('de-DE', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })} um {invitation.time}
                                        </p>
                                        <p style={{ color: '#666' }}>
                                            📍 {invitation.address}
                                        </p>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        flexDirection: 'column'
                                    }}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(`/invites/${invitation.id}/edit`)
                                            }}
                                            style={{
                                                border: '2px solid #FF6B6B',
                                                color: '#FF6B6B',
                                                borderRadius: '10px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ✏️ Bearbeiten
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(`/invites/${invitation.id}/guests`)
                                            }}
                                            style={{
                                                border: '2px solid #4ECDC4',
                                                color: '#4ECDC4',
                                                borderRadius: '10px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            👥 Gäste ({invitation.guests.length})
                                        </Button>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '2rem',
                                    fontSize: '0.9rem',
                                    color: '#666',
                                    padding: '1rem',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#10b981' }}>✅</span>
                                        Zusagen: {invitation.guests.filter(g => g.isAttending === true).length}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#ef4444' }}>❌</span>
                                        Absagen: {invitation.guests.filter(g => g.isAttending === false).length}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#f59e0b' }}>⏳</span>
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
