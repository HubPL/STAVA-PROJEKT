import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section z leśnym klimatem */}
      <section className="relative min-h-[80vh] section-forest texture-forest">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-800/20 via-transparent to-amber-800/10"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-amber-700 rounded-full opacity-40 nature-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-orange-800 rounded-full opacity-30 nature-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-stone-700 rounded-full opacity-50 nature-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="relative z-10 min-h-[80vh] flex flex-col justify-center items-center text-center px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-display text-stone-800 mb-6 heading-forest">
              Witaj w <span className="text-amber-800">STAVA</span>
            </h1>
            <p className="text-xl md:text-2xl font-primary text-stone-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Odkryj urokliwe domki letniskowe w sercu <span className="font-semibold text-stone-800">Starej Kiszewy</span>, 
              otoczone naturą i spokojem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/domki" className="btn-forest text-lg px-8 py-4 nature-pulse">
                🏡 Zobacz Nasze Domki
              </Link>
              <Link href="/kontakt" className="btn-forest-outline text-lg px-8 py-4">
                📞 Skontaktuj się z nami
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-stone-600 animate-bounce">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
        </div>
      </section>

      {/* Opis Ośrodka Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto text-center max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-display text-stone-800 mb-8 heading-forest">
            Poznaj Nasz Ośrodek
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <p className="text-lg font-body text-stone-700 leading-relaxed">
                <span className="font-display text-2xl text-stone-800">STAVA</span> to idealne miejsce na wypoczynek 
                dla rodzin, par oraz grup przyjaciół ceniących sobie bliskość natury, komfort i wysoką jakość obsługi.
              </p>
              <p className="text-lg font-body text-stone-700 leading-relaxed">
                Nasze domki są w pełni wyposażone, aby zapewnić Ci niezapomniany pobyt. 
                Oferujemy <span className="font-semibold text-stone-800">ciszę, spokój</span> oraz liczne atrakcje 
                w okolicy, które umilą Twój czas wolny.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-stone-700">
                  <span className="text-2xl">🌲</span>
                  <span className="font-medium">Las tuż obok</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <span className="text-2xl">🏞️</span>
                  <span className="font-medium">Jezioro w pobliżu</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <span className="text-2xl">🏡</span>
                  <span className="font-medium">Komfortowe domki</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="card-forest p-8 text-center">
                <div className="text-6xl mb-4">🌿</div>
                <h3 className="text-2xl font-display text-stone-800 mb-4">Naturalne piękno</h3>
                <p className="text-stone-700 font-body">
                  Poczuj harmonię z naturą w malowniczym zakątku Kaszub, 
                  gdzie każdy oddech jest pełen świeżego leśnego powietrza.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 section-forest">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display text-stone-800 text-center mb-16 heading-forest">
            Dlaczego wybrać STAVA?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card-forest p-8 text-center group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🏡</div>
              <h3 className="text-2xl font-primary font-semibold text-stone-800 mb-4">Komfortowe Domki</h3>
              <p className="text-stone-700 font-body leading-relaxed">
                Każdy domek to mała oaza komfortu z pełnym wyposażeniem, 
                gdzie poczujesz się jak w domu.
              </p>
            </div>
            
            <div className="card-forest p-8 text-center group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🌲</div>
              <h3 className="text-2xl font-primary font-semibold text-stone-800 mb-4">Bliskość Natury</h3>
              <p className="text-stone-700 font-body leading-relaxed">
                Bezpośredni dostęp do lasów i szlaków turystycznych. 
                Idealne miejsce na aktywny wypoczynek.
              </p>
            </div>
            
            <div className="card-forest p-8 text-center group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">⭐</div>
              <h3 className="text-2xl font-primary font-semibold text-stone-800 mb-4">Wysoka Jakość</h3>
              <p className="text-stone-700 font-body leading-relaxed">
                Dbamy o każdy detal, aby Twój pobyt był wyjątkowy 
                i pozostał w pamięci na długo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
