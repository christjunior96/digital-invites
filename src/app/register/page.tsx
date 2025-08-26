'use client'

import { RegisterForm } from '@/components/molecules/RegisterForm'
import { Confetti } from '@/components/atoms/Confetti'

export default function RegisterPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 25%, #45B7D1 50%, #96CEB4 75%, #FFEAA7 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 8s ease infinite',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Confetti />

            {/* Party-Lichter */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
                    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 90% 90%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
                `,
                animation: 'lights 4s ease-in-out infinite alternate'
            }} />

            <div style={{
                width: '100%',
                maxWidth: '500px',
                position: 'relative',
                zIndex: 2
            }}>
                <RegisterForm />
            </div>

            <style jsx>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes lights {
                    0% { opacity: 0.3; }
                    100% { opacity: 0.8; }
                }
            `}</style>
        </div>
    )
}
