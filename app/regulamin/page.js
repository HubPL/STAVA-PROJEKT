import React from 'react';

export default function RegulaminPage() {
  return (
    <div className="max-w-3xl mx-auto py-32 px-2 text-[#3c3333]">
      <h1 className="text-3xl font-bold mb-8">Regulamin pobytu</h1>
      <div className="space-y-6 text-lg">
        <div>
          Dokonując rezerwacji akceptują Państwo regulamin pobytu na terenie obiektu.<br/>
          Doba hotelowa rozpoczyna się o godzinie 15:00, kończy o 11:00 dnia następnego.<br/>
          Kwota za pobyt zawiera: media, parking (max dwa auta przy każdym domku), pościel, ręczniki, szlafroki, kosmetyki (mydło do rąk oraz żel pod prysznic).<br/>
          Na terenie obiektu obowiązuje cisza nocna od godziny 22:00 do 7:00.
        </div>
        <ol className="list-decimal ml-6 space-y-2">
          <li>W przypadku konieczności skrócenia pobytu przez gości z przyczyn niezależnych od Wynajmującego, koszt za niewykorzystany czas pobytu nie jest zwracany.</li>
          <li>W sytuacji rezygnacji z rezerwowanego domku opłata nie podlega zwrotowi.</li>
          <li>Z domków znajdujących się na terenie obiektu mogą korzystać jedynie osoby obecne przy rezerwacji.</li>
          <li>Na terenie obiektu obowiązuje całkowity zakaz palenia z wyłączeniem stref do tego przeznaczonych.</li>
          <li>Na terenie obiektu obowiązuje całkowity zakaz używania materiałów pirotechnicznych oraz otwartego ognia, a także zakaz korzystania z urządzeń zasilanych gazem niebędących wyposażeniem obiektu.</li>
          <li>W przypadku rażącego naruszenia regulaminu, Wynajmujący ma prawo odmówić dalszego świadczenia usług, a goście zobowiązani są niezwłocznie opuścić obiekt bez zwrotu kosztów pobytu.</li>
          <li>Goście proszeni są o segregację odpadów i dbałość o pozostawienie domku w należytym stanie.</li>
          <li>W przypadku zgubienia kluczy do domku zostanie naliczona opłata w wysokości 300 zł.</li>
          <li>Wynajmujący nie ponosi odpowiedzialności za rzeczy utracone oraz przedmioty pozostawione w domku oraz na terenie obiektu.</li>
          <li>W przypadku powstania szkody z winy gości, Wynajmujący ma prawo żądać rekompensaty finansowej pokrywającej wartość naprawy lub wymiany uszkodzonego mienia.</li>
          <li>W sprawach nieuregulowanych w niniejszym Regulaminie zastosowanie mają odpowiednie przepisy Kodeksu Cywilnego oraz Ustawy o usługach turystycznych.</li>
        </ol>
      </div>
    </div>
  );
} 
