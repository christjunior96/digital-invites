'use client'

import React from 'react'

interface TextareaProps {
    label?: string
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    required?: boolean
    disabled?: boolean
    error?: string
    rows?: number
    className?: string
    style?: React.CSSProperties
}

export function Textarea({
    label,
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    error,
    rows = 4,
    className = '',
    style
}: TextareaProps) {
    return (
        <div className={`form-group ${className}`} style={style}>
            {label && (
                <label>
                    {label}
                    {required && <span style={{ color: 'red' }}> *</span>}
                </label>
            )}
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                rows={rows}
                className={error ? 'error' : ''}
            />
            {error && <div className="alert alert--error">{error}</div>}
        </div>
    )
}
