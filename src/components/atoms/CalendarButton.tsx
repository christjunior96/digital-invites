'use client'

import { useState } from 'react'

interface CalendarButtonProps {
    title: string
    date: string
    time: string
    address: string
    description?: string
}

export function CalendarButton({ title, date, time, address, description }: CalendarButtonProps) {
    const [showCalendarOptions, setShowCalendarOptions] = useState(false)

    const formatDateForCalendar = (dateString: string, timeString: string) => {
        const date = new Date(dateString)
        const [hours, minutes] = timeString.split(':').map(Number)
        date.setHours(hours, minutes, 0, 0)

        // Endzeit: 2 Stunden später
        const endDate = new Date(date)
        endDate.setHours(endDate.getHours() + 2)

        return {
            start: date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
            end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
        }
    }

    const createGoogleCalendarUrl = () => {
        const { start, end } = formatDateForCalendar(date, time)
        const eventDetails = `${title}\n\n${description || ''}\n\nAdresse: ${address}`

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(address)}`
    }

    const createOutlookCalendarUrl = () => {
        const { start, end } = formatDateForCalendar(date, time)
        const eventDetails = `${title}\n\n${description || ''}\n\nAdresse: ${address}`

        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${start}&enddt=${end}&body=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(address)}`
    }

    const createAppleCalendarUrl = () => {
        const { start, end } = formatDateForCalendar(date, time)
        const eventDetails = `${title}\n\n${description || ''}\n\nAdresse: ${address}`

        return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${document.URL}
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${eventDetails}
LOCATION:${address}
END:VEVENT
END:VCALENDAR`
    }

    const downloadICSFile = () => {
        const { start, end } = formatDateForCalendar(date, time)
        const eventDetails = `${title}\n\n${description || ''}\n\nAdresse: ${address}`

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${document.URL}
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${eventDetails}
LOCATION:${address}
END:VEVENT
END:VCALENDAR`

        const blob = new Blob([icsContent], { type: 'text/calendar' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="calendar-button-container">
            <button
                className="calendar-button-main"
                onClick={() => setShowCalendarOptions(!showCalendarOptions)}
            >
                📅 Termin in Kalender eintragen
            </button>

            {showCalendarOptions && (
                <div className="calendar-options">
                    <button
                        className="calendar-option-button calendar-google"
                        onClick={() => window.open(createGoogleCalendarUrl(), '_blank')}
                    >
                        <span>📱</span>
                        Google Kalender
                    </button>

                    <button
                        className="calendar-option-button calendar-outlook"
                        onClick={() => window.open(createOutlookCalendarUrl(), '_blank')}
                    >
                        <span>💻</span>
                        Outlook
                    </button>

                    <button
                        className="calendar-option-button calendar-apple"
                        onClick={() => window.open(createAppleCalendarUrl(), '_blank')}
                    >
                        <span>🍎</span>
                        Apple Kalender
                    </button>

                    <button
                        className="calendar-option-button calendar-download"
                        onClick={downloadICSFile}
                    >
                        <span>📥</span>
                        ICS-Datei herunterladen
                    </button>
                </div>
            )}
        </div>
    )
}
