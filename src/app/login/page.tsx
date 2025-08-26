'use client'

import { useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/molecules/LoginForm'

export default function LoginPage() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                {message && (
                    <div className="alert alert--success" style={{ marginBottom: '1rem' }}>
                        {message}
                    </div>
                )}
                <LoginForm />
            </div>
        </div>
    )
}
