import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type IncomingAnswer = {
    invitationQuestionId: string
    textAnswer?: string | null
    optionIds?: string[]
    personIndex?: number
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const guest = await prisma.guest.findUnique({
            where: { id },
            include: {
                invitation: true,
                // Antworten inkl. Auswahloptionen
                // und den verknüpften Fragen/Optionen für das Formular
            }
        })

        if (!guest) return NextResponse.json({ error: 'Gast nicht gefunden' }, { status: 404 })

        const invitationQuestions = await prisma.invitationQuestion.findMany({
            where: { invitationId: guest.invitationId },
            include: {
                question: { include: { options: { orderBy: { position: 'asc' } } } }
            },
            orderBy: { position: 'asc' }
        })

        const answers = await prisma.guestAnswer.findMany({
            where: { guestId: id },
            include: { selectedOptions: true }
        })

        return NextResponse.json({ invitationQuestions, answers })
    } catch (error) {
        console.error('Fehler beim Laden der Antworten:', error)
        return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = (await request.json()) as { answers: IncomingAnswer[] }
        const { answers } = body

        const guest = await prisma.guest.findUnique({ where: { id } })
        if (!guest) return NextResponse.json({ error: 'Gast nicht gefunden' }, { status: 404 })

        if (!Array.isArray(answers)) {
            return NextResponse.json({ error: 'answers muss ein Array sein' }, { status: 400 })
        }

        await prisma.$transaction(async (tx) => {
            for (const a of answers) {
                // Validierung: Frage gehört zur Einladung des Gastes
                const invQ = await tx.invitationQuestion.findFirst({
                    where: { id: a.invitationQuestionId, invitationId: guest.invitationId },
                    include: { question: true }
                })
                if (!invQ) {
                    throw new Error('Ungültige Frage für diesen Gast')
                }

                const pIndex = a.personIndex === 2 ? 2 : 1

                // Existierende Antwort löschen, um Neuaufbau zu vereinfachen
                const existing = await tx.guestAnswer.findFirst({
                    where: { guestId: guest.id, invitationQuestionId: invQ.id, personIndex: pIndex },
                    include: { selectedOptions: true }
                })
                if (existing) {
                    await tx.guestAnswerOption.deleteMany({ where: { guestAnswerId: existing.id } })
                    await tx.guestAnswer.delete({ where: { id: existing.id } })
                }

                const created = await tx.guestAnswer.create({
                    data: {
                        guestId: guest.id,
                        invitationQuestionId: invQ.id,
                        textAnswer: a.textAnswer ?? null,
                        personIndex: pIndex
                    }
                })

                if ((invQ.question.type === 'SINGLE' || invQ.question.type === 'MULTI') && Array.isArray(a.optionIds) && a.optionIds.length > 0) {
                    await tx.guestAnswerOption.createMany({
                        data: a.optionIds.map((oid) => ({ guestAnswerId: created.id, optionId: oid }))
                    })
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Fehler beim Speichern der Antworten:', error)
        return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
    }
}


