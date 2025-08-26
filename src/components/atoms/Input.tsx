'use client'

import React from 'react'

interface InputProps {
    label?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time'
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    disabled?: boolean
    error?: string
    className?: string
}

export function Input({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    error,
    className = ''
}: InputProps) {
    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label>
                    {label}
                    {required && <span style={{ color: 'red' }}> *</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={error ? 'error' : ''}
            />
            {error && <div className="alert alert--error">{error}</div>}
        </div>
    )
}
