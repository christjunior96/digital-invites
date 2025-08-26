# Supabase Setup Anleitung

## 🚨 Fehler: Supabase-Keys fehlen

Sie erhalten diesen Fehler, weil die Supabase-Umgebungsvariablen nicht konfiguriert sind.

## 📋 Schritt-für-Schritt Setup

### 1. Supabase Projekt erstellen

1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Klicken Sie auf "Start your project"
3. Erstellen Sie ein neues Projekt
4. Warten Sie, bis das Projekt erstellt ist (kann einige Minuten dauern)

### 2. API Keys finden

1. Gehen Sie zu **Settings** → **API** in Ihrem Supabase Dashboard
2. Kopieren Sie folgende Werte:

```
Project URL: https://[YOUR-PROJECT-REF].supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Datenbank-URL finden

1. Gehen Sie zu **Settings** → **Database**
2. Kopieren Sie die **Connection string (URI)**
3. Ersetzen Sie `[YOUR-PASSWORD]` mit Ihrem Datenbank-Passwort

### 4. .env.local erstellen

Erstellen Sie eine `.env.local` Datei im Projektroot mit folgendem Inhalt:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Supabase - ÖFFENTLICH
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Supabase - PRIVAT (kein NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 5. Supabase Auth konfigurieren

1. Gehen Sie zu **Authentication** → **Settings**
2. Aktivieren Sie "Enable email confirmations" (optional für Tests)
3. Fügen Sie Redirect URLs hinzu:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`

### 6. Datenbank einrichten

```bash
# Prisma Client generieren
npx prisma generate

# Datenbank-Schema auf Supabase pushen
npx prisma db push
```

### 7. Testen

1. Starten Sie den Entwicklungsserver:
   ```bash
   npm run dev
   ```

2. Testen Sie die Verbindung:
   - Gehen Sie zu `http://localhost:3000/test`
   - Klicken Sie auf "Test Connection"

3. Erstellen Sie einen Testbenutzer:
   - Gehen Sie zu `http://localhost:3000/test-register`
   - Erstellen Sie einen Benutzer

4. Testen Sie das Login:
   - Gehen Sie zu `http://localhost:3000/login`
   - Verwenden Sie die Testdaten

## 🔧 Troubleshooting

### Problem: "Missing Supabase environment variables"

**Lösung**: Überprüfen Sie Ihre `.env.local` Datei:
- Alle Variablen müssen gesetzt sein
- Keine Leerzeichen um die `=` Zeichen
- Korrekte Projekt-Referenz verwenden

### Problem: "SUPABASE_SERVICE_ROLE_KEY is required"

**Lösung**: 
- Kopieren Sie den `service_role secret` aus dem Supabase Dashboard
- Stellen Sie sicher, dass er in `.env.local` steht (ohne `NEXT_PUBLIC_`)

### Problem: Datenbank-Verbindung fehlschlägt

**Lösung**:
- Überprüfen Sie die `DATABASE_URL`
- Stellen Sie sicher, dass das Passwort korrekt ist
- Warten Sie einige Minuten nach der Projekterstellung

## 📞 Hilfe

Falls Sie weiterhin Probleme haben:
1. Überprüfen Sie die Browser-Konsole (F12)
2. Gehen Sie zu `http://localhost:3000/test` für Debug-Informationen
3. Überprüfen Sie die Supabase Dashboard-Logs
