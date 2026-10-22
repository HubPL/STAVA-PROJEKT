# Przekazanie projektu STAVA - poradnik krok po kroku

Cel: nowy programista wprowadza poprawki w Claude Code, wypycha je na GitHub,
a Vercel automatycznie aktualizuje strone https://stavakiszewa.pl.
Nie potrzebuje dostepu do Vercela, Resend ani SMSApi.

---

## Czesc A - robi Hubert (wlasciciel)

### A1. Dodaj kolege do repozytorium GitHub
1. Wejdz na https://github.com/HubPL/STAVA-PROJEKT/settings/access
2. Kliknij **Add people**, wpisz login GitHub kolegi, potwierdz.
3. Kolega dostanie maila z zaproszeniem - musi je zaakceptowac.

Na prywatnym repo kolega dostaje prawo zapisu (push). To wystarcza do wrzucania zmian.

### A2. Sprawdz, czy Vercel wdrozy commity kolegi
Na planie Vercel **Hobby** deploy commitow od innej osoby niz wlasciciel moze
zostac zablokowany. Po pierwszym pushu kolegi sprawdz zakladke Deployments w Vercelu:
- jesli deploy przeszedl - nic nie trzeba robic,
- jesli jest zablokowany - albo kolega pracuje przez Pull Requesty, a Ty je scalasz
  (wtedy commit na `main` jest Twoj i deploy przechodzi), albo przejdz na plan Pro i dodaj go do zespolu.

### A3. Pobierz klucze z Vercela do pliku na pulpicie
Na swoim komputerze, w terminalu:

```bash
npm install -g vercel
vercel login
cd ~/Desktop
vercel link --project <nazwa-projektu-stava>   # wybierz swoj projekt STAVA
vercel env pull stava.env --environment=production
```

Na pulpicie powstanie plik `stava.env` z kluczami.
Zmienne oznaczone w Vercelu jako **Sensitive** przyjda puste - te przepisz recznie
z Vercel -> projekt -> Settings -> Environment Variables (lub z oryginalnych serwisow).
Porownaj z lista w `.env.example`, czy niczego nie brakuje.
Usun z `stava.env` linie zaczynajace sie od `VERCEL_` - lokalnie nie sa potrzebne.

### A4. Przekaz plik bezpiecznie
- Najlepiej: menedzer hasel (Bitwarden Send, 1Password) albo osobiscie na pendrive.
- Nie wysylaj kluczy zwyklym mailem, Messengerem ani nie wklejaj na czat.
- Po zakonczeniu wspolpracy wygeneruj nowe klucze (Resend, SMSApi, CLEANUP_API_KEY) i podmien w Vercelu.

---

## Czesc B - robi nowy programista

### B1. Przygotuj komputer
Zainstaluj:
- **Node.js 20 LTS** lub nowszy - https://nodejs.org
- **Git** - https://git-scm.com
- **Claude Code** - `npm install -g @anthropic-ai/claude-code`
  (potrzebne wlasne konto Claude z planem Pro/Max lub klucz API)

Skonfiguruj git (raz):
```bash
git config --global user.name "Imie Nazwisko"
git config --global user.email "twoj@email.pl"
```

Zaloguj sie do GitHuba z terminala (najprosciej przez GitHub CLI):
```bash
# https://cli.github.com
gh auth login
```

### B2. Pobierz kod
Zaakceptuj zaproszenie do repo z maila, potem:
```bash
cd ~/Projekty                 # dowolny folder
git clone https://github.com/HubPL/STAVA-PROJEKT.git
cd STAVA-PROJEKT
npm install
```

### B3. Wgraj klucze
Plik otrzymany od Huberta skopiuj do folderu projektu pod nazwa `.env.local`:
```bash
cp ~/Desktop/stava.env .env.local
```
Plik `.env.local` jest w `.gitignore` - nigdy nie trafi na GitHuba.

### B4. Uruchom strone lokalnie
```bash
npm run dev
```
Otworz http://localhost:3000. Panel admina: http://localhost:3000/panel
(logowanie kontem z Firebase Authentication).

**Uwaga:** lokalna wersja korzysta z produkcyjnej bazy Firebase i wysyla prawdziwe maile.
Testowe rezerwacje usuwaj po testach.

### B5. Uruchom Claude Code
```bash
claude
```
W repo jest plik `CLAUDE.md` - Claude Code czyta go automatycznie przy starcie
i zna strukture projektu, baze danych, konwencje i zasady wdrozenia.
Mozesz go rozbudowywac, gdy dowiesz sie czegos nowego o projekcie
(albo poproc Claude: "dopisz to do CLAUDE.md").

Pierwsze polecenie na rozgrzewke:
> Opisz mi ten projekt i pokaz, jak dziala proces rezerwacji.

### B6. Codzienna praca - jak wprowadzic poprawke
1. Pobierz najnowsza wersje: `git pull`
2. W Claude Code opisz zmiane, np. "zmien cene weekendowa w opisie oferty na ...".
3. Sprawdz zmiane lokalnie na http://localhost:3000.
4. Popros Claude: "uruchom npm run build i npm run lint, a jesli przejdzie - zrob commit i push na main".
5. Po 1-2 minutach Vercel sam zaktualizuje https://stavakiszewa.pl.

Wiekszych zmian nie wypychaj prosto na `main`. Popros Claude o nowa galaz i Pull Request -
Vercel zrobi dla niej podglad (preview) pod osobnym adresem, ktory mozna sprawdzic przed scaleniem.

### B7. Gdy cos pojdzie nie tak
- **Strona sie nie zaktualizowala** - build na Vercelu sie wysypal. Uruchom `npm run build` lokalnie i popraw bledy.
- **Trzeba cofnac zmiane** - w Claude Code: "cofnij ostatni commit przez git revert i wypchnij".
- **Brak dostepu przy push** - sprawdz, czy zaproszenie do repo zostalo zaakceptowane i czy `gh auth status` pokazuje zalogowanie.
- **Bledy Firebase lokalnie** - sprawdz, czy `.env.local` jest w glownym folderze projektu i ma wszystkie wartosci z `.env.example`.
