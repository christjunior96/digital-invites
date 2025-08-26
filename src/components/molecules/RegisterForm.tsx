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
        <Card>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                Registrieren
            </h2>

            {error && (
                <div className="alert alert--error">
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
                />

                <Input
                    label="E-Mail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    placeholder="ihre@email.de"
                />

                <Input
                    label="Passwort"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    placeholder="Mindestens 8 Zeichen"
                />

                <Input
                    label="Passwort bestätigen"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                    placeholder="Passwort wiederholen"
                />

                <Textarea
                    label="Kontaktinformationen (optional)"
                    value={formData.contactInfo}
                    onChange={(e) => handleChange('contactInfo', e.target.value)}
                    placeholder="Telefonnummer, Adresse oder andere Kontaktdaten für Ihre Gäste"
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Registrieren...' : 'Registrieren'}
                </Button>
            </form>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p>
                    Bereits ein Konto?{' '}
                    <a href="/login" style={{ color: 'var(--primary-color)' }}>
                        Anmelden
                    </a>
                </p>
            </div>
        </Card>
    )
}
