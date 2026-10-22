# STAVA - wiedza o projekcie dla Claude Code

System rezerwacji trzech domkow wypoczynkowych STAVA w Starej Kiszewie (Kaszuby).
Strona produkcyjna: https://stavakiszewa.pl

## Stos
- Next.js 15 (App Router), React 19, JavaScript (bez TypeScript), Tailwind CSS 3, Framer Motion.
- Firebase: Firestore (dane), Storage (zdjecia), Auth (logowanie do panelu admina).
- Resend: maile transakcyjne. SMSApi.pl: SMS do admina o nowej rezerwacji.
- Hosting: Vercel, region fra1. Import aliasu `@/` wskazuje na katalog glowny (jsconfig.json).

## Wdrozenie
- Push na `main` = automatyczny deploy produkcyjny na Vercel. Inne galezie = preview deploy.
- Przed pushem na `main` zawsze uruchom `npm run build` i `npm run lint`. Zepsuty build nie wejdzie na strone, ale blokuje kolejne zmiany.
- Cron Vercel (vercel.json) codziennie o 2:00 UTC wywoluje `/api/cleanup-expired-reservations`.

## Komendy
- `npm install` - zaleznosci
- `npm run dev` - serwer lokalny na http://localhost:3000
- `npm run build` - build produkcyjny (sprawdzenie przed pushem)
- `npm run lint` - ESLint
- Brak testow automatycznych.

## Struktura
- `app/` - strony (PL w katalogu glownym, EN w `app/en/` - lustrzane trasy, przy zmianie strony PL zaktualizuj tez EN).
  - `rezerwacja`, `potwierdzenie`, `potwierdzenie/[token]`, `potwierdzenie-goscia` - proces rezerwacji.
  - `domki`, `galeria`, `o-nas`, `regulamin`, `polityka-prywatnosci` - strony informacyjne.
  - `panel/` - panel administratora (Firebase Auth): rezerwacje, `ceny`, `dostepnosc`, `kalendarze`, `minimalny-pobyt`, `booking-rezerwacje`.
  - `api/` - `contact`, `send-emails`, `send-status-email`, `cleanup-expired-reservations`.
  - `components/` - Header, Footer, ReservationCalendar, Lightbox, LanguageSwitcher itd.
- `lib/`
  - `firebase.js` - inicjalizacja Firebase ze zmiennych `NEXT_PUBLIC_FIREBASE_*`.
  - `firestore.js` - cala logika bazy (rezerwacje, blokady, minimalny pobyt, config, czyszczenie wygaslych).
  - `domek-config.js` / `domek-config-en.js` - statyczne opisy domkow (PL/EN) i kalkulacja cen (sezony, weekendy, dodatkowe osoby, oplata za zwierze).
  - `i18n.js` - tlumaczenia PL/EN i hook `useTranslation`.
  - `email.js` (Resend, szablony HTML), `sms.js` (SMSApi), `validation.js`, `rate-limit.js`, `seo.js`, `storage.js`, `image-paths.js`.

## Firestore
- `config/domki` - ceny, sezony, liczba domkow, limity osob (edytowane w panelu).
- `rezerwacje` - rezerwacje ze statusem oczekujaca / potwierdzona / anulowana. Oczekujace starsze niz 24h usuwa cron.
- `blokady` - zablokowane terminy domkow.
- `minimalny_pobyt` - reguly minimalnej liczby nocy dla okresow.
- Reguly bezpieczenstwa Firestore/Storage sa tylko w konsoli Firebase, nie w repo.

## Konwencje
- Tresci, nazwy zmiennych i komentarze po polsku (np. `domek`, `rezerwacja`, `blokada`).
- W tresciach strony uzywaj zwyklego myslnika "-", nie dlugiego.
- Zdjecia trzymane w Firebase Storage, wyswietlane przez `next/image` (dozwolone hosty w `next.config.mjs`).
- Sekrety tylko w `.env.local` (lokalnie) i w Vercel. Nigdy nie commituj kluczy. Lista zmiennych w `.env.example`.
- Uwaga: lokalny `npm run dev` laczy sie z PRODUKCYJNA baza Firebase. Testowe rezerwacje trafiaja do prawdziwej bazy i wysylaja prawdziwe maile - usuwaj je po testach.
