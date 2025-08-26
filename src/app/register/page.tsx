'use client'

import { RegisterForm } from '@/components/molecules/RegisterForm'
import { Confetti } from '@/components/atoms/Confetti'

export default function RegisterPage() {
    return (
        <div className="register-page">
            <Confetti />

            {/* Party-Lichter */}
            <div className="register-lights" />

            <div className="register-container">
                <RegisterForm />
            </div>
        </div>
    )
}
