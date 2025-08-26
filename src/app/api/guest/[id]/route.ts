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

        const guest = await prisma.guest.update({
            where: { id },
            data: {
                isAttending,
                plusOne: plusOne || false,
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
