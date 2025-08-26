import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

        // Benutzer mit Supabase Auth erstellen
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    contact_info: contactInfo
                }
            }
        })

        if (error) {
            if (error.message.includes('already registered')) {
                return NextResponse.json(
                    { error: 'Ein Benutzer mit dieser E-Mail existiert bereits' },
                    { status: 400 }
                )
            }
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { message: 'Benutzer erfolgreich erstellt. Bitte bestätigen Sie Ihre E-Mail.' },
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
