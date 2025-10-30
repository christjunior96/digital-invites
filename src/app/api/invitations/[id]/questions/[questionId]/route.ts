import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

// Update/Deletion einer einzelnen InvitationQuestion (Position/Required) oder Question (Prompt/Type)

export async function PUT(
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
        if (!invitation) {
            return NextResponse.json({ error: 'Einladung nicht gefunden' }, { status: 404 })
        }

        const body = await request.json()
        const { prompt, type, required, position } = body as {
            prompt?: string
            type?: 'TEXT' | 'SINGLE' | 'MULTI'
            required?: boolean
            position?: number
        }

        // Sicherstellen, dass die Frage zur Einladung gehört
        const existing = await prisma.invitationQuestion.findFirst({
            where: { id: questionId, invitationId: id },
            include: { question: true }
        })
        if (!existing) {
            return NextResponse.json({ error: 'Frage nicht gefunden' }, { status: 404 })
        }

        const updated = await prisma.$transaction(async (tx) => {
            if (prompt !== undefined || type !== undefined) {
                await tx.question.update({
                    where: { id: existing.questionId },
                    data: {
                        ...(prompt !== undefined ? { prompt } : {}),
                        ...(type !== undefined ? { type } : {})
                    }
                })
            }

            const invQ = await tx.invitationQuestion.update({
                where: { id: questionId },
                data: {
                    ...(required !== undefined ? { required } : {}),
                    ...(position !== undefined ? { position } : {})
                },
                include: {
                    question: { include: { options: { orderBy: { position: 'asc' } } } }
                }
            })

            return invQ
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Frage:', error)
        return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
    }
}

export async function DELETE(
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
        if (!invitation) {
            return NextResponse.json({ error: 'Einladung nicht gefunden' }, { status: 404 })
        }

        // Sicherstellen, dass die Frage zur Einladung gehört
        const existing = await prisma.invitationQuestion.findFirst({ where: { id: questionId, invitationId: id }, include: { question: true } })
        if (!existing) {
            return NextResponse.json({ error: 'Frage nicht gefunden' }, { status: 404 })
        }

        await prisma.$transaction(async (tx) => {
            // Löscht automatisch abhängige Antworten dank onDelete: Cascade auf Relationen
            await tx.invitationQuestion.delete({ where: { id: questionId } })
            // Optional: wenn die Question nur dieser Einladung zugeordnet war, könnte man sie löschen.
            const otherLinks = await tx.invitationQuestion.count({ where: { questionId: existing.questionId } })
            if (otherLinks === 0) {
                await tx.question.delete({ where: { id: existing.questionId } })
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Fehler beim Löschen der Frage:', error)
        return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
    }
}


