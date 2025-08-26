import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
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
