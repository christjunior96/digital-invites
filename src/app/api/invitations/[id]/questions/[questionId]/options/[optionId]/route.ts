import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, questionId: string, optionId: string }> }
) {
    try {
        const { id, questionId, optionId } = await params
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

        const invitation = await prisma.invitation.findFirst({ where: { id, userId: session.user.id } })
        if (!invitation) return NextResponse.json({ error: 'Einladung nicht gefunden' }, { status: 404 })

        const link = await prisma.invitationQuestion.findFirst({ where: { id: questionId, invitationId: id } })
        if (!link) return NextResponse.json({ error: 'Frage nicht gefunden' }, { status: 404 })

        const body = await request.json()
        const { label, value, position } = body as { label?: string; value?: string; position?: number }

        const updated = await prisma.questionOption.update({
            where: { id: optionId },
            data: {
                ...(label !== undefined ? { label } : {}),
                ...(value !== undefined ? { value } : {}),
                ...(position !== undefined ? { position } : {})
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Option:', error)
        return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string, questionId: string, optionId: string }> }
) {
    try {
        const { id, questionId, optionId } = await params
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

        const invitation = await prisma.invitation.findFirst({ where: { id, userId: session.user.id } })
        if (!invitation) return NextResponse.json({ error: 'Einladung nicht gefunden' }, { status: 404 })

        const link = await prisma.invitationQuestion.findFirst({ where: { id: questionId, invitationId: id } })
        if (!link) return NextResponse.json({ error: 'Frage nicht gefunden' }, { status: 404 })

        await prisma.questionOption.delete({ where: { id: optionId } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Fehler beim Löschen der Option:', error)
        return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
    }
}



