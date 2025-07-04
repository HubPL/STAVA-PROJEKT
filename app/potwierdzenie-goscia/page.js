'use client';

import Link from 'next/link';

export default function PotwierdzenieGosciaPage() {
  return (
    <div className="min-h-screen bg-[#FFF9E8] py-40 px-6 sm:px-8 lg:px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-widest uppercase mb-6 font-lumios text-[#3c3333]">
            Dziękujemy za Twoje zapytanie!
          </h1>
          <p className="text-lg tracking-wider text-[#3c3333]">
            Twoja prośba o rezerwację została otrzymana pomyślnie.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Pole statusu */}
          <div className="bg-amber-50 border-amber-200 border-2 rounded-2xl p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-[#3c3333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-lumios text-[#3c3333] mb-4">
              Rezerwacja oczekuje na potwierdzenie
            </h2>
            <p className="text-lg font-inter text-[#3c3333]">
              Twoja prośba o rezerwację została przyjęta i oczekuje na potwierdzenie przez nasz zespół.
            </p>
          </div>

          {/* Informacje o następnych krokach */}
          <div className="bg-white shadow-xl rounded-3xl border border-[#3c3333]/20 p-8 mb-8">
            <h3 className="text-2xl font-lumios text-[#3c3333] mb-6">
              Co dzieje się dalej?
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#3c3333] text-[#FFF9E8] rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#3c3333] mb-2">Email potwierdzający</h4>
                  <p className="text-[#3c3333]">
                    Wysłaliśmy Ci email z podsumowaniem Twojej prośby o rezerwację. Sprawdź swoją skrzynkę odbiorczą (również folder spam).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#3c3333] text-[#FFF9E8] rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#3c3333] mb-2">Opłata rezerwacji</h4>
                  <p className="text-[#3c3333]">
                    Aby potwierdzić rezerwację, musisz ją opłacić w ciągu <strong>24 godzin</strong>. Po opłaceniu otrzymasz maila potwierdzającego rezerwację.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#3c3333] text-[#FFF9E8] rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#3c3333] mb-2">Ostateczne potwierdzenie</h4>
                  <p className="text-[#3c3333]">
                    Wyślemy Ci email z ostatecznym potwierdzeniem lub informacją o braku dostępności, wraz ze szczegółami dotyczącymi przyjazdu i zameldowania.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informacje kontaktowe */}
          <div className="bg-[#FFF9E8]/30 rounded-2xl p-6 mb-8 border border-[#3c3333]/20">
            <h4 className="text-lg font-lumios font-semibold text-[#3c3333] mb-4">Masz pytania?</h4>
            <div className="space-y-3 text-[#3c3333] font-inter">
              <p>
                📧 <strong>Email:</strong> kontakt@stavakiszewa.pl
              </p>
              <p>
                📞 <strong>Telefon:</strong> +48 886 627 447
              </p>
              <p>
                📍 <strong>Adres:</strong> ul. Wygonińska 38, 83-430 Stara Kiszewa
              </p>
              <p className="text-sm italic">
                Chętnie odpowiemy na wszystkie pytania dotyczące Twojej rezerwacji!
              </p>
            </div>
          </div>



          {/* Linki akcji */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-6 py-3 bg-[#3c3333] hover:bg-[#3c3333]/90 text-white font-montserrat font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Wróć na stronę główną
            </Link>
            <Link 
              href="/domki" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-[#3c3333]/20 text-[#3c3333] hover:bg-[#FFF9E8]/30 font-montserrat font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Zobacz nasze domki
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
