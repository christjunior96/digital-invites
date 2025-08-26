'use client'

import React, { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Card } from '@/components/atoms/Card'

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { data: session, status } = useSession()

    // Redirect wenn bereits eingeloggt
    useEffect(() => {
        if (status === 'authenticated' && session) {
            console.log('Session detected, redirecting to dashboard')
            router.push('/dashboard')
        }
    }, [session, status, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        console.log('Login attempt for:', email)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            })

            console.log('SignIn result:', result)

            if (result?.error) {
                console.error('SignIn error:', result.error)
                setError('Ungültige Anmeldedaten')
            } else if (result?.ok) {
                console.log('SignIn successful, waiting for session...')
                setError('') // Clear any previous errors

                // Warten auf Session-Update
                setTimeout(() => {
                    console.log('Checking session status...')
                    if (status === 'authenticated') {
                        console.log('Session confirmed, redirecting to dashboard')
                        router.push('/dashboard')
                    } else {
                        console.log('Session not yet available, forcing redirect')
                        // Fallback: Direkter Redirect
                        window.location.href = '/dashboard'
                    }
                }, 1000)
            } else {
                console.log('SignIn result unclear:', result)
                setError('Ein unerwarteter Fehler ist aufgetreten')
            }
        } catch (error) {
            console.error('Login error:', error)
            setError('Ein Fehler ist aufgetreten')
        } finally {
            setIsLoading(false)
        }
    }

    // Zeige Ladezustand wenn Session geprüft wird
    if (status === 'loading') {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #FF6B6B',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p>Prüfe Anmeldestatus...</p>
                </div>
            </Card>
        )
    }

    // Zeige nichts wenn bereits eingeloggt
    if (status === 'authenticated') {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #4CAF50',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p>Sie sind bereits angemeldet. Weiterleitung...</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="login-card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    animation: 'bounce 2s ease-in-out infinite'
                }}>
                    🎉
                </div>
                <h2 style={{
                    marginBottom: '0.5rem',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                }}>
                    Willkommen zurück!
                </h2>
                <p style={{
                    color: '#666',
                    fontSize: '1.1rem',
                    margin: 0
                }}>
                    Melde dich an und starte die Party! 🎊
                </p>
            </div>

            {error && (
                <div className="alert alert--error" style={{
                    background: 'rgba(255, 107, 107, 0.1)',
                    border: '2px solid #FF6B6B',
                    borderRadius: '15px',
                    color: '#FF6B6B',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    animation: 'shake 0.5s ease-in-out'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Input
                    label="E-Mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="ihre@email.de"
                    style={{
                        marginBottom: '1.5rem'
                    }}
                />

                <Input
                    label="Passwort"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Ihr Passwort"
                    style={{
                        marginBottom: '2rem'
                    }}
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                    style={{
                        background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '1rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: 'white',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1,
                        transform: isLoading ? 'scale(0.98)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
                    }}
                >
                    {isLoading ? (
                        <span>
                            <span style={{
                                display: 'inline-block',
                                width: '16px',
                                height: '16px',
                                border: '2px solid transparent',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginRight: '0.5rem'
                            }} />
                            Anmelden...
                        </span>
                    ) : (
                        '🎉 Anmelden 🎉'
                    )}
                </Button>
            </form>

            <div style={{
                marginTop: '2rem',
                textAlign: 'center',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
                <p style={{ margin: 0, color: '#666' }}>
                    Noch kein Konto?{' '}
                    <a href="/register" style={{
                        color: '#FF6B6B',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        transition: 'color 0.3s ease'
                    }}>
                        Registrieren 🎊
                    </a>
                </p>
            </div>


        </Card>
    )
}
