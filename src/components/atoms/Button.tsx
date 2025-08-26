'use client'

import React from 'react'

interface ButtonProps {
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    type?: 'button' | 'submit' | 'reset'
    className?: string
    style?: React.CSSProperties
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    type = 'button',
    className = '',
    style
}: ButtonProps) {
    const baseClasses = 'btn'
    const variantClasses = {
        primary: 'btn--primary',
        secondary: 'btn--secondary',
        outline: 'btn--outline',
        danger: 'btn--danger'
    }
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    }

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled}
            onClick={onClick}
            style={style}
        >
            {children}
        </button>
    )
}
