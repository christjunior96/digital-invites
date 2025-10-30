import { NextResponse } from 'next/server'

export async function GET() {
    const envVars = {
        // Client-seitig verfügbar
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,

        // Server-seitig verfügbar
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
        DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
        storage_READ_WRITE_TOKEN: process.env.storage_READ_WRITE_TOKEN ? '✅ Set' : '❌ Missing'
    }

    const missingVars = Object.entries(envVars)
        .filter(([, value]) => !value || value === '❌ Missing')
        .map(([key]) => key)

    return NextResponse.json({
        success: true,
        envVars,
        missingVars,
        allSet: missingVars.length === 0
    })
}
