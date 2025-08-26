'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/atoms/Button'

export function Navigation() {
    const { data: session } = useSession()

    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' })
    }

    if (!session) {
        return null
    }

    return (
        <nav style={{
            backgroundColor: 'var(--background-color)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 0'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem'
                    }}>
                        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
                            Digital Invites
                        </h1>
                        <div style={{
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <a
                                href="/dashboard"
                                style={{
                                    color: 'var(--primary-color)',
                                    textDecoration: 'none',
                                    fontWeight: '500'
                                }}
                            >
                                Dashboard
                            </a>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <span style={{ color: 'var(--secondary-color)' }}>
                            Hallo, {session.user?.name}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSignOut}
                        >
                            Abmelden
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
