import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Session } from 'next-auth'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions) as Session | null

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Nicht autorisiert' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'Keine Datei gefunden' },
                { status: 400 }
            )
        }

        // Dateityp überprüfen
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Nur Bilddateien sind erlaubt' },
                { status: 400 }
            )
        }

        // Dateigröße überprüfen (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'Datei ist zu groß (max 5MB)' },
                { status: 400 }
            )
        }

        // Eindeutigen Dateinamen erstellen
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const inferredExt = file.type.startsWith('image/')
            ? (file.type.split('/')[1] || 'jpg')
            : 'bin'
        const originalExt = file.name.includes('.') ? file.name.split('.').pop() : undefined
        const fileExtension = (originalExt || inferredExt).toLowerCase()
        const fileName = `${session.user.id}/${timestamp}-${randomString}.${fileExtension}`

        if (!process.env.storage_READ_WRITE_TOKEN) {
            return NextResponse.json(
                { error: 'Storage-Token fehlt (storage_READ_WRITE_TOKEN)' },
                { status: 500 }
            )
        }

        let blob
        try {
            blob = await put(fileName, file, {
                access: 'public',
                token: process.env.storage_READ_WRITE_TOKEN,
                contentType: file.type || 'application/octet-stream'
            })
        } catch (e) {
            console.error('Blob upload failed:', e)
            return NextResponse.json(
                { error: 'Fehler beim Hochladen des Bildes', details: e instanceof Error ? e.message : String(e) },
                { status: 500 }
            )
        }

        return NextResponse.json({
            imageUrl: blob.url,
            fileName
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Ein Fehler ist aufgetreten' },
            { status: 500 }
        )
    }
}
