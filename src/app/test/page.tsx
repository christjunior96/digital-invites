'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
    const [status, setStatus] = useState('')
    const [error, setError] = useState('')

    const testSupabaseConnection = async () => {
        try {
            setStatus('Testing Supabase connection...')
            setError('')

            // Test 1: Supabase URL
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            console.log('Supabase URL:', url)

            if (!url) {
                setError('❌ NEXT_PUBLIC_SUPABASE_URL ist nicht gesetzt')
                return
            }

            // Test 2: Supabase Client - Test mit Auth-Service
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                setError(`❌ Supabase Verbindung fehlgeschlagen: ${error.message}`)
                console.error('Supabase connection failed:', error)
            } else {
                setStatus('✅ Supabase Verbindung erfolgreich! (Auth-Service erreichbar)')
                console.log('Supabase connection test successful:', data)
            }
        } catch (err) {
            setError(`❌ Verbindung fehlgeschlagen: ${err}`)
            console.error('Connection test failed:', err)
        }
    }

    const testAuth = async () => {
        try {
            setStatus('Testing Supabase Auth...')
            setError('')

            const { data, error } = await supabase.auth.getSession()

            if (error) {
                setError(`❌ Auth error: ${error.message}`)
                console.error('Auth error:', error)
            } else {
                setStatus('✅ Supabase Auth funktioniert!')
                console.log('Auth test successful:', data)
            }
        } catch (err) {
            setError(`❌ Auth test fehlgeschlagen: ${err}`)
            console.error('Auth test failed:', err)
        }
    }

    const testDatabaseConnection = async () => {
        try {
            setStatus('Testing database connection...')
            setError('')

            // Test mit einer einfachen Abfrage, die in Supabase verfügbar ist
            const { data, error } = await supabase
                .from('pg_catalog.pg_tables')
                .select('tablename')
                .eq('schemaname', 'public')
                .limit(5)

            if (error) {
                // Wenn pg_catalog nicht funktioniert, versuchen wir eine andere Methode
                console.log('pg_catalog test failed, trying alternative:', error.message)

                // Alternative: Test mit einer einfachen Abfrage auf eine existierende Tabelle
                // Versuchen wir zuerst, ob die Invitation-Tabelle existiert
                const { error: invitationError } = await supabase
                    .from('Invitation')
                    .select('id')
                    .limit(1)

                if (invitationError) {
                    console.log('Invitation table test failed:', invitationError.message)

                    // Versuchen wir andere mögliche Tabellennamen
                    const { error: guestError } = await supabase
                        .from('Guest')
                        .select('id')
                        .limit(1)

                    if (guestError) {
                        console.log('Guest table test failed:', guestError.message)

                        // Letzter Test: Versuchen wir eine einfache SQL-Abfrage
                        const { error: sqlError } = await supabase
                            .rpc('sql', { query: 'SELECT current_timestamp' })

                        if (sqlError) {
                            console.log('SQL RPC test failed:', sqlError.message)

                            // Versuchen wir eine einfache Abfrage ohne spezifische Tabelle
                            const { error: simpleError } = await supabase
                                .from('_prisma_migrations')
                                .select('*')
                                .limit(1)

                            if (simpleError) {
                                setError(`❌ Datenbank-Verbindung fehlgeschlagen: Keine Tabellen oder Funktionen verfügbar`)
                                console.error('Database connection failed - no accessible tables or functions')
                            } else {
                                setStatus('✅ Datenbank-Verbindung erfolgreich! (Prisma-Migrationen-Tabelle erreichbar)')
                                console.log('Database connection test successful via _prisma_migrations table')
                            }
                        } else {
                            setStatus('✅ Datenbank-Verbindung erfolgreich! (SQL-RPC funktioniert)')
                            console.log('Database connection test successful via SQL-RPC')
                        }
                    } else {
                        setStatus('✅ Datenbank-Verbindung erfolgreich! (Guest-Tabelle erreichbar)')
                        console.log('Database connection test successful via Guest table')
                    }
                } else {
                    setStatus('✅ Datenbank-Verbindung erfolgreich! (Invitation-Tabelle erreichbar)')
                    console.log('Database connection test successful via Invitation table')
                }
            } else {
                setStatus(`✅ Datenbank-Verbindung erfolgreich! (${data?.length || 0} Tabellen gefunden)`)
                console.log('Database connection test successful:', data)
            }
        } catch (err) {
            setError(`❌ Datenbank-Test fehlgeschlagen: ${err}`)
            console.error('Database test failed:', err)
        }
    }

    const testPrismaConnection = async () => {
        try {
            setStatus('Testing Prisma connection...')
            setError('')

            // Test der Prisma-Verbindung über API
            const response = await fetch('/api/test-prisma')
            const result = await response.json()

            if (result.success) {
                setStatus('✅ Prisma-Verbindung erfolgreich!')
                console.log('Prisma connection test successful:', result)
            } else {
                setError(`❌ Prisma-Verbindung fehlgeschlagen: ${result.error}`)
                console.error('Prisma connection failed:', result.error)
            }
        } catch (err) {
            setError(`❌ Prisma-Test fehlgeschlagen: ${err}`)
            console.error('Prisma test failed:', err)
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Supabase Test Page</h1>

            <div style={{ marginBottom: '2rem' }}>
                <h3>Environment Variables:</h3>
                <p><strong>SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
                <p><strong>SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={testSupabaseConnection}
                    style={{
                        padding: '0.5rem 1rem',
                        marginRight: '1rem',
                        marginBottom: '0.5rem',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Test Supabase Connection
                </button>

                <button
                    onClick={testAuth}
                    style={{
                        padding: '0.5rem 1rem',
                        marginRight: '1rem',
                        marginBottom: '0.5rem',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Test Auth
                </button>

                <button
                    onClick={testDatabaseConnection}
                    style={{
                        padding: '0.5rem 1rem',
                        marginRight: '1rem',
                        marginBottom: '0.5rem',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Test Database
                </button>

                <button
                    onClick={testPrismaConnection}
                    style={{
                        padding: '0.5rem 1rem',
                        marginBottom: '0.5rem',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Test Prisma
                </button>
            </div>

            {status && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #0ea5e9',
                    borderRadius: '4px',
                    marginBottom: '1rem'
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
                <h3>Debug Info:</h3>
                <p>Öffnen Sie die Browser-Konsole (F12) um detaillierte Logs zu sehen.</p>
                <p><strong>Test Supabase Connection:</strong> Testet die grundlegende Verbindung zu Supabase.</p>
                <p><strong>Test Auth:</strong> Testet die Authentifizierung.</p>
                <p><strong>Test Database:</strong> Testet die Datenbank-Verbindung.</p>
                <p><strong>Test Prisma:</strong> Testet die Prisma-ORM-Verbindung.</p>
            </div>
        </div>
    )
}
