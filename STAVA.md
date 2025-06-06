# STAVA - Ośrodek Domków Letniskowych

## Cel projektu

STAVA to nowoczesna aplikacja webowa dla ośrodka domków letniskowych w Starej Kiszewie. Aplikacja została zaprojektowana z myślą o prezentacji oferty, obsłudze rezerwacji i zapewnieniu wygodnego kontaktu z gośćmi.

### Główne funkcjonalności:
- **Prezentacja ośrodka** - Strona główna z sekcją hero i opisem
- **Katalog domków** - Przegląd dostępnych domków z filtrami i szczegółami
- **System rezerwacji** - Kompletny proces rezerwacyjny z kalendarzem i płatnościami
- **Galeria zdjęć** - Kategoryzowana galeria: domki, okolica, ośrodek
- **Panel kontaktowy** - Formularz kontaktowy i dane teleadresowe
- **Email automation** - Automatyczne powiadomienia o rezerwacjach

## Architektura techniczna

### Stack technologiczny:
- **Framework**: Next.js 15.3.2 (App Router, JavaScript)
- **Styling**: Tailwind CSS + custom leśne motywy
- **Backend**: Firebase (Firestore + Storage)
- **Email Service**: Resend API
- **Hosting**: Vercel
- **Domain**: stavakiszewa.pl

### Struktura aplikacji:

```
app/
├── api/
│   ├── send-emails/route.js      # API wysyłki emaili
│   └── send-status-email/route.js # API statusu rezerwacji
├── components/
│   ├── Header.js                 # Nawigacja z logo Firebase Storage
│   ├── Footer.js                 # Stopka z danymi kontaktowymi
│   ├── DateRangePicker.js        # Komponent kalendarza
│   ├── LoaderSmoke.js           # Animacja ładowania
│   └── LayoutWithLoader.js      # Layout z loaderem
├── domki/
│   └── page.js                  # Lista domków z Firebase Storage
├── domek/[id]/
│   └── page.js                  # Szczegóły domku + galeria Firebase
├── galeria/
│   └── page.js                  # Galeria zdjęć z Firebase Storage
├── kontakt/
│   └── page.js                  # Formularz kontaktowy
├── rezerwacja/
│   └── page.js                  # Formularz rezerwacji
├── potwierdzenie/[token]/
│   └── page.js                  # Panel potwierdzenia dla gospodarza
├── potwierdzenie-goscia/
│   └── page.js                  # Potwierdzenie dla gościa
├── regulamin/
│   └── page.js                  # Regulamin ośrodka
├── polityka-prywatnosci/
│   └── page.js                  # Polityka prywatności RODO
├── layout.js                    # Root layout z Firebase favicon
├── page.js                      # Strona główna
└── globals.css                  # Style globalne + leśne motywy

lib/
├── firebase.js                  # Konfiguracja Firebase
├── firestore.js                 # Operacje na bazie danych
├── storage.js                   # Operacje Firebase Storage
└── email.js                     # Szablony i wysyłka emaili
```

## Firebase Storage - Struktura plików

### Organizacja folderów:

```
stava-62c2a.firebasestorage.app/
├── global/                      # Pliki globalne aplikacji
│   ├── logo.png                 # Logo główne (stałe URL dla wydajności)
│   ├── logo-text.png            # Logo tekstowe (stałe URL)
│   └── favicon.ico              # Ikona strony
├── hero/                        # Materiały do strony głównej
│   └── video.mp4                # Filmik z drona (planowany)
├── domki/                       # Zdjęcia domków
│   ├── {domekId}/
│   │   ├── main.jpg             # Zdjęcie główne domku
│   │   ├── 1.jpg                # Galeria domku (1-10.jpg)
│   │   ├── 2.jpg
│   │   └── ...
├── galeria/                     # Galeria publiczna
│   ├── okolica/
│   │   ├── 1.jpg                # Zdjęcia okolicy (1-15.jpg)
│   │   ├── 2.jpg
│   │   └── ...
│   └── osrodek/
│       ├── 1.jpg                # Zdjęcia ośrodka (1-15.jpg)
│       ├── 2.jpg
│       └── ...
└── seo/                         # Obrazy dla SEO/social media
    ├── og-image.jpg             # Open Graph image
    └── twitter-card.jpg         # Twitter Card image
```

### Zasady organizacji obrazów:

**Global assets (logo, favicon)**:
- Używają stałych URL-i z tokenami dla maksymalnej wydajności
- Są rzadko zmieniane, więc cache'owanie jest optymalne

**Domki**:
- `main.jpg` - zdjęcie główne wyświetlane na liście i w hero
- `1.jpg` do `10.jpg` - galeria szczegółowa domku
- Nazwy plików zawsze numeryczne dla łatwości zarządzania

**Galeria publiczna**:
- Kategoryzacja: `okolica/` (atrakcje turystyczne) i `osrodek/` (infrastruktura)
- Numeracja `1.jpg` do `15.jpg` w każdej kategorii
- Automatyczne ładowanie z obsługą brakujących plików

## Baza danych Firestore

### Kolekcje:

#### 1. `domki`
```javascript
{
  id: "auto-generated-id",
  nazwa: "Domek Sosnowy",
  opis: "Szczegółowy opis domku...",
  opisKrotki: "Krótki opis do karty",
  cenaZaDobe: 250,
  iloscOsob: 4,
  powierzchnia: 45,
  wyposazenie: ["Wi-Fi", "Kuchnia", "Łóżka", "Łazienka"],
  udogodnienia: ["Parking", "Grill", "Taras"],
  dostepny: true,
  metadane: {
    createdAt: Timestamp,
    updatedAt: Timestamp
  }
}
```

**Uwaga**: Pola `zdjeciaURLs` i `zdjecieGlowneURL` zostały usunięte. Obrazy są teraz ładowane dynamicznie z Firebase Storage na podstawie ID domku.

#### 2. `rezerwacje`
```javascript
{
  id: "auto-generated-id",
  domekId: "reference-to-domek",
  startDate: Timestamp,
  endDate: Timestamp,
  status: "oczekujaca|potwierdzona|odrzucona|zakonczona",
  daneKlienta: {
    imie: "Jan",
    nazwisko: "Kowalski",
    email: "jan@example.com",
    telefon: "+48123456789",
    adres: "ul. Przykładowa 123, Warszawa",
    uwagi: "Pytanie o grill"
  },
  tokenPotwierdzenia: "uuid-token",
  cenaCałkowita: 750,
  metadane: {
    createdAt: Timestamp,
    updatedAt: Timestamp
  }
}
```

#### 3. `settings`
```javascript
{
  id: "global",
  contactInfo: {
    email: "kontakt@stavakiszewa.pl",
    phone: "+48 XXX XXX XXX",
    address: "Stara Kiszewa, ul. Leśna 1"
  },
  socialMedia: {
    facebook: "https://facebook.com/stava",
    instagram: "https://instagram.com/stava"
  },
  daneDoWplaty: {
    numerKonta: "XX XXXX XXXX XXXX XXXX XXXX XXXX",
    nazwaBanku: "Bank Przykładowy",
    odbiorca: "STAVA Sp. z o.o.",
    tytulPrzelewu: "Rezerwacja [ID]"
  }
}
```

## API Endpoints

### `/api/send-emails` (POST)
Wysyła emaile potwierdzające rezerwację.

**Request body:**
```javascript
{
  email: "guest@example.com",
  tokenPotwierdzenia: "uuid-token",
  // ... inne dane rezerwacji
}
```

**Response:**
```javascript
{
  success: true,
  results: {
    guestEmail: { id: "email-id" },
    adminEmail: { id: "email-id" }
  }
}
```

### `/api/send-status-email` (POST)
Wysyła email o zmianie statusu rezerwacji.

**Request body:**
```javascript
{
  email: "guest@example.com",
  status: "potwierdzona|odrzucona",
  // ... dane rezerwacji
}
```

## Konfiguracja środowiska

### Zmienne środowiskowe (.env.local):

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=stava-62c2a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=stava-62c2a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=stava-62c2a.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=750690294845
NEXT_PUBLIC_FIREBASE_APP_ID=1:750690294845:web:ae128701a288da83b25e54

# Resend Email Service
RESEND_API_KEY=re_your_resend_api_key

# Email Configuration
EMAIL_FROM=noreply@stavakiszewa.pl
EMAIL_ADMIN=kontakt@stavakiszewa.pl

# App Configuration
NEXT_PUBLIC_APP_URL=https://stavakiszewa.pl
NEXT_PUBLIC_APP_NAME=STAVA Kiszewa
```

## Przepływ rezerwacji

1. **Wybór domku i daty** - Gość wybiera domek i sprawdza dostępność
2. **Formularz rezerwacji** - Wypełnienie danych osobowych i preferencji
3. **Zapis do bazy** - Utworzenie rezerwacji ze statusem "oczekująca"
4. **Email do gościa** - Potwierdzenie z instrukcjami płatności
5. **Email do gospodarza** - Powiadomienie z linkiem do akcpetacji/odrzucenia
6. **Akcja gospodarza** - Potwierdzenie lub odrzucenie przez panel `/potwierdzenie/[token]`
7. **Email finalny** - Informacja o statusie końcowym do gościa

## Style i design

### Motyw leśny:
- **Kolory główne**: stone-800, amber-800, green-800
- **Tło**: gradient stone-50 to stone-100
- **Akcenty**: tekstury "naszywki", animacje nature-pulse
- **Typografia**: font-display (nagłówki), font-body (tekst), font-primary (akcentы)

### Komponenty stylowe:
- `.btn-forest` - przyciski główne
- `.btn-forest-outline` - przyciski drugorzędne  
- `.card-forest` - karty z cieniami
- `.section-forest` - sekcje z tłem
- `.texture-forest` - tekstura tła
- `.image-forest` - efekty hover dla obrazów

## Wdrożenie na Vercel

### Kroki przygotowania:

1. **Konfiguracja domeny**:
   ```bash
   # W Vercel dashboard dodaj domenę stavakiszewa.pl
   # Skonfiguruj DNS records u dostawcy domeny
   ```

2. **Zmienne środowiskowe**:
   ```bash
   # W Vercel dashboard -> Settings -> Environment Variables
   # Dodaj wszystkie zmienne z .env.local
   ```

3. **Optymalizacje buildowania**:
   ```bash
   # Ensure build commands in package.json
   "scripts": {
     "build": "next build",
     "start": "next start"
   }
   ```

4. **Firebase Storage setup**:
   ```bash
   # Upewnij się że reguły Firebase Storage zezwalają na read:
   # allow read: true;
   ```

5. **Email delivery**:
   ```bash
   # Verify domain w Resend dashboard
   # Skonfiguruj SPF/DKIM records dla stavakiszewa.pl
   ```

6. **Monitoring**:
   ```bash
   # Vercel Analytics (włączone automatycznie)
   # Error tracking przez Vercel dashboard
   ```

### Checklist przed go-live:

- [ ] Wszystkie zmienne środowiskowe skonfigurowane
- [ ] Domeny zweryfikowane (Vercel + Resend)
- [ ] Firebase Storage z przykładowymi zdjęciami
- [ ] Firestore z przykładowymi domkami
- [ ] DNS records poprawnie skonfigurowane
- [ ] HTTPS certificate aktywny
- [ ] Email delivery przetestowany
- [ ] Responsive design sprawdzony
- [ ] SEO meta tags zweryfikowane
- [ ] Performance audit wykonany (Lighthouse > 90)

### Post-deployment tasks:

1. **Upload content do Firebase Storage:**
   - Logo i favicon do `/global/`
   - Zdjęcia domków do `/domki/{id}/`
   - Zdjęcia galerii do `/galeria/okolica/` i `/galeria/osrodek/`

2. **Konfiguracja Firestore:**
   - Dodanie przykładowych domków
   - Konfiguracja settings/global
   - Weryfikacja reguł bezpieczeństwa

3. **Monitoring setup:**
   - Google Analytics (opcjonalnie)
   - Error tracking
   - Performance monitoring

## Utrzymanie i rozwój

### Regularne zadania:
- **Aktualizacja treści**: Przez Firebase Console (Firestore + Storage)
- **Zarządzanie rezerwacjami**: Panel `/potwierdzenie/[token]`
- **Monitoring emaili**: Resend dashboard
- **Analityka**: Vercel Analytics

### Potencjalne rozszerzenia:
- **Panel administratora**: CRUD dla domków i ustawień
- **Kalendarz dostępności**: Zaawansowany widok terminów
- **Płatności online**: Integracja Stripe/PayU
- **Multi-language**: Wsparcie EN/DE dla turystów
- **Reviews system**: Opinie gości po pobycie

## API Reference - Storage Helper

### `getStorageUrl(path)`

Funkcja helper do pobierania URL-i z Firebase Storage.

```javascript
import { getStorageUrl } from '@/lib/storage';

// Przykłady użycia:
const logoUrl = await getStorageUrl('global/logo.png');
const mainImage = await getStorageUrl(`domki/${domekId}/main.jpg`);
const galleryImage = await getStorageUrl('galeria/okolica/1.jpg');

// Obsługa błędów:
const imageUrl = await getStorageUrl('path/to/image.jpg');
if (!imageUrl) {
  // Plik nie istnieje lub błąd dostępu
  // Pokaż placeholder lub domyślny obraz
}
```

### Error Handling

Aplikacja obsługuje błędy na różnych poziomach:

1. **Storage errors**: Graceful fallback na placeholders
2. **Network errors**: Retry logic i user feedback  
3. **Form validation**: Real-time validation z UX feedback
4. **Email errors**: Partial success handling
5. **Database errors**: Consistent error boundaries

---

**Ostatnia aktualizacja**: December 2024  
**Wersja**: 2.0 (Firebase Storage migration)  
**Status**: Production Ready
