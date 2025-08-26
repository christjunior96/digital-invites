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
                    <p>Sie sind bereits angemeldet. Weiterleitung...</p>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                Anmelden
            </h2>

            {error && (
                <div className="alert alert--error">
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
                />

                <Input
                    label="Passwort"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Ihr Passwort"
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Anmelden...' : 'Anmelden'}
                </Button>
            </form>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p>
                    Noch kein Konto?{' '}
                    <a href="/register" style={{ color: 'var(--primary-color)' }}>
                        Registrieren
                    </a>
                </p>
            </div>
        </Card>
    )
}
