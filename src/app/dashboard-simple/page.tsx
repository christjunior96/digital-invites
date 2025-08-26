'use client'

import { useSession } from 'next-auth/react'

export default function DashboardSimplePage() {
    const { data: session, status } = useSession()

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Dashboard Simple Test</h1>
            
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
                    <h2>Willkommen, {session.user?.name || session.user?.email}!</h2>
                    <p>Sie sind erfolgreich angemeldet.</p>
                </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <h2>Navigation:</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a
                        href="/dashboard"
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#0070f3',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Vollständiges Dashboard
                    </a>
                    
                    <a
                        href="/debug-session"
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Session Debug
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
                        Login
                    </a>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3>Debug Info:</h3>
                <p>Diese Seite testet, ob das Dashboard grundsätzlich funktioniert.</p>
                <p>Wenn Sie diese Seite sehen können, ist das Middleware-Problem behoben.</p>
            </div>
        </div>
    )
}
