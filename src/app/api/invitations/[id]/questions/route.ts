import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

// Liste aller Fragen für eine Einladung + Erstellung einer neuen Frage

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
        }

        const invitation = await prisma.invitation.findFirst({
            where: { id, userId: session.user.id }
        })

        if (!invitation) {
            return NextResponse.json({ error: 'Einladung nicht gefunden' }, { status: 404 })
        }

        const questions = await prisma.invitationQuestion.findMany({
            where: { invitationId: id },
            include: {
                question: {
                    include: { options: { orderBy: { position: 'asc' } } }
                }
            },
            orderBy: { position: 'asc' }
        })

        return NextResponse.json(questions)
    } catch (error) {
        console.error('Fehler beim Laden der Fragen:', error)
        return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
        }

        const invitation = await prisma.invitation.findFirst({
            where: { id, userId: session.user.id }
        })

        if (!invitation) {
            return NextResponse.json({ error: 'Einladung nicht gefunden' }, { status: 404 })
        }

        const body = await request.json()
        const { prompt, type, required = false, options = [] } = body as {
            prompt: string
            type: 'TEXT' | 'SINGLE' | 'MULTI'
            required?: boolean
            options?: Array<{ label: string; position?: number }>
        }

        if (!prompt || !type) {
            return NextResponse.json({ error: 'prompt und type sind erforderlich' }, { status: 400 })
        }

        const created = await prisma.$transaction(async (tx) => {
            const question = await tx.question.create({
                data: { prompt, type }
            })

            if ((type === 'SINGLE' || type === 'MULTI') && options?.length) {
                await tx.questionOption.createMany({
                    data: options.map((o, idx) => ({
                        questionId: question.id,
                        label: o.label,
                        position: typeof o.position === 'number' ? o.position : idx
                    }))
                })
            }

            // Position automatisch ans Ende setzen (max(position) + 1)
            const last = await tx.invitationQuestion.findFirst({
                where: { invitationId: id },
                orderBy: { position: 'desc' }
            })
            const nextPos = (last?.position ?? -1) + 1

            const invitationQuestion = await tx.invitationQuestion.create({
                data: {
                    invitationId: id,
                    questionId: question.id,
                    required: !!required,
                    position: nextPos
                },
                include: {
                    question: { include: { options: { orderBy: { position: 'asc' } } } }
                }
            })

            return invitationQuestion
        })

        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        console.error('Fehler beim Erstellen der Frage:', error)
        return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
    }
}


