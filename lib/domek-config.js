// Statyczna konfiguracja domków - opisy, wyposażenie itp.
// Te dane nie zmieniają się często, więc trzymamy je w kodzie

export const DOMEK_INFO = {
  // Nazwa wyświetlana dla gości
  nazwa: "Domek w lesie Starej Kiszewy",
  
  // Opisy
  opisKrotki: "Dom całoroczny dwukondygnacyjny o powierzchni 67m² przeznaczony do wypoczynku dla 4-6 osób",
  
  opis: `Dom całoroczny dwukondygnacyjny o powierzchni 67m² przeznaczony do wypoczynku dla 4 osób 
z opcją do 6 osób (rozkładana sofa w salonie) - dodatkowa opłata za każdą osobę.

Salon oraz sypialnie posiadają duże przeszklenia z widokiem na las. Do dyspozycji gości są trzy 
tarasy zewnętrzne: dwa zadaszone oraz taras zewnętrzny (leśna wyspa SPA) wśród drzew, na którym 
znajdują się wanny kąpielowe opalane drewnem, zapewniające bezpośredni kontakt z naturą.`,
  
  // Udogodnienia
  udogodnienia: [
    "Duże przeszklenia z widokiem na las",
    "Sieć Wi-Fi",
    "Klimatyzacja (salon, kuchnia, obie sypialnie)",
    "Ogrzewanie podłogowe na parterze",
    "Kominek z rozprowadzeniem ciepła do sypialni",
    "Trzy tarasy zewnętrzne",
    "Wanny kąpielowe opalane drewnem",
    "Grill na węgiel drzewny",
    "Parasol grzewczy gazowy"
  ],
  
  // Wyposażenie domku
  wyposazenie: [
    "Kominek (jeden kosz drewna opałowego w cenie)",
    "Telewizor 58 cali",
    "Dwuosobowa rozkładana sofa",
    "Stół jadalny dla 4 osób",
    "Komplet naczyń i sztućców dla 6 osób",
    "Garnki i patelnie",
    "Czajnik",
    "Ekspres ciśnieniowy do kawy",
    "Mikrofalówka",
    "Toster",
    "Lodówka",
    "Zmywarka",
    "Piekarnik",
    "Płyta indukcyjna",
    "Pościel",
    "Ręczniki i szlafroki dla 4 osób",
    "Suszarka do włosów",
    "Dozownik żelu pod prysznic i mydło"
  ],
  
  // Pokoje i układ
  uklad: {
    sypialnie: 2,
    lazienki: 1,
    opis: `Parter: salon z jadalnią (20m²) połączony z kuchnią (4,5m²), łazienka (5,2m²) z prysznicem.
Piętro: dwie sypialnie - mniejsza (8,2m²) i większa (14,8m²) z miejscem do pracy/toaletką`,
    powierzchnia: "67m²",
    pietra: 2,
    szczegoly: {
      parter: {
        salon: "20m² z dwuosobową rozkładaną sofą, stołem jadalnym dla 4 osób, TV 58\", kominkiem",
        kuchnia: "4,5m² w pełni wyposażona",
        lazienka: "5,2m² z prysznicem, dozownikiem żelu, mydłem, ręcznikami i szlafrokami dla 4 osób, suszarką do włosów"
      },
      pietro: {
        sypialnia1: "8,2m² - dwuosobowa, możliwość ustawienia łóżek pojedynczych lub małżeńskiego",
        sypialnia2: "14,8m² - dwuosobowa z miejscem do pracy/toaletką, możliwość ustawienia łóżek pojedynczych lub małżeńskiego"
      }
    }
  },
  
  // Tarasy
  tarasy: {
    taras1: "20m² zadaszony z zestawem wypoczynkowym mebli ogrodowych dla 4 osób",
    taras2: "6m² zadaszony z zestawem dla 2 osób",
    taras3: "17m² leśna wyspa SPA wśród drzew z wannami kąpielowymi opalanym drewnem"
  },
  
  // Dodatkowe informacje
  dodatkoweInfo: {
    zameldowanie: "15:00",
    wymeldowanie: "11:00",
    maxOsob: "4 osoby (opcja do 6 osób - rozkładana sofa, dodatkowa opłata za każdą osobę)",
    zwierzeta: "Informacja dostępna po kontakcie",
    palenie: "Całkowity zakaz palenia wewnątrz domku",
    klimatyzacja: "Salon, kuchnia i obie sypialnie klimatyzowane",
    ogrzewanie: "Podłogowe na parterze wspomagane kominkiem z rozprowadzeniem ciepła do sypialni na piętrze oraz dodatkowa możliwość ogrzewania klimatyzacją z funkcją grzania"
  },
  
  // Zdjęcia (ścieżki do plików)
  galeria: [
    "/images/domek-1.jpg",
    "/images/domek-2.jpg",
    "/images/domek-3.jpg",
    "/images/domek-4.jpg",
    "/images/domek-5.jpg",
    "/images/domek-6.jpg"
  ]
};

// Funkcja pomocnicza do pobierania aktualnej ceny
export const getAktualnaCena = (config) => {
  if (!config?.ceny) return config?.cena_podstawowa || null;
  
  const dzis = new Date();
  
  // Sprawdź ceny sezonowe - poprawne porównanie dat
  const cenaSezonu = config.ceny.sezonowe?.find(sezon => {
    const sezonOd = new Date(sezon.od);
    const sezonDo = new Date(sezon.do);
    return dzis >= sezonOd && dzis <= sezonDo;
  });
  
  return cenaSezonu ? cenaSezonu.cena : config.ceny.podstawowa;
};

// Nowa funkcja do pobierania ceny dla konkretnej daty
export const getCenaWDniu = (config, data) => {
  if (!config?.ceny) return config?.cena_podstawowa || null;
  
  // Normalizuj datę sprawdzaną do formatu YYYY-MM-DD
  const sprawdzanaData = new Date(data);
  const sprawdzanaDataStr = sprawdzanaData.getFullYear() + '-' + 
    String(sprawdzanaData.getMonth() + 1).padStart(2, '0') + '-' + 
    String(sprawdzanaData.getDate()).padStart(2, '0');
  
  // Sprawdź ceny sezonowe dla konkretnej daty - porównanie stringów
  const cenaSezonu = config.ceny.sezonowe?.find(sezon => {
    return sprawdzanaDataStr >= sezon.od && sprawdzanaDataStr <= sezon.do;
  });
  
  return cenaSezonu ? cenaSezonu.cena : config.ceny.podstawowa;
};

// Funkcja do obliczania średniej ceny w terminie (jeśli różne sezony w okresie)
export const getCenaWTerminie = (config, dataOd, dataDo) => {
  if (!config?.ceny) return config?.cena_podstawowa || null;
  
  const od = new Date(dataOd);
  const do_ = new Date(dataDo);
  
  // Lista wszystkich dni w przedziale
  const dni = [];
  const obecnaData = new Date(od);
  
  while (obecnaData <= do_) {
    dni.push(new Date(obecnaData));
    obecnaData.setDate(obecnaData.getDate() + 1);
  }
  
  // Jeśli tylko jeden dzień, zwróć cenę dla tego dnia
  if (dni.length === 1) {
    return getCenaWDniu(config, dni[0]);
  }
  
  // Sprawdź czy wszystkie dni mają tę samą cenę
  const cenyDni = dni.map(dzien => getCenaWDniu(config, dzien));
  const unikalneCeny = [...new Set(cenyDni)];
  
  // Jeśli wszystkie dni mają tę samą cenę, zwróć ją
  if (unikalneCeny.length === 1) {
    return unikalneCeny[0];
  }
  
  // Jeśli różne ceny, zwróć średnią ważoną (tutaj prostą średnią)
  return Math.round(cenyDni.reduce((suma, cena) => suma + cena, 0) / cenyDni.length);
};

// Nowa funkcja do szczegółowego rozliczenia terminów z różnymi sezonami
export const getRozliczenieSezonowe = (config, dataOd, dataDo) => {
  if (!config?.ceny) return null;
  
  const od = new Date(dataOd);
  const do_ = new Date(dataDo);
  
  // Lista wszystkich nocy w przedziale (dni przyjazdu, ale nie wyjazdu)
  const dni = [];
  const obecnaData = new Date(od);
  
  while (obecnaData < do_) {  // ✅ Nie liczy dnia wyjazdu - tylko noce pobytu
    dni.push(new Date(obecnaData));
    obecnaData.setDate(obecnaData.getDate() + 1);
  }
  
  // Grupuj dni według cen/sezonów
  const grupy = {};
  
  dni.forEach(dzien => {
    const cena = getCenaWDniu(config, dzien);
    
    // Znajdź sezon dla tego dnia - używa porównania stringów
    const dzienStr = dzien.getFullYear() + '-' + 
      String(dzien.getMonth() + 1).padStart(2, '0') + '-' + 
      String(dzien.getDate()).padStart(2, '0');
      
    const sezon = config.ceny.sezonowe?.find(s => {
      return dzienStr >= s.od && dzienStr <= s.do;
    });
    
    const nazwaGrupy = sezon ? sezon.nazwa : 'Cena podstawowa';
    const klucz = `${nazwaGrupy}_${cena}`;
    
    if (!grupy[klucz]) {
      grupy[klucz] = {
        nazwa: nazwaGrupy,
        cena: cena,
        dni: 0,
        daty: []
      };
    }
    
    grupy[klucz].dni++;
    grupy[klucz].daty.push(dzien);
  });
  
  return Object.values(grupy);
};

// Nowa funkcja do kalkulacji ceny z uwzględnieniem liczby osób i konkretnych dat z sezonami
export const kalkulujCeneZOsobami = (config, liczbOsob, liczbaNocy = 1, dataOd = null, dataDo = null) => {
  if (!config?.ceny) return null;
  
  const bazowaLiczbaOsob = config.bazowa_liczba_osob || 4;
  const cenaZaDodatkowaOsoba = config.ceny.cena_za_dodatkowa_osoba || 0;
  const dodatkoweOsoby = Math.max(0, liczbOsob - bazowaLiczbaOsob);
  
  // Jeśli mamy konkretne daty, użyj szczegółowego rozliczenia
  if (dataOd && dataDo) {
    const rozliczenie = getRozliczenieSezonowe(config, dataOd, dataDo);
    
    if (!rozliczenie || rozliczenie.length === 0) {
      // Fallback na starą metodę
      const cenaBazowa = getCenaWTerminie(config, dataOd, dataDo);
      const oplataZaDodatkoweOsoby = dodatkoweOsoby * cenaZaDodatkowaOsoba;
      const cenaZaDobe = cenaBazowa + oplataZaDodatkoweOsoby;
      
      return {
        cenaBazowa,
        oplataZaDodatkoweOsoby,
        cenaZaDobe,
        cenaCałkowita: cenaZaDobe * liczbaNocy,
        dodatkoweOsoby,
        bazowaLiczbaOsob,
        cenaZaDodatkowaOsoba,
        rozliczenieSezonowe: null
      };
    }
    
    // Oblicz cenę całkowitą na podstawie szczegółowego rozliczenia
    let cenaCałkowita = 0;
    const szczegoly = rozliczenie.map(grupa => {
      const cenaBazowaGrupy = grupa.cena;
      const oplataZaDodatkoweOsobyGrupy = dodatkoweOsoby * cenaZaDodatkowaOsoba;
      const cenaZaDobeGrupy = cenaBazowaGrupy + oplataZaDodatkoweOsobyGrupy;
      const cenaGrupyCałkowita = cenaZaDobeGrupy * grupa.dni;
      
      cenaCałkowita += cenaGrupyCałkowita;
      
      return {
        nazwa: grupa.nazwa,
        cena: cenaBazowaGrupy,
        dni: grupa.dni,
        oplataZaDodatkoweOsoby: oplataZaDodatkoweOsobyGrupy,
        cenaZaDobe: cenaZaDobeGrupy,
        cenaCałkowita: cenaGrupyCałkowita
      };
    });
    
    // Oblicz średnią cenę za dobę dla kompatybilności
    const sredniaZaDobe = Math.round(cenaCałkowita / liczbaNocy);
    
    return {
      cenaBazowa: null, // Nie ma pojedynczej ceny bazowej
      oplataZaDodatkoweOsoby: dodatkoweOsoby * cenaZaDodatkowaOsoba,
      cenaZaDobe: sredniaZaDobe,
      cenaCałkowita: cenaCałkowita,
      dodatkoweOsoby,
      bazowaLiczbaOsob,
      cenaZaDodatkowaOsoba,
      rozliczenieSezonowe: szczegoly
    };
  }
  
  // Jeśli nie ma dat, użyj starej metody
  let cenaBazowa;
  if (dataOd) {
    cenaBazowa = getCenaWDniu(config, dataOd);
  } else {
    cenaBazowa = getAktualnaCena(config);
  }
  
  if (!cenaBazowa) return null;
  
  const oplataZaDodatkoweOsoby = dodatkoweOsoby * cenaZaDodatkowaOsoba;
  const cenaZaDobe = cenaBazowa + oplataZaDodatkoweOsoby;
  
  return {
    cenaBazowa,
    oplataZaDodatkoweOsoby,
    cenaZaDobe,
    cenaCałkowita: cenaZaDobe * liczbaNocy,
    dodatkoweOsoby,
    bazowaLiczbaOsob,
    cenaZaDodatkowaOsoba,
    rozliczenieSezonowe: null
  };
};

// Funkcja do wyświetlania szczegółów ceny (dla UI) - zaktualizowana
export const formatujSzczegolyCeny = (obliczenia) => {
  if (!obliczenia) return null;
  
  const szczegoly = [];
  
  // Jeśli mamy rozliczenie sezonowe, pokaż szczegóły
  if (obliczenia.rozliczenieSezonowe && obliczenia.rozliczenieSezonowe.length > 0) {
    obliczenia.rozliczenieSezonowe.forEach(sezon => {
      szczegoly.push({
        opis: `${sezon.nazwa} - ${sezon.dni} ${sezon.dni === 1 ? 'noc' : 'nocy'} × ${sezon.cena} PLN`,
        cena: sezon.cena * sezon.dni,
        typ: 'sezon'
      });
      
      if (sezon.oplataZaDodatkoweOsoby > 0) {
        szczegoly.push({
          opis: `+ ${obliczenia.dodatkoweOsoby} ${obliczenia.dodatkoweOsoby === 1 ? 'dodatkowa osoba' : 'dodatkowe osoby'} × ${sezon.dni} ${sezon.dni === 1 ? 'noc' : 'nocy'} × ${obliczenia.cenaZaDodatkowaOsoba} PLN`,
          cena: sezon.oplataZaDodatkoweOsoby * sezon.dni,
          typ: 'dodatkowe'
        });
      }
    });
  } else {
    // Klasyczne rozliczenie
    szczegoly.push({
      opis: `Cena bazowa za ${obliczenia.bazowaLiczbaOsob} ${obliczenia.bazowaLiczbaOsob === 1 ? 'osobę' : 'osoby'}`,
      cena: obliczenia.cenaBazowa,
      typ: 'bazowa'
    });
    
    if (obliczenia.dodatkoweOsoby > 0) {
      szczegoly.push({
        opis: `${obliczenia.dodatkoweOsoby} ${obliczenia.dodatkoweOsoby === 1 ? 'dodatkowa osoba' : 'dodatkowe osoby'} × ${obliczenia.cenaZaDodatkowaOsoba} PLN`,
        cena: obliczenia.oplataZaDodatkoweOsoby,
        typ: 'dodatkowe'
      });
    }
  }
  
  return szczegoly;
}; 