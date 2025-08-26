import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; guestId: string }> }
) {
    try {
        const { id, guestId } = await params
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Nicht autorisiert' },
                { status: 401 }
            )
        }

        // Prüfen, ob die Einladung dem Benutzer gehört
        const invitation = await prisma.invitation.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (!invitation) {
            return NextResponse.json(
                { error: 'Einladung nicht gefunden' },
                { status: 404 }
            )
        }

        // Gast löschen
        await prisma.guest.delete({
            where: {
                id: guestId,
                invitationId: id
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Fehler beim Löschen des Gasts:', error)
        return NextResponse.json(
            { error: 'Ein Fehler ist aufgetreten' },
            { status: 500 }
        )
    }
}
