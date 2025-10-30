import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, contactInfo } = await request.json()

        // Validierung
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Alle Pflichtfelder müssen ausgefüllt werden' },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Passwort muss mindestens 8 Zeichen lang sein' },
                { status: 400 }
            )
        }

        // Existenz prüfen
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json(
                { error: 'Ein Benutzer mit dieser E-Mail existiert bereits' },
                { status: 400 }
            )
        }

        const passwordHash = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                name,
                contactInfo: contactInfo ?? null,
                passwordHash
            }
        })

        return NextResponse.json(
            { message: 'Benutzer erfolgreich erstellt' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registrierungsfehler:', error)
        return NextResponse.json(
            { error: 'Ein Fehler ist aufgetreten' },
            { status: 500 }
        )
    }
}
