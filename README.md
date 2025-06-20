# STAVA - System Rezerwacji Domków Letniskowych

![STAVA Logo](https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2Flogo.webp?alt=media)

## 📌 O projekcie

STAVA to nowoczesny system rezerwacji domków letniskowych w Starej Kiszewie. Aplikacja oferuje pełną obsługę procesu rezerwacji, zarządzanie dostępnością oraz panel administracyjny.

### 🌟 Główne funkcje

- **Wielojęzyczność** - obsługa języka polskiego i angielskiego
- **System rezerwacji** - intuicyjny kalendarz z możliwością wyboru terminów
- **Panel administracyjny** - zarządzanie rezerwacjami, cenami i dostępnością
- **Automatyczne powiadomienia email** - potwierdzenia dla gości i powiadomienia dla administracji
- **Responsywny design** - optymalizacja dla wszystkich urządzeń
- **Galeria zdjęć** - prezentacja domków i otoczenia
- **SEO** - pełna optymalizacja pod kątem wyszukiwarek

## 🚀 Technologie

- **Next.js 14** - framework React z App Router
- **Firebase** - Firestore (baza danych), Storage (pliki), Authentication
- **Tailwind CSS** - stylowanie
- **Resend** - wysyłka emaili
- **Vercel** - hosting i deployment

## 📦 Instalacja

```bash
# Klonowanie repozytorium
git clone https://github.com/yourusername/stava-tin.git
cd stava-tin

# Instalacja zależności
npm install

# Konfiguracja zmiennych środowiskowych
cp .env.example .env.local
# Uzupełnij plik .env.local swoimi danymi
```

## 🔧 Konfiguracja

### Firebase

1. Stwórz projekt w [Firebase Console](https://console.firebase.google.com/)
2. Włącz Firestore Database i Storage
3. Skopiuj konfigurację do `.env.local`
4. Ustaw reguły bezpieczeństwa zgodnie z `firestore.rules`

### Resend

1. Załóż konto na [Resend](https://resend.com/)
2. Wygeneruj API Key
3. Dodaj klucz do `.env.local` jako `RESEND_API_KEY`

### Zmienne środowiskowe

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Email
RESEND_API_KEY=
EMAIL_FROM=noreply@stavakiszewa.pl
EMAIL_ADMIN=kontakt@stavakiszewa.pl

# App
NEXT_PUBLIC_APP_URL=https://stavakiszewa.pl
NEXT_PUBLIC_APP_NAME=STAVA Kiszewa
```

## 🏃 Uruchamianie

```bash
# Tryb deweloperski
npm run dev

# Build produkcyjny
npm run build

# Uruchomienie buildu
npm start

# Analiza buildu
npm run analyze
```

## 📂 Struktura projektu

```
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── components/        # Komponenty React
│   ├── panel/            # Panel administracyjny
│   ├── en/               # Strony angielskie
│   └── (strony)          # Strony polskie
├── lib/                   # Biblioteki i utilities
│   ├── firebase.js       # Konfiguracja Firebase
│   ├── firestore.js      # Funkcje Firestore
│   ├── email.js          # Wysyłka emaili
│   └── i18n.js           # Tłumaczenia
├── public/               # Pliki statyczne
│   └── fonts/           # Lokalne czcionki
└── firestore.rules      # Reguły bezpieczeństwa
```

## 🔐 Panel administracyjny

Panel dostępny pod adresem `/panel` wymaga logowania:

- **Email**: Skonfigurowany admin Firebase Auth
- **Hasło**: Ustalone przy tworzeniu konta

### Funkcje panelu:

- Przeglądanie i zarządzanie rezerwacjami
- Zmiana statusów (oczekująca/potwierdzona/odrzucona)
- Zarządzanie cenami (podstawowa i sezonowe)
- Blokowanie terminów (remonty, awarie)
- Przydzielanie domków do rezerwacji

## 🌐 Deployment na Vercel

1. Połącz repozytorium z Vercel
2. Dodaj zmienne środowiskowe w panelu Vercel
3. Deploy automatyczny przy każdym push do `main`

```bash
# Ręczny deploy
vercel --prod
```

## 📱 Responsywność

Aplikacja jest w pełni responsywna:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Wide: 1280px+

## 🎨 Typografia

- **Nagłówki**: Lumios Typewriter
- **Treść**: Playfair Display
- **Kolory**: Paleta beżowo-szara (#e3e0d8, #3a3a3a)

## 📈 SEO

- Metadata dla każdej strony
- Sitemap automatyczna
- Robots.txt
- Dane strukturalne Schema.org
- Open Graph i Twitter Cards

## 🔒 Bezpieczeństwo

- Content Security Policy
- Security headers
- Rate limiting na API
- Walidacja danych
- Sanityzacja inputów

## 📧 System emaili

Automatyczne emaile wysyłane przy:
- Nowej rezerwacji (gość + admin)
- Zmianie statusu rezerwacji
- Potwierdzeniu rezerwacji

## 🛠️ Utrzymanie

### Backup danych
Regularne backupy Firestore przez Firebase Console

### Monitoring
- Vercel Analytics
- Vercel Speed Insights
- Firebase Console dla błędów

## 📝 Licencja

Wszystkie prawa zastrzeżone © 2025 STAVA Kiszewa

## 👥 Kontakt

- Email: kontakt@stavakiszewa.pl
- Tel: +48 886 627 447
- Adres: ul. Wygonińska 38, 83-430 Stara Kiszewa

---

Developed with ❤️ for STAVA Kiszewa 