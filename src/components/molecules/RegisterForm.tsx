'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { Card } from '@/components/atoms/Card'

export function RegisterForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactInfo: ''
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwörter stimmen nicht überein')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    contactInfo: formData.contactInfo
                })
            })

            if (response.ok) {
                router.push('/login?message=Registrierung erfolgreich')
            } else {
                const data = await response.json()
                setError(data.error || 'Registrierung fehlgeschlagen')
            }
        } catch {
            setError('Ein Fehler ist aufgetreten')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="register-card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    animation: 'bounce 2s ease-in-out infinite'
                }}>
                    🎊
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
                    Werde Teil der Party!
                </h2>
                <p style={{
                    color: '#666',
                    fontSize: '1.1rem',
                    margin: 0
                }}>
                    Erstelle dein Konto und starte deine erste Einladung! 🎉
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
                    label="Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    placeholder="Ihr vollständiger Name"
                    style={{
                        marginBottom: '1.5rem'
                    }}
                />

                <Input
                    label="E-Mail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    placeholder="ihre@email.de"
                    style={{
                        marginBottom: '1.5rem'
                    }}
                />

                <Input
                    label="Passwort"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    placeholder="Mindestens 8 Zeichen"
                    style={{
                        marginBottom: '1.5rem'
                    }}
                />

                <Input
                    label="Passwort bestätigen"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                    placeholder="Passwort wiederholen"
                    style={{
                        marginBottom: '1.5rem'
                    }}
                />

                <Textarea
                    label="Kontaktinformationen (optional)"
                    value={formData.contactInfo}
                    onChange={(e) => handleChange('contactInfo', e.target.value)}
                    placeholder="Telefonnummer, Adresse oder andere Kontaktdaten für Ihre Gäste"
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
                            Registrieren...
                        </span>
                    ) : (
                        '🎊 Registrieren 🎊'
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
                    Bereits ein Konto?{' '}
                    <a href="/login" style={{
                        color: '#FF6B6B',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        transition: 'color 0.3s ease'
                    }}>
                        Anmelden 🎉
                    </a>
                </p>
            </div>
        </Card>
    )
}
