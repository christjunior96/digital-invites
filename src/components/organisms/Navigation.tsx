'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/atoms/Button'

export function Navigation() {
    const { data: session } = useSession()

    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' })
    }

    if (!session) {
        return null
    }

    return (
        <nav className="navigation">
            <div className="container">
                <div className="navigation-container">
                    <div className="navigation-left">
                        <a href="/dashboard" className="navigation-title">
                            Digital Invites
                        </a>
                    </div>

                    <div className="navigation-right">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSignOut}
                        >
                            Abmelden
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
