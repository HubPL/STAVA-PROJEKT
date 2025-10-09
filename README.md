# 🏡 STAVA - System Rezerwacji Domków Wypoczynkowych

> Nowoczesna aplikacja webowa do zarządzania rezerwacjami domków wypoczynkowych STAVA.

## 📋 Spis treści

- [O projekcie](#-o-projekcie)
- [Funkcje](#-funkcje)
- [Technologie](#-technologie)

## 🎯 O projekcie

**STAVA** to kompleksowy system rezerwacji online domków wypoczynkowych położonych w sercu Kaszub. Aplikacja oferuje:

- 🏠 **Zarządzanie 3 domkami** - Każdy domek ma niezależny kalendarz dostępności
- 🌍 **Wielojęzyczność** - Pełne wsparcie dla języka polskiego i angielskiego
- 📱 **Responsive design** - Optymalizacja dla urządzeń mobilnych, tabletów i desktopów
- ⚡ **Wysoka wydajność** - Optymalizacja obrazów, lazy loading, code splitting
- 🔒 **Bezpieczeństwo** - Firebase Authentication, zabezpieczone API routes
- 📧 **Automatyzacja** - Automatyczne emaile potwierdzające rezerwacje

### Live Demo
🌐 [stavakiszewa.pl](https://stavakiszewa.pl)

## ✨ Funkcje

### Dla Gości

- ✅ **Interaktywny kalendarz rezerwacji**
  - Wyświetlanie dostępności dla wszystkich 3 domków
  - Wybór wielu domków w jednej rezerwacji
  - Dynamiczne obliczanie cen z uwzględnieniem sezonowości
  - Walidacja minimalnego czasu pobytu
  - Wizualizacja zajętych i dostępnych terminów

- ✅ **Proces rezerwacji**
  - Prosty, intuicyjny formularz rezerwacyjny
  - Walidacja danych w czasie rzeczywistym
  - Automatyczne generowanie potwierdzenia
  - Email z instrukcjami płatności
  - System 24-godzinnej rezerwacji wstępnej

- ✅ **Galeria zdjęć**
  - Lightbox do przeglądania zdjęć
  - Optymalizowane obrazy (WebP/AVIF)
  - Lazy loading dla lepszej wydajności

- ✅ **Formularz kontaktowy**
  - Wysyłka emaili przez Resend API
  - Walidacja formularzy
  - Potwierdzenie wysłania

### Dla Administratorów

- 🔐 **Panel administracyjny** (`/panel`)
  - Autoryzacja Firebase Auth
  - Przegląd wszystkich rezerwacji
  - Zarządzanie statusami rezerwacji (oczekująca/potwierdzona/anulowana)
  - System powiadomień email

- 📊 **Zarządzanie dostępnością**
  - Kalendarze dla każdego domku
  - Blokowanie wybranych dat
  - Ustawianie cen sezonowych
  - Konfiguracja minimalnego czasu pobytu

- 💰 **Zarządzanie cenami**
  - Ceny bazowe dla każdego domku
  - Ceny sezonowe (lato, święta, weekendy)
  - Opłaty za dodatkowe osoby
  - Automatyczne obliczenia

- 📧 **System emaili**
  - Potwierdzenia dla gości
  - Powiadomienia dla administratorów
  - Aktualizacje statusu rezerwacji
  - Profesjonalne szablony HTML

### Automatyzacja

- ⏰ **Cron jobs**
  - Automatyczne usuwanie wygasłych rezerwacji (po 24h bez płatności)
  - Czyszczenie nieaktualnych danych
  - Powiadomienia o zbliżających się rezerwacjach

## 🛠 Technologie

### Frontend

- **[Next.js 15.3.2](https://nextjs.org/)** - React framework z App Router
- **[React 19](https://react.dev/)** - Biblioteka UI z najnowszymi features
- **[Tailwind CSS 3.3](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animacje i transitions
- **[React Hook Form](https://react-hook-form.com/)** - Zarządzanie formularzami
- **[date-fns](https://date-fns.org/)** - Manipulacja datami
- **[React Icons](https://react-icons.github.io/react-icons/)** - Zestaw ikon

### Backend & Infrastructure

- **[Firebase](https://firebase.google.com/)** - Backend as a Service
  - **Firestore** - NoSQL database dla rezerwacji i konfiguracji
  - **Firebase Storage** - Hosting obrazów i plików
  - **Firebase Auth** - Autentykacja administratorów
- **[Resend API](https://resend.com/)** - Wysyłka transakcyjnych emaili
- **[Vercel](https://vercel.com/)** - Hosting i deployment platform

### DevOps & Monitoring

- **[Vercel Analytics](https://vercel.com/analytics)** - Analityka użytkowników
- **[Vercel Speed Insights](https://vercel.com/docs/speed-insights)** - Monitoring wydajności
- **[ESLint](https://eslint.org/)** - Linting kodu JavaScript/React

### Optymalizacje

- ⚡ **Optymalizacja obrazów** - Komponent Next.js Image z automatycznym WebP/AVIF
- 🚀 **Podział kodu** - Dynamiczne importy, granice Suspense
- 📦 **Optymalizacja bundli** - Tree shaking, minifikacja
- 💾 **Strategia cache'owania** - Statyczne zasoby cache'owane na 1 rok
- 🔍 **SEO** - Tagi meta, Open Graph, dane strukturalne, sitemap.xml

## 📞 Kontakt

- Website: [stavakiszewa.pl](https://stavakiszewa.pl)
- Email: kontakt@stavakiszewa.pl
- Telefon: +48 886 627 447
- Adres: ul. Wygonińska 38, 83-430 Stara Kiszewa

---

<p align="center">Hubert Brzozowski</p>

