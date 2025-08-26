import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Test der Prisma-Verbindung
        await prisma.$connect()

        // Versuchen, eine einfache Abfrage auszuführen
        const result = await prisma.$queryRaw`SELECT 1 as test`

        await prisma.$disconnect()

        return NextResponse.json({
            success: true,
            message: 'Prisma-Verbindung erfolgreich',
            result
        })
    } catch (error) {
        console.error('Prisma connection test failed:', error)

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        }, { status: 500 })
    }
}
