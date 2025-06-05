export default function RegulaminPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <article className="max-w-4xl mx-auto bg-white p-8 sm:p-10 shadow-md rounded-lg border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">
          Regulamin Pobytu w Ośrodku STAVA
        </h1>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mt-8 mb-3">I. Postanowienia Ogólne</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
          <li>Niniejszy regulamin określa warunki rezerwacji i pobytu w Ośrodku Domków Letniskowych STAVA, zlokalizowanym w Starej Kiszewie (dalej zwanym Ośrodkiem).</li>
          <li>Dokonanie rezerwacji jest jednoznaczne z zapoznaniem się i akceptacją postanowień niniejszego regulaminu.</li>
          <li>Osobą odpowiedzialną za kontakt z Gośćmi i zarządzanie Ośrodkiem jest [Imię i Nazwisko Gospodarza/Zarządcy], tel: [Numer Telefonu Gospodarza], e-mail: kontakt@stavakiszewa.pl. Prosimy o uzupełnienie tych danych.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mt-8 mb-3">II. Rezerwacja i Płatności</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
          <li>Rezerwacji można dokonać poprzez formularz na stronie internetowej [Adres Strony WWW - np. stavakiszewa.pl], telefonicznie lub mailowo.</li>
          <li>Warunkiem potwierdzenia rezerwacji jest wpłata zadatku w wysokości [np. 30%] całkowitej wartości pobytu w terminie [np. 3 dni robocze] od dnia dokonania rezerwacji wstępnej. Brak wpłaty w ustalonym terminie powoduje anulowanie rezerwacji wstępnej.</li>
          <li>Pozostałą część należności za pobyt należy uregulować [np. najpóźniej w dniu przyjazdu gotówką lub przelewem na wskazane konto bankowe przed przyjazdem]. Dane do przelewu: [Numer Konta], [Nazwa Banku], Odbiorca: [Nazwa Odbiorcy], Tytuł: [np. Rezerwacja STAVA + Nazwisko + Termin]. Prosimy o uzupełnienie.</li>
          <li>Minimalny okres rezerwacji wynosi 3 noce. W okresach specjalnych (np. wakacje, długie weekendy) minimalny okres może być dłuższy.</li>
          <li>Ceny za pobyt są cenami umownymi, podanymi w PLN i zawierają podatek VAT. Ośrodek zastrzega sobie prawo do zmiany cen.</li>
          <li>W przypadku rezygnacji z pobytu przez Gościa:
            <ul className="list-disc list-inside pl-5 mt-1 space-y-1">
              <li>na więcej niż [np. 30 dni] przed planowanym przyjazdem – zadatek podlega zwrotowi w całości (pomniejszony o ewentualne koszty transakcyjne).</li>
              <li>pomiędzy [np. 29 a 14 dni] przed planowanym przyjazdem – zadatek podlega zwrotowi w [np. 50%].</li>
              <li>na mniej niż [np. 14 dni] przed planowanym przyjazdem lub w trakcie pobytu – zadatek nie podlega zwrotowi, a Gość może zostać obciążony pełną kwotą za zarezerwowany okres, jeśli Ośrodek nie zdoła wynająć domku innemu Gościowi.</li>
            </ul>
          </li>
          <li>Skrócenie pobytu z przyczyn niezależnych od Ośrodka nie skutkuje zwrotem opłaty za niewykorzystane dni.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mt-8 mb-3">III. Warunki Pobytu</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
          <li>Doba hotelowa rozpoczyna się o godzinie [np. 16:00] w dniu przyjazdu i kończy o godzinie [np. 10:00] w dniu wyjazdu. Ewentualne zmiany godzin przyjazdu/wyjazdu są możliwe po wcześniejszym uzgodnieniu z Gospodarzem.</li>
          <li>Goście zobowiązani są do okazania dokumentu tożsamości ze zdjęciem w celu zameldowania oraz uregulowania wszelkich formalności.</li>
          <li>Przekazanie i odbiór domku odbywa się w obecności przedstawiciela Ośrodka. Prosimy o sprawdzenie stanu wyposażenia domku przy zameldowaniu i zgłoszenie ewentualnych braków lub uszkodzeń.</li>
          <li>Goście ponoszą pełną odpowiedzialność materialną za wszelkiego rodzaju uszkodzenia lub zniszczenia wyposażenia i urządzeń technicznych domku, powstałe z ich winy lub winy osób ich odwiedzających. Szkody powinny być zgłaszane Gospodarzowi niezwłocznie. Koszt naprawy szkód pokrywa Gość.</li>
          <li>Wszelkie usterki zauważone w trakcie użytkowania domku prosimy niezwłocznie zgłaszać Gospodarzowi.</li>
          <li>W domkach obowiązuje całkowity zakaz palenia tytoniu oraz używania otwartego ognia poza miejscami do tego wyznaczonymi (np. grill, miejsce na ognisko). Nieprzestrzeganie zakazu może skutkować naliczeniem kary umownej w wysokości [np. 500 PLN].</li>
          <li>Cisza nocna obowiązuje od godziny [np. 22:00] do godziny [np. 7:00]. Prosimy o uszanowanie spokoju innych Gości.</li>
          <li>Prosimy o zachowanie porządku i czystości w domkach oraz na terenie Ośrodka. Śmieci należy segregować zgodnie z instrukcją i wyrzucać do wyznaczonych pojemników.</li>
          <li>Pobyt zwierząt domowych jest możliwy wyłącznie po wcześniejszym uzgodnieniu z Gospodarzem i za dodatkową opłatą w wysokości [np. 30 PLN/doba/zwierzę]. Właściciele zwierząt są zobowiązani do sprzątania po swoich pupilach, posiadania aktualnej książeczki szczepień oraz zapewnienia, że zwierzęta nie zakłócają spokoju innych Gości i nie niszczą mienia Ośrodka. Zwierzęta na terenie Ośrodka muszą być trzymane na smyczy.</li>
          <li>Ośrodek nie ponosi odpowiedzialności za rzeczy wartościowe pozostawione w domkach lub na terenie Ośrodka. Prosimy o zamykanie domków i okien podczas nieobecności.</li>
          <li>Parking na terenie Ośrodka jest bezpłatny, niestrzeżony. Ośrodek nie ponosi odpowiedzialności za uszkodzenie lub utratę pojazdu oraz rzeczy w nim pozostawionych.</li>
          <li>Osoby niezameldowane w Ośrodku mogą przebywać na jego terenie wyłącznie za zgodą Gospodarza i nie dłużej niż do godziny [np. 22:00].</li>
          <li>Korzystanie z dodatkowych atrakcji Ośrodka (np. plac zabaw, miejsce na ognisko) odbywa się na własną odpowiedzialność Gości i zgodnie z zasadami bezpieczeństwa. Rodzice/opiekunowie są odpowiedzialni za bezpieczeństwo dzieci.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mt-8 mb-3">IV. Postanowienia Końcowe</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
          <li>W przypadku rażącego naruszenia regulaminu, Ośrodek ma prawo do natychmiastowego wymeldowania Gości bez zwrotu kosztów pobytu oraz do dochodzenia odszkodowania za poniesione straty.</li>
          <li>W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają odpowiednie przepisy polskiego Kodeksu Cywilnego.</li>
          <li>Wszelkie spory będą rozstrzygane polubownie, a w przypadku braku porozumienia, przez sąd właściwy dla siedziby Ośrodka.</li>
          <li>Regulamin wchodzi w życie z dniem [DD.MM.RRRR - Uzupełnij datę wejścia w życie].</li>
        </ol>
        <p className="mt-8 text-sm text-gray-700">
          Życzymy miłego pobytu!<br />Zespół STAVA Kiszewa
        </p>
      </article>
    </div>
  );
} 