import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from './supabase'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log('Missing credentials')
                    return null
                }

                try {
                    console.log('Attempting Supabase auth for:', credentials.email)

                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: credentials.email,
                        password: credentials.password
                    })

                    if (error) {
                        console.error('Supabase auth error:', error.message)
                        return null
                    }

                    if (!data.user) {
                        console.log('No user returned from Supabase')
                        return null
                    }

                    console.log('Auth successful for user:', data.user.email)

                    return {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.user_metadata?.name || data.user.email
                    }
                } catch (error) {
                    console.error('Unexpected auth error:', error)
                    return null
                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
            }
            return session
        }
    },
    debug: process.env.NODE_ENV === 'development'
}
