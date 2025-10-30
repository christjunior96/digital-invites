import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

function csvEscape(value: string | null | undefined): string {
  const str = value ?? ''
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

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

    const invQuestions = await prisma.invitationQuestion.findMany({
      where: { invitationId: id },
      include: { question: { include: { options: true } } },
      orderBy: { position: 'asc' }
    })

    const guests = await prisma.guest.findMany({
      where: { invitationId: id },
      orderBy: { createdAt: 'asc' }
    })

    const answers = await prisma.guestAnswer.findMany({
      where: { guestId: { in: guests.map(g => g.id) } },
      include: { selectedOptions: { include: { option: true } } }
    })

    const guestIdToAnswers = new Map<string, typeof answers>()
    for (const ans of answers) {
      const list = guestIdToAnswers.get(ans.guestId) ?? []
      list.push(ans)
      guestIdToAnswers.set(ans.guestId, list)
    }

    const headerBase = ['Name', 'Email', 'Status', 'Personen']
    const headerQuestions = invQuestions.flatMap((q) => [
      `Antwort:${q.question.prompt} (Person 1)`,
      `Antwort:${q.question.prompt} (Person 2)`
    ])
    const header = [...headerBase, ...headerQuestions]

    const rows: string[] = []
    rows.push(header.map(csvEscape).join(','))

    for (const g of guests) {
      const status = g.isAttending === true ? 'accepted' : g.isAttending === false ? 'declined' : 'pending'
      const people = g.isCouple ? 2 : (1 + ((g.plusOne ?? false) ? 1 : 0))
      const base = [g.name, g.email ?? '', status, String(people)]

      const list = guestIdToAnswers.get(g.id) || []
      const getVal = (iq: { id: string; question: { type: 'TEXT' | 'SINGLE' | 'MULTI' } }, personIndex: number) => {
        const ans = list.find(a => a.invitationQuestionId === iq.id && (a.personIndex ?? 1) === personIndex)
        if (!ans) return ''
        if (iq.question.type === 'TEXT') return ans.textAnswer ?? ''
        const labels = (ans.selectedOptions || []).map(o => o.option?.label ?? '').filter(Boolean)
        return labels.join('; ')
      }

      const hasSecond = g.isCouple || (g.plusOne ?? false)
      const perQuestion = invQuestions.flatMap((iq) => {
        const p1 = getVal(iq, 1)
        const p2 = hasSecond ? getVal(iq, 2) : ''
        return [p1, p2]
      })

      const row = [...base, ...perQuestion].map(csvEscape).join(',')
      rows.push(row)
    }

    const csv = rows.join('\n')
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="gaesteliste-${id}.csv"`
      }
    })
  } catch (error) {
    console.error('Fehler beim CSV-Export:', error)
    return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
  }
}


