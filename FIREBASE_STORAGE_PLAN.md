# 📁 Plan Struktury Firebase Storage

## 🎯 Status: Placeholdery usunięte, gotowe do dodania obrazów

### ✅ Zaktualizowane w kodzie:
1. **Rezerwacja:** Placeholder domku → Firebase Storage fallback
2. **Kontakt:** Placeholder mapy → Piękny design z mapą tła

---

## 📊 Struktura do Implementacji

```
Firebase Storage Root:
/
├── global/                           # 🔴 PILNE - Fallback images
│   ├── domek-placeholder.jpg         # Fallback gdy brak zdjęcia domku
│   ├── mapa-stara-kiszewa.jpg        # Tło mapy w kontakcie
│   ├── logo.png                      # ✅ Już istnieje
│   ├── logo-text.png                 # ✅ Już istnieje
│   └── favicon.ico                   # ✅ Już istnieje
├── domki/                            # 🔴 GŁÓWNE ZDJĘCIA
│   ├── {domekId}/
│   │   ├── main.jpg                  # Główne zdjęcie (1920x1080)
│   │   ├── 1.jpg                     # Galeria (1200x800)
│   │   ├── 2.jpg                     # Galeria (1200x800)
│   │   └── ... (do 10.jpg)           # Max 10 zdjęć galerii
└── galeria/                          # 🔴 GALERIA PUBLICZNA
    ├── okolica/
    │   ├── 1.jpg                     # Zdjęcia okolicy (1200x800)
    │   ├── 2.jpg
    │   └── ... (do 15.jpg)           # Max 15 zdjęć
    └── osrodek/
        ├── 1.jpg                     # Zdjęcia ośrodka (1200x800)
        ├── 2.jpg
        └── ... (do 15.jpg)           # Max 15 zdjęć
```

---

## 🚨 NAJPILNIEJSZE DO DODANIA:

### 1. **Global Fallbacks** (2 pliki):
```
/global/domek-placeholder.jpg        # Użyte w: app/rezerwacja/page.js:151
/global/mapa-stara-kiszewa.jpg       # Użyte w: app/kontakt/page.js:83
```

### 2. **Sprawdź ID domków w Firestore:**
```javascript
// Sprawdź w Firebase Console → Firestore → Collection "domki"
// Pobierz document IDs, np: "domek1", "domek2", "lux", "standard"
```

### 3. **Dla każdego domku:**
```
/domki/{domekId}/main.jpg            # KRYTYCZNE - główne zdjęcie
/domki/{domekId}/1.jpg               # Opcjonalne - galeria
/domki/{domekId}/2.jpg               # Opcjonalne - galeria
... (do 10.jpg)
```

---

## 📐 Specyfikacje Obrazów:

### **Główne zdjęcia domków** (`main.jpg`):
- **Wymiary:** 1920×1080 px (16:9)
- **Format:** JPG
- **Jakość:** 80-85%
- **Rozmiar:** ~200-400KB
- **Styl:** Landscape, pokazuje cały domek

### **Galeria domków** (`1.jpg - 10.jpg`):
- **Wymiary:** 1200×800 px (3:2)
- **Format:** JPG
- **Jakość:** 75-80%
- **Rozmiar:** ~150-250KB
- **Styl:** Wnętrza, szczegóły, widoki

### **Galeria okolica/ośrodek**:
- **Wymiary:** 1200×800 px (3:2)
- **Format:** JPG
- **Jakość:** 75-80%
- **Rozmiar:** ~150-250KB
- **Styl:** Krajobraz, natura, infrastruktura

### **Fallback images**:
- **domek-placeholder.jpg:** 400×300 px, neutralny domek
- **mapa-stara-kiszewa.jpg:** 800×600 px, mapa/satellite view

---

## 🔧 Jak Aplikacja Używa Obrazów:

### **Lista domków** (`/domki`):
```javascript
// Jeśli domek ma zdjecieGlowne → używa getStorageUrl()
// Jeśli nie → pokazuje 🏡 fallback
const imageUrl = await getStorageUrl(domek.zdjecieGlowne);
```

### **Szczegóły domku** (`/domek/[id]`):
```javascript
// Main image: /domki/{id}/main.jpg
const mainImg = await getStorageUrl(`domki/${data.id}/main.jpg`);

// Gallery: /domki/{id}/1.jpg, 2.jpg, etc.
for (let i = 1; i <= 10; i++) {
  getStorageUrl(`domki/${data.id}/${i}.jpg`);
}
```

### **Galeria publiczna** (`/galeria`):
```javascript
// Okolica: /galeria/okolica/1.jpg - 15.jpg
getStorageUrl(`galeria/okolica/${i + 1}.jpg`);

// Ośrodek: /galeria/osrodek/1.jpg - 15.jpg  
getStorageUrl(`galeria/osrodek/${i + 1}.jpg`);
```

### **Rezerwacja** (`/rezerwacja`):
```javascript
// Fallback: /global/domek-placeholder.jpg
src={domek.zdjecieGlowneURL || 'https://firebasestorage...domek-placeholder.jpg'}
```

---

## 📋 TODO dla Implementacji:

### Krok 1: Sprawdź Firestore
```bash
# W Firebase Console:
# 1. Firestore Database
# 2. Collection "domki"
# 3. Zanotuj wszystkie document IDs
```

### Krok 2: Przygotuj obrazy
```bash
# Potrzebujesz:
# - 2 fallback images (global/)
# - N × 11 images dla domków (N = liczba domków)
# - 30 images galerii (15 okolica + 15 ośrodek)
```

### Krok 3: Upload do Firebase Storage
```bash
# Struktura jak w planie powyżej
# Zachowaj dokładnie te nazwy plików!
```

### Krok 4: Test
```bash
# Sprawdź czy wszystkie strony ładują obrazy:
# - / (strona główna)
# - /domki (lista)
# - /domek/{id} (szczegóły)
# - /galeria (galeria)
# - /rezerwacja?domek={id} (rezerwacja)
# - /kontakt (kontakt)
```

---

## 🎨 Sugerowane Źródła Obrazów:

### Tymczasowe (do testów):
- **Unsplash.com:** cabins, forest, nature, lake
- **Pexels.com:** wooden house, forest cabin, nature
- **Pixabay.com:** cottage, vacation home

### Kategorie do wyszukania:
```
Domki: "wooden cabin", "forest cottage", "vacation rental"
Okolica: "polish forest", "lake view", "nature landscape" 
Ośrodek: "resort exterior", "wooden buildings", "recreation center"
Fallback: "simple wooden house", "cottage icon"
Mapa: "stara kiszewa poland" lub screenshot z Google Maps
```

---

## ⚡ Krytyczne Pliki (minimum do działania):

```
/global/domek-placeholder.jpg        # MUST HAVE
/global/mapa-stara-kiszewa.jpg       # MUST HAVE  
/domki/{pierwszyDomekId}/main.jpg    # MUST HAVE dla testów
```

**Po dodaniu tych 3 plików aplikacja będzie w pełni funkcjonalna!**

---

## 📱 Test Flow:

1. Upload minimum 3 pliki powyżej
2. Test `/rezerwacja?domek={id}` → fallback image
3. Test `/kontakt` → mapa tła
4. Test `/domek/{id}` → main image lub fallback
5. Dodaj więcej obrazów stopniowo

**Status: Gotowe do implementacji! 🚀** 