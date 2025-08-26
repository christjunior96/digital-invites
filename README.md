# Digital Invites

Eine Next.js Anwendung für digitale Einladungen mit Gastverwaltung und RSVP-System.

## Features

- **Benutzerauthentifizierung**: Registrierung und Login mit Supabase Auth
- **Einladungsverwaltung**: Erstellen und verwalten von Einladungen
- **Gastverwaltung**: Hinzufügen und verwalten von Gästen
- **RSVP-System**: Gäste können online auf Einladungen antworten
- **Anpassbare Designs**: Hintergrundfarben und -bilder für Einladungen
- **Responsive Design**: Funktioniert auf Desktop und Mobile

## Technologie-Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: SCSS (kein Tailwind)
- **Authentifizierung**: Supabase Auth mit NextAuth.js
- **Datenbank**: Prisma mit PostgreSQL (Supabase)
- **Storage**: Supabase für Datei-Uploads
- **Architektur**: Atomic Design (Atome, Moleküle, Organismen)

## Installation

1. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```

2. **Supabase Projekt einrichten**:
   - Erstellen Sie ein neues Projekt auf [supabase.com](https://supabase.com)
   - Aktivieren Sie Email Auth in den Auth Settings
   - Deaktivieren Sie "Confirm email" für einfache Entwicklung (optional)

3. **Umgebungsvariablen konfigurieren**:
   Erstellen Sie eine `.env.local` Datei mit folgenden Variablen:
   ```env
   # Database (Supabase PostgreSQL)
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
   ```

4. **Datenbank einrichten**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Entwicklungsserver starten**:
   ```bash
   npm run dev
   ```

## Supabase Setup

### 1. Projekt erstellen
- Gehen Sie zu [supabase.com](https://supabase.com)
- Erstellen Sie ein neues Projekt
- Notieren Sie sich die Projekt-URL und API-Keys

### 2. Auth konfigurieren
- Gehen Sie zu Authentication > Settings
- Aktivieren Sie "Enable email confirmations" (optional)
- Konfigurieren Sie die Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/dashboard`

### 3. Datenbank einrichten
- Verwenden Sie die PostgreSQL URL aus Ihrem Supabase Projekt
- Führen Sie die Prisma Migrationen aus

## Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard für Benutzer
│   ├── guest/             # Gästeseiten für RSVP
│   ├── invites/           # Einladungsverwaltung
│   ├── login/             # Login-Seite
│   └── register/          # Registrierungs-Seite
├── components/            # React Komponenten
│   ├── atoms/            # Basis-Komponenten (Button, Input, etc.)
│   ├── molecules/        # Formulare
│   └── organisms/        # Navigation, AuthProvider, SupabaseProvider
├── lib/                  # Utilities und Konfiguration
│   ├── auth.ts           # NextAuth Konfiguration
│   ├── prisma.ts         # Prisma Client
│   ├── supabase.ts       # Supabase Client
│   └── supabase-auth.ts  # Supabase Auth Hilfsfunktionen
├── types/                # TypeScript Definitionen
│   └── next-auth.d.ts    # NextAuth Typen
└── middleware.ts         # Supabase Auth Middleware
```

## Verwendung

### Für Einladungsgeber

1. **Registrierung**: Erstellen Sie ein Konto auf `/register`
2. **Login**: Melden Sie sich auf `/login` an
3. **Einladung erstellen**: Klicken Sie auf "Neue Einladung erstellen"
4. **Gäste hinzufügen**: Fügen Sie Gäste zur Einladung hinzu
5. **Links teilen**: Kopieren Sie die individuellen Links für jeden Gast

### Für Gäste

1. **Link öffnen**: Öffnen Sie den erhaltenen Link
2. **Antwort geben**: Wählen Sie aus, ob Sie kommen möchten
3. **Details angeben**: Fügen Sie Anmerkungen hinzu (optional)
4. **Absenden**: Bestätigen Sie Ihre Antwort

## API Endpoints

### Authentifizierung
- `POST /api/auth/register` - Benutzerregistrierung (Supabase Auth)
- `GET/POST /api/auth/[...nextauth]` - NextAuth Endpoints

### Einladungen
- `GET /api/invitations` - Alle Einladungen des Benutzers
- `POST /api/invitations` - Neue Einladung erstellen
- `GET /api/invitations/[id]` - Einzelne Einladung abrufen

### Gäste
- `POST /api/invitations/[id]/guests` - Gast hinzufügen
- `DELETE /api/invitations/[id]/guests/[guestId]` - Gast löschen
- `GET /api/guest/[id]` - Gastdaten abrufen
- `PUT /api/guest/[id]` - Gastantwort speichern

## Entwicklung

### Komponenten-Architektur

Die Anwendung folgt dem Atomic Design Pattern:

- **Atome**: Basis-Komponenten wie Button, Input, Card
- **Moleküle**: Zusammengesetzte Komponenten wie LoginForm, RegisterForm
- **Organismen**: Komplexe Komponenten wie AuthProvider, SupabaseProvider

### Styling

- SCSS wird für alle Styles verwendet
- CSS-Variablen für konsistente Farben und Abstände
- Responsive Design mit CSS Grid und Flexbox
- Keine Tailwind-Abhängigkeit

### Datenbank-Schema

```sql
Invitation {
  id, title, address, date, time, description, 
  backgroundImage, backgroundColor, contactInfo, 
  userId (Supabase User ID), createdAt, updatedAt
}

Guest {
  id, name, email, phone, isCouple, plusOne, 
  isAttending, notes, invitationId, createdAt, updatedAt
}
```

### Supabase Auth Integration

- **Authentifizierung**: Supabase Auth für Benutzerregistrierung und Login
- **Session Management**: NextAuth.js für Session-Handling
- **Middleware**: Automatische Route-Schutz
- **Benutzerdaten**: Gespeichert in Supabase Auth, Referenz in Prisma

## Deployment

1. **Produktionsumgebung einrichten**:
   - Supabase Projekt (Produktion)
   - Umgebungsvariablen konfigurieren
   - Datenbank-Migrationen ausführen

2. **Build erstellen**:
   ```bash
   npm run build
   ```

3. **Deployen**:
   - Vercel, Netlify oder andere Next.js-kompatible Plattformen
   - Supabase-Projekt-URL und Keys in Produktionsumgebung setzen

## Lizenz

MIT
