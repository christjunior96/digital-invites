import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    // NextAuth JWT Token prüfen
    const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
    })

    // Geschützte Routen
    const protectedRoutes = ['/dashboard', '/invites']
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute && !token) {
        console.log('Middleware: Redirecting to login - no token found')
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Auth Routen (wenn bereits eingeloggt)
    const authRoutes = ['/login', '/register']
    const isAuthRoute = authRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (isAuthRoute && token) {
        console.log('Middleware: Redirecting to dashboard - user already authenticated')
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
