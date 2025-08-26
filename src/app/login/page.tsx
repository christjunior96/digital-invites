'use client'

import { useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/molecules/LoginForm'
import { Confetti } from '@/components/atoms/Confetti'

export default function LoginPage() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')

    return (
        <div className="login-page">
            <Confetti />

            {/* Party-Lichter */}
            <div className="login-lights" />

            <div className="login-container">
                {message && (
                    <div className="login-message">
                        {message}
                    </div>
                )}
                <LoginForm />
            </div>
        </div>
    )
}
