'use client'

import { RegisterForm } from '@/components/molecules/RegisterForm'

export default function RegisterPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
                <RegisterForm />
            </div>
        </div>
    )
}
