'use client'

import { useState, useEffect } from 'react'

export default function EnvCheckPage() {
    const [serverEnvData, setServerEnvData] = useState<Record<string, string | undefined> | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Nur clientseitig verfügbare Variablen
    const clientEnvVars = {
        'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
        'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'NEXTAUTH_URL': process.env.NEXTAUTH_URL
    }

    const missingClientVars = Object.entries(clientEnvVars)
        .filter(([, value]) => !value)
        .map(([key]) => key)

    const checkServerEnv = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/env-check')
            const data = await response.json()
            setServerEnvData(data)
        } catch {
            setError('Fehler beim Abrufen der serverseitigen Variablen')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkServerEnv()
    }, [])

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Umgebungsvariablen Check</h1>

            <div style={{ marginBottom: '2rem' }}>
                <h2>Client-seitig verfügbare Variablen:</h2>
                <div style={{
                    padding: '1rem',
                    backgroundColor: missingClientVars.length > 0 ? '#fef2f2' : '#f0f9ff',
                    border: `1px solid ${missingClientVars.length > 0 ? '#ef4444' : '#0ea5e9'}`,
                    borderRadius: '4px'
                }}>
                    {missingClientVars.length > 0 ? (
                        <div>
                            <h3 style={{ color: '#dc2626' }}>❌ Fehlende Client-Variablen:</h3>
                            <ul>
                                {missingClientVars.map(key => (
                                    <li key={key} style={{ color: '#dc2626' }}>{key}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div>
                            <h3 style={{ color: '#065f46' }}>✅ Alle Client-Variablen sind gesetzt!</h3>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2>Client-seitig verfügbare Variablen:</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f3f4f6' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #d1d5db' }}>Variable</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #d1d5db' }}>Wert</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(clientEnvVars).map(([key, value]) => (
                            <tr key={key}>
                                <td style={{ padding: '0.5rem', border: '1px solid #d1d5db', fontFamily: 'monospace' }}>
                                    {key}
                                </td>
                                <td style={{ padding: '0.5rem', border: '1px solid #d1d5db', fontFamily: 'monospace' }}>
                                    {key.includes('KEY')
                                        ? (value ? '***' + value.slice(-4) : '❌ Missing')
                                        : value || '❌ Missing'
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2>Server-seitige Variablen:</h2>
                {loading && (
                    <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '4px' }}>
                        Lade serverseitige Variablen...
                    </div>
                )}

                {error && (
                    <div style={{ padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #ef4444', borderRadius: '4px' }}>
                        <p style={{ color: '#dc2626' }}>❌ {error}</p>
                        <button
                            onClick={checkServerEnv}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#0070f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Erneut versuchen
                        </button>
                    </div>
                )}

                {serverEnvData && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: serverEnvData.allSet ? '#f0f9ff' : '#fef2f2',
                        border: `1px solid ${serverEnvData.allSet ? '#0ea5e9' : '#ef4444'}`,
                        borderRadius: '4px'
                    }}>
                        {serverEnvData.allSet ? (
                            <h3 style={{ color: '#065f46' }}>✅ Alle serverseitigen Variablen sind gesetzt!</h3>
                        ) : (
                            <div>
                                <h3 style={{ color: '#dc2626' }}>❌ Fehlende serverseitige Variablen:</h3>
                                <ul>
                                    {serverEnvData.missingVars.map((key: string) => (
                                        <li key={key} style={{ color: '#dc2626' }}>{key}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f3f4f6' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #d1d5db' }}>Variable</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #d1d5db' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(serverEnvData.envVars)
                                    .filter(([key]) => !key.startsWith('NEXT_PUBLIC_'))
                                    .map(([key, value]) => (
                                        <tr key={key}>
                                            <td style={{ padding: '0.5rem', border: '1px solid #d1d5db', fontFamily: 'monospace' }}>
                                                {key}
                                            </td>
                                            <td style={{ padding: '0.5rem', border: '1px solid #d1d5db', fontFamily: 'monospace' }}>
                                                {value}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {missingClientVars.length > 0 && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '4px'
                }}>
                    <h3>🔧 Nächste Schritte:</h3>
                    <ol>
                        <li>Erstellen Sie eine <code>.env.local</code> Datei im Projektroot</li>
                        <li>Fügen Sie die fehlenden Client-Variablen hinzu (mit <code>NEXT_PUBLIC_</code> Prefix)</li>
                        <li>Starten Sie den Entwicklungsserver neu: <code>npm run dev</code></li>
                        <li>Überprüfen Sie diese Seite erneut</li>
                    </ol>

                    <div style={{ marginTop: '1rem' }}>
                        <h4>Beispiel .env.local:</h4>
                        <pre style={{
                            backgroundColor: '#1f2937',
                            color: '#f9fafb',
                            padding: '1rem',
                            borderRadius: '4px',
                            overflow: 'auto'
                        }}>
                            {`# Database (nur serverseitig)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth (nur serverseitig)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Supabase - ÖFFENTLICH (client-seitig verfügbar)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Supabase - PRIVAT (nur serverseitig)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`}
                        </pre>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '2rem' }}>
                <h3>🔗 Nützliche Links:</h3>
                <ul>
                    <li><a href="/test" style={{ color: '#0070f3' }}>Supabase Test</a> - Testen Sie die Verbindung</li>
                    <li><a href="/test-register" style={{ color: '#0070f3' }}>Test Registrierung</a> - Erstellen Sie einen Testbenutzer</li>
                    <li><a href="/login" style={{ color: '#0070f3' }}>Login</a> - Testen Sie die Anmeldung</li>
                </ul>
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '4px'
            }}>
                <h3>ℹ️ Wichtiger Hinweis:</h3>
                <p>In Next.js sind nur Umgebungsvariablen mit dem <code>NEXT_PUBLIC_</code> Prefix im Client (Browser) verfügbar. Alle anderen Variablen sind nur serverseitig verfügbar und können hier nicht angezeigt werden.</p>
                <p>Das ist normal und sicher - sensitive Daten wie API Keys sollten nicht clientseitig verfügbar sein!</p>
            </div>
        </div>
    )
}
