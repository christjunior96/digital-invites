import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Nicht autorisiert' },
                { status: 401 }
            )
        }

        const invitations = await prisma.invitation.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                guests: {
                    select: {
                        id: true,
                        name: true,
                        isAttending: true,
                        isCouple: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(invitations)
    } catch (error) {
        console.error('Fehler beim Laden der Einladungen:', error)
        return NextResponse.json(
            { error: 'Ein Fehler ist aufgetreten' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Nicht autorisiert' },
                { status: 401 }
            )
        }

        const {
            title,
            address,
            date,
            time,
            description,
            backgroundImage,
            backgroundColor,
            contactInfo
        } = await request.json()

        // Validierung
        if (!title || !address || !date || !time) {
            return NextResponse.json(
                { error: 'Alle Pflichtfelder müssen ausgefüllt werden' },
                { status: 400 }
            )
        }

        const invitation = await prisma.invitation.create({
            data: {
                title,
                address,
                date: new Date(date),
                time,
                description,
                backgroundImage,
                backgroundColor,
                contactInfo,
                userId: session.user.id
            }
        })

        return NextResponse.json(invitation, { status: 201 })
    } catch (error) {
        console.error('Fehler beim Erstellen der Einladung:', error)
        return NextResponse.json(
            { error: 'Ein Fehler ist aufgetreten' },
            { status: 500 }
        )
    }
}
