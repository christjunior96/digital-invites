'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { Card } from '@/components/atoms/Card'
import { Navigation } from '@/components/organisms/Navigation'

interface Invitation {
    id: string
    title: string
    date: string
    time: string
    address: string
    description?: string
    backgroundImage?: string
    backgroundColor?: string
    contactInfo?: string
}

export default function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [invitation, setInvitation] = useState<Invitation | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        address: '',
        description: '',
        backgroundColor: '#ffffff',
        contactInfo: ''
    })
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')
    const [currentImageUrl, setCurrentImageUrl] = useState<string>('')
    const [imageRemoved, setImageRemoved] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            fetchInvitation()
        }
    }, [status, router])

    const fetchInvitation = async () => {
        try {
            const { id } = await params
            const response = await fetch(`/api/invitations/${id}`)
            if (response.ok) {
                const data = await response.json()
                setInvitation(data)
                setFormData({
                    title: data.title,
                    date: data.date.split('T')[0], // Format für input type="date"
                    time: data.time,
                    address: data.address,
                    description: data.description || '',
                    backgroundColor: data.backgroundColor || '#ffffff',
                    contactInfo: data.contactInfo || ''
                })
                // Bild-States zurücksetzen
                setSelectedImage(null)
                setImagePreview('')
                setCurrentImageUrl('')
                setImageRemoved(false)

                // Bild setzen, falls vorhanden
                if (data.backgroundImage) {
                    setImagePreview(data.backgroundImage)
                    setCurrentImageUrl(data.backgroundImage)
                }
            } else {
                setError('Einladung nicht gefunden')
            }
        } catch (error) {
            console.error('Fehler beim Laden der Einladung:', error)
            setError('Ein Fehler ist aufgetreten')
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            setImageRemoved(false) // Reset imageRemoved wenn neues Bild ausgewählt wird
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setSelectedImage(null)
        setImagePreview('')
        setCurrentImageUrl('')
        setImageRemoved(true)
    }

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error('Fehler beim Hochladen des Bildes')
        }

        const data = await response.json()
        return data.imageUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError('')

        try {
            const { id } = await params
            let backgroundImageUrl: string | null = invitation?.backgroundImage || null

            // Bild hochladen, falls ein neues ausgewählt wurde
            if (selectedImage) {
                backgroundImageUrl = await uploadImage(selectedImage)
            } else if (imageRemoved) {
                // Bild wurde explizit entfernt
                backgroundImageUrl = null
            }

            const response = await fetch(`/api/invitations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    backgroundImage: backgroundImageUrl
                })
            })

            if (response.ok) {
                // Lade die Einladung neu, um die aktualisierten Daten zu erhalten
                await fetchInvitation()
                setSuccessMessage('Änderungen erfolgreich gespeichert!')
                setIsSaving(false)

                // Erfolgsmeldung nach 3 Sekunden ausblenden
                setTimeout(() => {
                    setSuccessMessage('')
                }, 3000)
            } else {
                const data = await response.json()
                setError(data.error || 'Fehler beim Speichern')
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error)
            setError('Ein Fehler ist aufgetreten')
            setIsSaving(false)
        }
    }

    if (status === 'loading' || isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #FF6B6B',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>Lade Einladung...</p>
                </div>
            </div>
        )
    }

    if (!session || !invitation) {
        return null
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            position: 'relative'
        }}>
            <Navigation />

            <div className="container" style={{
                paddingTop: '2rem',
                paddingBottom: '2rem',
                maxWidth: '800px'
            }}>
                <Card style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '25px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '1rem',
                            animation: 'bounce 2s ease-in-out infinite'
                        }}>
                            ✏️
                        </div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Einladung bearbeiten
                        </h1>
                        <p style={{
                            color: '#666',
                            fontSize: '1.1rem',
                            margin: '0.5rem 0 0 0'
                        }}>
                            Passe deine Einladung an und lade ein Hintergrundbild hoch! 🎨
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert--error" style={{
                            background: 'rgba(255, 107, 107, 0.1)',
                            border: '2px solid #FF6B6B',
                            borderRadius: '15px',
                            color: '#FF6B6B',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            textAlign: 'center',
                            animation: 'shake 0.5s ease-in-out'
                        }}>
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="alert alert--success" style={{
                            background: 'rgba(76, 205, 196, 0.1)',
                            border: '2px solid #4ECDC4',
                            borderRadius: '15px',
                            color: '#4ECDC4',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            textAlign: 'center',
                            animation: 'bounce 0.5s ease-in-out'
                        }}>
                            ✅ {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <Input
                                label="Titel der Einladung"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                                placeholder="z.B. Geburtstagsfeier von Max"
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input
                                    label="Datum"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    required
                                />
                                <Input
                                    label="Uhrzeit"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                    required
                                />
                            </div>

                            <Input
                                label="Adresse"
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                required
                                placeholder="Vollständige Adresse"
                            />

                            <Textarea
                                label="Beschreibung (optional)"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Details zur Veranstaltung, Dresscode, etc."
                            />

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#333'
                                }}>
                                    Hintergrundfarbe
                                </label>
                                <input
                                    type="color"
                                    value={formData.backgroundColor}
                                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        height: '50px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '10px',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#333'
                                }}>
                                    Hintergrundbild (optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px dashed #e5e7eb',
                                        borderRadius: '10px',
                                        background: '#f9fafb',
                                        cursor: 'pointer'
                                    }}
                                />
                                {imagePreview && (
                                    <div style={{
                                        marginTop: '1rem',
                                        textAlign: 'center'
                                    }}>
                                        <img
                                            src={imagePreview}
                                            alt="Vorschau"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                borderRadius: '10px',
                                                border: '2px solid #e5e7eb'
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleRemoveImage}
                                            style={{
                                                marginTop: '1rem',
                                                background: 'linear-gradient(135deg, #FF5252, #FF1744)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '10px',
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            🗑️ Bild entfernen
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Textarea
                                label="Kontaktinformationen (optional)"
                                value={formData.contactInfo}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                                placeholder="Telefonnummer, E-Mail oder andere Kontaktdaten für Rückfragen"
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            marginTop: '2rem',
                            justifyContent: 'center'
                        }}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/dashboard')}
                                style={{
                                    border: '2px solid #6b7280',
                                    color: '#6b7280',
                                    borderRadius: '15px',
                                    padding: '1rem 2rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                Abbrechen
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSaving}
                                style={{
                                    background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                                    border: 'none',
                                    borderRadius: '15px',
                                    padding: '1rem 2rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    cursor: isSaving ? 'not-allowed' : 'pointer',
                                    opacity: isSaving ? 0.7 : 1,
                                    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
                                }}
                            >
                                {isSaving ? (
                                    <span>
                                        <span style={{
                                            display: 'inline-block',
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid transparent',
                                            borderTop: '2px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                            marginRight: '0.5rem'
                                        }} />
                                        Speichern...
                                    </span>
                                ) : (
                                    '💾 Änderungen speichern'
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
