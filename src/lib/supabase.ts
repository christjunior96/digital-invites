import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin Client für Server-seitige Operationen (nur serverseitig verfügbar)
export const createServerSupabaseClient = () => {
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server-side operations')
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey)
}

// Nur für serverseitige Verwendung - NICHT im Client importieren!
export const getSupabaseAdmin = () => {
    if (typeof window !== 'undefined') {
        throw new Error('supabaseAdmin can only be used on the server side')
    }
    return createServerSupabaseClient()
}
