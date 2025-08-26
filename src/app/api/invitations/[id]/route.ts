import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Nicht autorisiert' },
                { status: 401 }
            )
        }

        const invitation = await prisma.invitation.findFirst({
            where: {
                id: id,
                userId: session.user.id
            },
            include: {
                guests: true
            }
        })

        if (!invitation) {
            return NextResponse.json(
                { error: 'Einladung nicht gefunden' },
                { status: 404 }
            )
        }

        return NextResponse.json(invitation)
    } catch (error) {
        console.error('Fehler beim Laden der Einladung:', error)
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
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Nicht autorisiert' },
                { status: 401 }
            )
        }

        // Prüfen, ob die Einladung dem Benutzer gehört
        const existingInvitation = await prisma.invitation.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (!existingInvitation) {
            return NextResponse.json(
                { error: 'Einladung nicht gefunden' },
                { status: 404 }
            )
        }

        const {
            title,
            date,
            time,
            address,
            description,
            backgroundImage,
            backgroundColor,
            contactInfo,
            spotifyPlaylist,
            photoUploadLink
        } = await request.json()

        // Validierung
        if (!title || !date || !time || !address) {
            return NextResponse.json(
                { error: 'Alle Pflichtfelder müssen ausgefüllt werden' },
                { status: 400 }
            )
        }

        // Behandle backgroundImage korrekt - setze null wenn undefined
        const updateData = {
            title,
            date: new Date(date),
            time,
            address,
            description,
            backgroundColor,
            contactInfo,
            backgroundImage: backgroundImage === undefined || backgroundImage === null ? null : backgroundImage,
            spotifyPlaylist: spotifyPlaylist === undefined || spotifyPlaylist === null ? null : spotifyPlaylist,
            photoUploadLink: photoUploadLink === undefined || photoUploadLink === null ? null : photoUploadLink
        }

        const updatedInvitation = await prisma.invitation.update({
            where: {
                id: id
            },
            data: updateData
        })

        return NextResponse.json(updatedInvitation)
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Einladung:', error)
        return NextResponse.json(
            { error: 'Ein Fehler ist aufgetreten' },
            { status: 500 }
        )
    }
}
