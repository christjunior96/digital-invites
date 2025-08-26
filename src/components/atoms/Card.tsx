'use client'

import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    padding?: 'sm' | 'md' | 'lg'
}

export function Card({
    children,
    className = '',
    padding = 'md'
}: CardProps) {
    const paddingClasses = {
        sm: 'p-3',
        md: 'p-6',
        lg: 'p-8'
    }

    const classes = `card ${paddingClasses[padding]} ${className}`

    return (
        <div className={classes}>
            {children}
        </div>
    )
}
