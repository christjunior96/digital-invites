'use client'

import { useEffect, useRef } from 'react'
import JSConfetti from 'js-confetti'

interface CelebrationConfettiProps {
    trigger: boolean
    isAttending: boolean
}

export function CelebrationConfetti({ trigger, isAttending }: CelebrationConfettiProps) {
    const jsConfettiRef = useRef<JSConfetti | null>(null)

    useEffect(() => {
        // Initialisiere JSConfetti nur einmal
        if (!jsConfettiRef.current) {
            jsConfettiRef.current = new JSConfetti()
        }
    }, [])

    useEffect(() => {
        if (trigger && jsConfettiRef.current) {
            if (isAttending) {
                // Starte die Konfetti-Animation mit Party-Emojis für Zusagen
                jsConfettiRef.current.addConfetti({
                    emojis: ['🎉', '🎊', '✨', '🎈', '🎁', '🎂', '🍾', '🥂', '🎪', '🎭'],
                    emojiSize: 50,
                    confettiNumber: 100,
                    confettiRadius: 6,
                    confettiColors: [
                        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
                        '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
                    ]
                })

                // Zusätzliche Konfetti-Welle nach 1 Sekunde
                setTimeout(() => {
                    if (jsConfettiRef.current) {
                        jsConfettiRef.current.addConfetti({
                            emojis: ['🎉', '🎊', '✨'],
                            emojiSize: 40,
                            confettiNumber: 50
                        })
                    }
                }, 1000)

                // Dritte Konfetti-Welle nach 2 Sekunden
                setTimeout(() => {
                    if (jsConfettiRef.current) {
                        jsConfettiRef.current.addConfetti({
                            confettiColors: [
                                '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'
                            ],
                            confettiNumber: 75,
                            confettiRadius: 8
                        })
                    }
                }, 2000)
            } else {
                // Starte die Konfetti-Animation mit traurigen Emojis für Absagen
                jsConfettiRef.current.addConfetti({
                    emojis: ['😢', '😭', '💔', '😔', '😞', '🥺', '😿', '💧', '🌧️', '☔'],
                    emojiSize: 45,
                    confettiNumber: 80,
                    confettiRadius: 5,
                    confettiColors: [
                        '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6',
                        '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'
                    ]
                })

                // Zusätzliche traurige Emoji-Welle nach 1 Sekunde
                setTimeout(() => {
                    if (jsConfettiRef.current) {
                        jsConfettiRef.current.addConfetti({
                            emojis: ['😢', '💔', '😔'],
                            emojiSize: 35,
                            confettiNumber: 40
                        })
                    }
                }, 1000)

                // Dritte Welle mit grauen Konfetti nach 2 Sekunden
                setTimeout(() => {
                    if (jsConfettiRef.current) {
                        jsConfettiRef.current.addConfetti({
                            confettiColors: [
                                '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6'
                            ],
                            confettiNumber: 60,
                            confettiRadius: 6
                        })
                    }
                }, 2000)
            }
        }
    }, [trigger])

    // Cleanup beim Unmount
    useEffect(() => {
        return () => {
            if (jsConfettiRef.current) {
                jsConfettiRef.current.clearCanvas()
            }
        }
    }, [])

    return null // Diese Komponente rendert nichts, sie startet nur die Animation
}
