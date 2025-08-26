import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { Session } from 'next-auth'

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
        const fileExtension = file.name.split('.').pop()
        const fileName = `${session.user.id}/${timestamp}-${randomString}.${fileExtension}`

        // Admin-Client für Server-seitige Operationen verwenden
        const supabaseAdmin = getSupabaseAdmin()

        // Bucket erstellen, falls er nicht existiert
        const { data: buckets } = await supabaseAdmin.storage.listBuckets()
        const bucketExists = buckets?.some(bucket => bucket.name === 'invitation-images')

        if (!bucketExists) {
            const { error: createError } = await supabaseAdmin.storage.createBucket('invitation-images', {
                public: true,
                allowedMimeTypes: ['image/*'],
                fileSizeLimit: 5242880 // 5MB
            })

            if (createError) {
                console.error('Bucket creation error:', createError)
                return NextResponse.json(
                    { error: 'Fehler beim Erstellen des Storage-Buckets' },
                    { status: 500 }
                )
            }
        }

        // Datei zu Supabase Storage hochladen
        const { error } = await supabaseAdmin.storage
            .from('invitation-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Supabase upload error:', error)
            return NextResponse.json(
                { error: 'Fehler beim Hochladen des Bildes' },
                { status: 500 }
            )
        }

        // Öffentliche URL generieren
        const { data: urlData } = supabaseAdmin.storage
            .from('invitation-images')
            .getPublicUrl(fileName)

        return NextResponse.json({
            imageUrl: urlData.publicUrl,
            fileName: fileName
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Ein Fehler ist aufgetreten' },
            { status: 500 }
        )
    }
}
