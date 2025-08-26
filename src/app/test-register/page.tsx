'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestRegisterPage() {
    const [email, setEmail] = useState('test@example.com')
    const [password, setPassword] = useState('testpassword123')
    const [name, setName] = useState('Test User')
    const [status, setStatus] = useState('')
    const [error, setError] = useState('')

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('')
        setError('')

        try {
            setStatus('Registriere Benutzer...')

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name
                    }
                }
            })

            if (error) {
                setError(`Registrierungsfehler: ${error.message}`)
                console.error('Registration error:', error)
            } else {
                setStatus(`✅ Benutzer erfolgreich erstellt! 
                Email: ${data.user?.email}
                ID: ${data.user?.id}
                
                Sie können sich jetzt mit diesen Daten anmelden.`)
                console.log('Registration successful:', data)
            }
        } catch (err) {
            setError(`Unerwarteter Fehler: ${err}`)
            console.error('Unexpected error:', err)
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Test Registrierung</h1>

            <form onSubmit={handleRegister} style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Name:
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Email:
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Passwort:
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Benutzer erstellen
                </button>
            </form>

            {status && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #0ea5e9',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    whiteSpace: 'pre-line'
                }}>
                    {status}
                </div>
            )}

            {error && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #ef4444',
                    borderRadius: '4px',
                    color: '#dc2626'
                }}>
                    {error}
                </div>
            )}

            <div style={{ marginTop: '2rem' }}>
                <h3>Nächste Schritte:</h3>
                <ol>
                    <li>Erstellen Sie einen Testbenutzer mit diesem Formular</li>
                    <li>Gehen Sie zu <a href="/login">/login</a> und melden Sie sich an</li>
                    <li>Überprüfen Sie die Browser-Konsole (F12) für Debug-Informationen</li>
                </ol>
            </div>
        </div>
    )
}
