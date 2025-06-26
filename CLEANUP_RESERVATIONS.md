# Automatyczne czyszczenie przeterminowanych rezerwacji

## Opis funkcjonalności

System automatycznie usuwa oczekujące rezerwacje, które są starsze niż 24 godziny. To zapewnia, że nieobsłużone rezerwacje nie blokują dostępności domków na dłużej.

## Jak to działa

### 1. Logika czyszczenia
- Sprawdzane są wszystkie rezerwacje ze statusem `oczekujaca`
- Porównywany jest czas utworzenia (`metadane.createdAt`) z aktualnym czasem
- Rezerwacje starsze niż 24 godziny są automatycznie usuwane
- Każde usunięcie jest logowane w konsoli z szczegółami

### 2. API Endpoints

#### GET `/api/cleanup-expired-reservations`
Sprawdza liczbę przeterminowanych rezerwacji bez ich usuwania.

**Odpowiedź:**
```json
{
  "success": true,
  "totalPendingReservations": 5,
  "expiredReservations": 2,
  "message": "Znaleziono 2 przeterminowanych rezerwacji z 5 oczekujących"
}
```

#### POST `/api/cleanup-expired-reservations`
Usuwa wszystkie przeterminowane rezerwacje.

**Odpowiedź:**
```json
{
  "success": true,
  "foundExpired": 2,
  "deletedCount": 2,
  "failedDeletes": [],
  "message": "Znaleziono 2 przeterminowanych rezerwacji, usunięto 2"
}
```

### 3. Automatyczne uruchamianie

#### Vercel Cron Jobs
Skonfigurowany w `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cleanup-expired-reservations",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Schedule:** Co 6 godzin (0:00, 6:00, 12:00, 18:00 każdego dnia)

### 4. Panel administracyjny

W panelu admina dostępne są:

1. **Powiadomienie o przeterminowanych rezerwacjach** - wyświetlane w nagłówku
2. **Przycisk do ręcznego czyszczenia** - pojawia się gdy są przeterminowane rezerwacje
3. **Informacja o systemie** - w sekcji filtrów

## Bezpieczeństwo

### Opcjonalny klucz API
Możesz zabezpieczyć endpoint dodając zmienną środowiskową:

```bash
CLEANUP_API_KEY=twoj_tajny_klucz
```

Jeśli ustawisz tę zmienną, każde wywołanie API musi zawierać nagłówek:
```
Authorization: Bearer twoj_tajny_klucz
```

**Uwaga:** Vercel Cron Jobs automatycznie dodają odpowiednie nagłówki autoryzacji.

## Funkcje w kodzie

### `cleanupExpiredReservations()` - `lib/firestore.js`
Główna funkcja czyszcząca:
- Pobiera wszystkie oczekujące rezerwacje
- Filtruje te starsze niż 24 godziny
- Usuwa je z bazy danych
- Zwraca szczegółowe statystyki

### Panel administracyjny
- `checkExpiredReservations()` - sprawdza statystyki
- `cleanupExpiredReservations()` - uruchamia czyszczenie z panelu

## Logi

System loguje każdą operację:

```javascript
console.log('Usunięto przeterminowaną rezerwację:', {
  id: 'xyz123',
  guest: 'Jan Kowalski',
  email: 'jan@example.com',
  createdAt: '2024-01-01T10:00:00.000Z',
  hoursExpired: 26
});
```

## Testowanie

### Ręczne testowanie
1. Zaloguj się do panelu admina
2. Sprawdź czy są przeterminowane rezerwacje
3. Użyj przycisku "Usuń przeterminowane"

### API testowanie
```bash
# Sprawdź statystyki
curl https://twoja-domena.com/api/cleanup-expired-reservations

# Uruchom czyszczenie
curl -X POST https://twoja-domena.com/api/cleanup-expired-reservations
```

## Uwagi

- Funkcja jest bezpieczna - usuwa tylko rezerwacje ze statusem `oczekujaca`
- Potwierdzone i odrzucone rezerwacje nie są nigdy usuwane
- System jest odporny na błędy - jeśli usunięcie którejś rezerwacji się nie powiedzie, pozostałe będą nadal usunięte
- Operacja jest asynchroniczna i nie blokuje innych funkcji systemu 