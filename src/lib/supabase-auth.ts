import { supabase } from './supabase'

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email
    }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}
