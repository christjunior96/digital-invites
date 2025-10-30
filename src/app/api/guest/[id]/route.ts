import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const guest = await prisma.guest.findUnique({
            where: { id },
            include: {
                invitation: true
            }
        })

        if (!guest) {
            return NextResponse.json(
                { error: 'Gast nicht gefunden' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            guest: {
                id: guest.id,
                name: guest.name,
                email: guest.email,
                phone: guest.phone,
                isCouple: guest.isCouple,
                plusOne: guest.plusOne,
                plusOneAllowed: guest.plusOneAllowed,
                isAttending: guest.isAttending,
                notes: guest.notes
            },
            invitation: {
                id: guest.invitation.id,
                title: guest.invitation.title,
                date: guest.invitation.date,
                time: guest.invitation.time,
                address: guest.invitation.address,
                description: guest.invitation.description,
                backgroundImage: guest.invitation.backgroundImage,
                contactInfo: guest.invitation.contactInfo,
                spotifyPlaylist: guest.invitation.spotifyPlaylist,
                photoUploadLink: guest.invitation.photoUploadLink
            }
        })
    } catch (error) {
        console.error('Fehler beim Laden der Gastdaten:', error)
        return NextResponse.json(
            { error: 'Ein Fehler ist aufgetreten' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { isAttending, plusOne, notes } = await request.json()

        if (isAttending === null) {
            return NextResponse.json(
                { error: 'Bitte wählen Sie aus, ob Sie kommen möchten' },
                { status: 400 }
            )
        }

        // Lade aktuellen Gast zur Validierung
        const existing = await prisma.guest.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json({ error: 'Gast nicht gefunden' }, { status: 404 })
        }

        // Regel: Paare haben keine +1
        let sanitizedPlusOne = false
        if (!existing.isCouple) {
            // Einzelpersonen dürfen nur +1, wenn explizit erlaubt
            sanitizedPlusOne = plusOne === true && existing.plusOneAllowed === true
        }

        const guest = await prisma.guest.update({
            where: { id },
            data: {
                isAttending,
                plusOne: sanitizedPlusOne,
                notes
            }
        })

        return NextResponse.json({
            message: 'Antwort erfolgreich gespeichert',
            guest: {
                id: guest.id,
                name: guest.name,
                isAttending: guest.isAttending,
                plusOne: guest.plusOne,
                notes: guest.notes
            }
        })
    } catch (error) {
        console.error('Fehler beim Speichern der Antwort:', error)
        return NextResponse.json(
            { error: 'Ein Fehler ist aufgetreten' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { plusOneAllowed } = await request.json()

        const existing = await prisma.guest.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json({ error: 'Gast nicht gefunden' }, { status: 404 })
        }

        const updated = await prisma.guest.update({
            where: { id },
            data: {
                // Nur für Einzelpersonen relevant; bei Paaren bleibt null
                plusOneAllowed: existing.isCouple ? null : (typeof plusOneAllowed === 'boolean' ? plusOneAllowed : null),
                // Wenn Erlaubnis entzogen wird, plusOne zurücksetzen
                ...(existing.isCouple || plusOneAllowed !== true ? { plusOne: false } : {})
            }
        })

        return NextResponse.json({
            message: 'plusOneAllowed aktualisiert',
            guest: {
                id: updated.id,
                isCouple: updated.isCouple,
                plusOneAllowed: updated.plusOneAllowed,
                plusOne: updated.plusOne
            }
        })
    } catch (error) {
        console.error('Fehler beim Aktualisieren von plusOneAllowed:', error)
        return NextResponse.json(
            { error: 'Ein Fehler ist aufgetreten' },
            { status: 500 }
        )
    }
}
