import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Geschützte Routen
    const protectedRoutes = ['/dashboard', '/invites']
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute) {
        console.log('Middleware: Protected route accessed')
        // Die Authentifizierung wird client-seitig durch NextAuth gehandhabt
    }

    // Auth Routen (wenn bereits eingeloggt)
    const authRoutes = ['/login', '/register']
    const isAuthRoute = authRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (isAuthRoute) {
        console.log('Middleware: Auth route accessed')
        // Die Weiterleitung wird client-seitig durch NextAuth gehandhabt
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
