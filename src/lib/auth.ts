import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const authOptions = {
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
                    const user = await prisma.user.findUnique({ where: { email: credentials.email } })
                    if (!user) {
                        return null
                    }

                    const valid = await bcrypt.compare(credentials.password, user.passwordHash)
                    if (!valid) {
                        return null
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name ?? user.email
                    }
                } catch (error) {
                    console.error('Unexpected auth error:', error)
                    return null
                }
            }
        })
    ],
    session: {
        strategy: 'jwt' as const
    },
    pages: {
        signIn: '/login'
    },
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id as string
            }
            return session
        }
    },
    debug: process.env.NODE_ENV === 'development'
}
