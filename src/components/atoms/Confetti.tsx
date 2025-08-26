'use client'

import { useEffect, useState, useMemo } from 'react'

interface ConfettiPiece {
    id: number
    x: number
    y: number
    rotation: number
    rotationSpeed: number
    fallSpeed: number
    color: string
    size: number
}

export function Confetti() {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

    const colors = useMemo(() => [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
        '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ], [])

    useEffect(() => {
        // Initiale Konfetti-Stücke erstellen
        const initialConfetti: ConfettiPiece[] = Array.from({ length: 150 }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: -Math.random() * window.innerHeight,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            fallSpeed: 1 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 4 + Math.random() * 8
        }))

        setConfetti(initialConfetti)

        // Animation Loop
        const animate = () => {
            setConfetti(prev => prev.map(piece => {
                let newY = piece.y + piece.fallSpeed
                let newX = piece.x + (Math.random() - 0.5) * 0.5
                const newRotation = piece.rotation + piece.rotationSpeed

                // Wenn Konfetti unten ist, setze es oben neu
                if (newY > window.innerHeight) {
                    newY = -piece.size
                    newX = Math.random() * window.innerWidth
                }

                // Wenn Konfetti seitlich raus ist, setze es neu
                if (newX < -piece.size) {
                    newX = window.innerWidth + piece.size
                } else if (newX > window.innerWidth + piece.size) {
                    newX = -piece.size
                }

                return {
                    ...piece,
                    x: newX,
                    y: newY,
                    rotation: newRotation
                }
            }))
        }

        const interval = setInterval(animate, 50)

        return () => clearInterval(interval)
    }, [])

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1
        }}>
            {confetti.map(piece => (
                <div
                    key={piece.id}
                    style={{
                        position: 'absolute',
                        left: piece.x,
                        top: piece.y,
                        width: piece.size,
                        height: piece.size,
                        backgroundColor: piece.color,
                        borderRadius: '50%',
                        transform: `rotate(${piece.rotation}deg)`,
                        opacity: 0.8,
                        boxShadow: `0 0 ${piece.size / 2}px ${piece.color}`
                    }}
                />
            ))}
        </div>
    )
}
