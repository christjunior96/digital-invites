'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function DebugSessionPage() {
    const { data: session, status } = useSession()
    const [refreshCount, setRefreshCount] = useState(0)

    const refreshSession = () => {
        setRefreshCount(prev => prev + 1)
        window.location.reload()
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Session Debug Page</h1>

            <div style={{ marginBottom: '2rem' }}>
                <h2>Session Status:</h2>
                <div style={{
                    padding: '1rem',
                    backgroundColor: status === 'authenticated' ? '#f0f9ff' : '#fef2f2',
                    border: `1px solid ${status === 'authenticated' ? '#0ea5e9' : '#ef4444'}`,
                    borderRadius: '4px'
                }}>
                    <p><strong>Status:</strong> {status}</p>
                    <p><strong>Authenticated:</strong> {status === 'authenticated' ? '✅ Ja' : '❌ Nein'}</p>
                    <p><strong>Loading:</strong> {status === 'loading' ? '✅ Ja' : '❌ Nein'}</p>
                    <p><strong>Unauthenticated:</strong> {status === 'unauthenticated' ? '✅ Ja' : '❌ Nein'}</p>
                </div>
            </div>

            {session && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2>Session Data:</h2>
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #0ea5e9',
                        borderRadius: '4px'
                    }}>
                        <pre style={{
                            backgroundColor: '#1f2937',
                            color: '#f9fafb',
                            padding: '1rem',
                            borderRadius: '4px',
                            overflow: 'auto'
                        }}>
                            {JSON.stringify(session, null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <h2>Actions:</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={refreshSession}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Refresh Session ({refreshCount})
                    </button>

                    <a
                        href="/dashboard"
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Go to Dashboard
                    </a>

                    <a
                        href="/login"
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Go to Login
                    </a>
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2>Debug Info:</h2>
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                }}>
                    <p><strong>User Agent:</strong> {navigator.userAgent}</p>
                    <p><strong>Cookies Enabled:</strong> {navigator.cookieEnabled ? '✅ Ja' : '❌ Nein'}</p>
                    <p><strong>Local Storage:</strong> {typeof window !== 'undefined' && window.localStorage ? '✅ Verfügbar' : '❌ Nicht verfügbar'}</p>
                    <p><strong>Session Storage:</strong> {typeof window !== 'undefined' && window.sessionStorage ? '✅ Verfügbar' : '❌ Nicht verfügbar'}</p>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3>Nächste Schritte:</h3>
                <ul>
                    <li>Wenn Status &quot;authenticated&quot; ist, sollten Sie zum Dashboard weitergeleitet werden</li>
                    <li>Wenn Status &quot;unauthenticated&quot; ist, gehen Sie zur Login-Seite</li>
                    <li>Wenn Status &quot;loading&quot; bleibt, gibt es ein Problem mit der Session-Initialisierung</li>
                </ul>
            </div>
        </div>
    )
}
