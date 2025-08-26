'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                console.log('User signed in:', session?.user)
            } else if (event === 'SIGNED_OUT') {
                console.log('User signed out')
            }
            setIsLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (isLoading) {
        return <div>Laden...</div>
    }

    return <>{children}</>
}
