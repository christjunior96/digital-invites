import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Nicht autorisiert' },
                { status: 401 }
            )
        }

        const body = await request.json()

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

        const guest = await prisma.guest.create({
            data: {
                name: body.name,
                email: body.email || null,
                phone: body.phone || null,
                isCouple: body.isCouple,
                invitationId: id,
            }
        })

        return NextResponse.json(guest)
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Gasts:', error)
        return NextResponse.json(
            { error: 'Ein Fehler ist aufgetreten' },
            { status: 500 }
        )
    }
}
