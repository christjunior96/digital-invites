import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

// Optionen einer Frage listen/erstellen (nur sinnvoll für SINGLE/MULTI)

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string, questionId: string }> }
) {
    try {
        const { id, questionId } = await params
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
        }

        const invitation = await prisma.invitation.findFirst({ where: { id, userId: session.user.id } })
        if (!invitation) return NextResponse.json({ error: 'Einladung nicht gefunden' }, { status: 404 })

        const link = await prisma.invitationQuestion.findFirst({ where: { id: questionId, invitationId: id }, include: { question: true } })
        if (!link) return NextResponse.json({ error: 'Frage nicht gefunden' }, { status: 404 })

        const options = await prisma.questionOption.findMany({
            where: { questionId: link.questionId },
            orderBy: { position: 'asc' }
        })

        return NextResponse.json(options)
    } catch (error) {
        console.error('Fehler beim Laden der Optionen:', error)
        return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, questionId: string }> }
) {
    try {
        const { id, questionId } = await params
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
        }

        const invitation = await prisma.invitation.findFirst({ where: { id, userId: session.user.id } })
        if (!invitation) return NextResponse.json({ error: 'Einladung nicht gefunden' }, { status: 404 })

        const link = await prisma.invitationQuestion.findFirst({ where: { id: questionId, invitationId: id }, include: { question: true } })
        if (!link) return NextResponse.json({ error: 'Frage nicht gefunden' }, { status: 404 })

        const body = await request.json()
        const { label, position } = body as { label: string; position?: number }
        if (!label) return NextResponse.json({ error: 'label ist erforderlich' }, { status: 400 })

        const created = await prisma.questionOption.create({
            data: {
                questionId: link.questionId,
                label,
                position: typeof position === 'number' ? position : 0
            }
        })

        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        console.error('Fehler beim Erstellen der Option:', error)
        return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
    }
}


