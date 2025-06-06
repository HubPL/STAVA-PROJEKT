# Wdrożenie STAVA na Vercel - stavakiszewa.pl

## Przygotowanie do wdrożenia

### 1. Przygotowanie kodu

Aplikacja została już przygotowana do wdrożenia z następującymi zmianami:

✅ **Zaktualizowano strategię obrazów na Firebase Storage**
✅ **Usunięto niepotrzebne pliki SVG z folderu public**  
✅ **Wyczyszczono konfigurację Next.js z niepotrzebnych hostów**
✅ **Dodano favicon z Firebase Storage**
✅ **Zoptymalizowano SEO metadata**

### 2. Struktura Firebase Storage - wymagane przygotowanie

Przed wdrożeniem należy przygotować następującą strukturę w Firebase Storage:

```
stava-62c2a.firebasestorage.app/
├── global/
│   ├── logo.png           # Logo główne (już istnieje)
│   ├── logo-text.png      # Logo tekstowe (już istnieje)  
│   └── favicon.ico        # Ikona strony (DO DODANIA)
├── domki/
│   └── [dla każdego domku w Firestore]
│       ├── main.jpg       # Zdjęcie główne
│       ├── 1.jpg          # Galeria (opcjonalne 1-10.jpg)
│       ├── 2.jpg
│       └── ...
├── galeria/
│   ├── okolica/
│   │   ├── 1.jpg          # Zdjęcia okolicy (opcjonalne 1-15.jpg)
│   │   ├── 2.jpg
│   │   └── ...
│   └── osrodek/
│       ├── 1.jpg          # Zdjęcia ośrodka (opcjonalne 1-15.jpg)
│       ├── 2.jpg
│       └── ...
└── hero/
    └── video.mp4          # Filmik z drona (przyszłe użycie)
```

## Wdrożenie na Vercel

### Krok 1: Połączenie z GitHub

1. Wejdź na [vercel.com](https://vercel.com) i zaloguj się
2. Kliknij **"New Project"**
3. Połącz repozytorium GitHub z projektem STAVA
4. Upewnij się, że framework jest automatycznie wykryty jako **Next.js**

### Krok 2: Konfiguracja zmiennych środowiskowych

W Vercel Dashboard → Settings → Environment Variables dodaj:

```bash
# Firebase Configuration (WYMAGANE)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAzW6mPqwTJMmaPITRa_iOHW4aVEJtqIpA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=stava-62c2a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=stava-62c2a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=stava-62c2a.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=750690294845
NEXT_PUBLIC_FIREBASE_APP_ID=1:750690294845:web:ae128701a288da83b25e54

# Resend Email Service (WYMAGANE dla rezerwacji)
RESEND_API_KEY=re_3VwEhZap_CfrGokxrozdCY4j6SmZLA4on

# Email Configuration (WYMAGANE)
EMAIL_FROM=noreply@stavakiszewa.pl
EMAIL_ADMIN=kontakt@stavakiszewa.pl

# App Configuration (WYMAGANE)
NEXT_PUBLIC_APP_URL=https://stavakiszewa.pl
NEXT_PUBLIC_APP_NAME=STAVA Kiszewa
```

**⚠️ WAŻNE:** Upewnij się, że wszystkie zmienne są dodane dla środowisk:
- Production
- Preview  
- Development

### Krok 3: Pierwsze wdrożenie

1. Kliknij **"Deploy"** - Vercel automatycznie zbuduje i wdroży aplikację
2. Po pomyślnym wdrożeniu otrzymasz URL: `https://stava-projekt-xxx.vercel.app`
3. Sprawdź czy aplikacja działa poprawnie

### Krok 4: Konfiguracja domeny stavakiszewa.pl

#### W Vercel Dashboard:

1. Idź do **Settings → Domains**
2. Dodaj domenę: `stavakiszewa.pl`
3. Dodaj subdomenę: `www.stavakiszewa.pl` (redirect do głównej)
4. Vercel poda instrukcje DNS

#### U dostawcy domeny (gdzie jest zarejestrowana stavakiszewa.pl):

Skonfiguruj następujące DNS records:

```bash
# A record dla głównej domeny
Type: A
Name: @
Value: 76.76.19.61  # (lub IP podane przez Vercel)

# CNAME dla www
Type: CNAME  
Name: www
Value: cname.vercel-dns.com.

# (Opcjonalnie) CNAME dla subdomeny
Type: CNAME
Name: *
Value: cname.vercel-dns.com.
```

**💡 Tip:** DNS propagacja może zająć 24-48 godzin

### Krok 5: Konfiguracja email domeny (Resend)

#### W Resend Dashboard:

1. Dodaj domenę `stavakiszewa.pl`
2. Skonfiguruj następujące DNS records:

```bash
# SPF Record
Type: TXT
Name: @
Value: "v=spf1 include:_spf.resend.com ~all"

# DKIM Record  
Type: TXT
Name: [key podany przez Resend]
Value: [value podane przez Resend]

# DMARC Record (opcjonalnie)
Type: TXT
Name: _dmarc
Value: "v=DMARC1; p=quarantine; rua=mailto:kontakt@stavakiszewa.pl"
```

## Testy po wdrożeniu

### Podstawowe funkcjonalności:

- [ ] **Strona główna** ładuje się poprawnie
- [ ] **Logo i navbar** wyświetlają się z Firebase Storage
- [ ] **Lista domków** pobiera dane z Firestore + obrazy z Storage
- [ ] **Szczegóły domku** pokazują galerie z Firebase Storage
- [ ] **Galeria** ładuje zdjęcia z kategorii (okolica/ośrodek)
- [ ] **Formularz kontaktowy** działa
- [ ] **System rezerwacji** zapisuje do Firestore
- [ ] **Email notifications** wysyłają się przez Resend

### Performance i SEO:

- [ ] **Lighthouse Score > 90** (Performance, Accessibility, SEO)
- [ ] **Meta tags** wyświetlają się poprawnie
- [ ] **Open Graph** tags działają (test: [opengraph.xyz](https://www.opengraph.xyz))
- [ ] **Favicon** ładuje się z Firebase Storage
- [ ] **Mobile responsiveness** na różnych urządzeniach

### Monitoring:

- [ ] **Vercel Analytics** włączone
- [ ] **Error tracking** w Vercel Dashboard  
- [ ] **Email delivery** monitoring w Resend
- [ ] **Firebase Console** dostępny dla zarządzania treścią

## Działania po go-live

### 1. Content Management

**Firebase Storage - upload treści:**
```bash
# Przez Firebase Console lub programmatycznie
# Struktura folderów już jest przygotowana w kodzie

# Przykład: dodaj zdjęcia domków
/domki/domek-id-1/main.jpg     # Główne zdjęcie
/domki/domek-id-1/1.jpg        # Galeria
/domki/domek-id-1/2.jpg        # Galeria

# Dodaj zdjęcia galerii
/galeria/okolica/1.jpg         # Jezioro
/galeria/okolica/2.jpg         # Las
/galeria/osrodek/1.jpg         # Recepcja  
/galeria/osrodek/2.jpg         # Plac zabaw
```

**Firestore - dodaj przykładowe domki:**
```javascript
// Kolekcja: domki
{
  nazwa: "Domek Sosnowy",
  opis: "Przytulny domek dla 4 osób...",
  opisKrotki: "Komfortowy domek w lesie",
  cenaZaDobe: 250,
  iloscOsob: 4,
  powierzchnia: 45,
  wyposazenie: ["Wi-Fi", "Kuchnia", "Łóżka", "Łazienka"],
  udogodnienia: ["Parking", "Grill", "Taras"],
  dostepny: true
}
```

### 2. SEO i Marketing

- **Google Search Console:** Dodaj domenę i prześlij sitemap
- **Google Analytics:** (opcjonalnie) dla zaawansowanej analityki
- **Social Media:** Przetestuj Open Graph na Facebook/Twitter

### 3. Monitoring i maintenance

**Cotygodniowe:**
- Sprawdź logi błędów w Vercel Dashboard
- Monitoruj delivery rate w Resend
- Sprawdź nowe rezerwacje w Firebase Console

**Comiesięczne:**  
- Performance audit (Lighthouse)
- Backup Firebase (automatyczny, ale zweryfikuj)
- Sprawdź certificate SSL (automatyczny renewal)

## Troubleshooting

### Typowe problemy:

**🚨 "Images not loading"**
- Sprawdź Firebase Storage rules: `allow read: true;`
- Zweryfikuj ścieżki plików w Storage
- Sprawdź Next.js remote patterns w konfiguracji

**🚨 "Emails not sending"**  
- Zweryfikuj zmienne środowiskowe Resend
- Sprawdź DNS records domeny
- Sprawdź logs w Resend Dashboard

**🚨 "Database connection errors"**
- Zweryfikuj Firebase config zmienne
- Sprawdź Firestore rules
- Sprawdź network requests w DevTools

**🚨 "Domain not resolving"**
- Sprawdź DNS propagację: [whatsmydns.net](https://whatsmydns.net)
- Zweryfikuj A/CNAME records
- Poczekaj 24-48h na pełną propagację

## Rollback plan

W przypadku problemów:

1. **Szybki rollback:** Vercel → Deployments → "Promote to Production" poprzednia wersja
2. **DNS rollback:** Zmień A record na stary serwer (jeśli migracja)
3. **Email fallback:** Tymczasowo użyj poprzedniego providera email

## Kontakt supportu

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Firebase Support:** [Firebase Console → Support](https://console.firebase.google.com)
- **Resend Support:** [resend.com/support](https://resend.com/support)

---

**Status wdrożenia:** ✅ Ready for deployment  
**Ostatnia aktualizacja instrukcji:** December 2024  
**Szacowany czas wdrożenia:** 2-4 godziny (+ czas propagacji DNS) 