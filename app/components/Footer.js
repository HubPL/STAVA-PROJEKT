import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 bg-gradient-to-br from-stone-800 via-amber-900 to-stone-900 text-white overflow-hidden">

      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "url('/images/patch-texture.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto'
      }}></div>
      

      <div className="absolute top-10 left-10 w-32 h-32 bg-amber-700/10 rounded-full blur-3xl nature-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-800/10 rounded-full blur-3xl nature-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-stone-600/10 rounded-full blur-2xl nature-pulse" style={{animationDelay: '1s'}}></div>

      <div className="relative z-10">
        {/* Główna treść stopki */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            
            {/* Sekcja marki */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3 group">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🌲</span>
                <h3 className="text-3xl font-display font-bold text-amber-100">STAVA</h3>
              </div>
              <p className="text-stone-200 font-body leading-relaxed max-w-md">
                Ośrodek domków letniskowych w sercu <span className="font-semibold text-amber-100">Starej Kiszewy</span>. 
                Odkryj naturalne piękno Kaszub w komfortowych warunkach.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-stone-200">
                <span className="text-lg">📍</span>
                <span className="font-body text-sm">Stara Kiszewa, Pomorskie</span>
              </div>
            </div>
            
            {/* Linki nawigacyjne */}
            <div className="space-y-4">
              <h3 className="text-xl font-primary font-semibold text-amber-100 mb-4">Nawigacja</h3>
              <nav className="space-y-2">
                {[
                  { href: "/domki", label: "Domki", icon: "🏡" },
                  { href: "/galeria", label: "Galeria", icon: "📸" },
                  { href: "/kontakt", label: "Kontakt", icon: "📞" },
                  { href: "/regulamin", label: "Regulamin", icon: "📋" },
                  { href: "/polityka-prywatnosci", label: "Polityka Prywatności", icon: "🔒" },
                ].map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="group flex items-center justify-center md:justify-start gap-2 text-stone-200 hover:text-amber-100 transition-all duration-300 text-sm font-body py-1"
                  >
                    <span className="group-hover:scale-125 transition-transform duration-300">{link.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Kontakt i social media */}
            <div className="space-y-4">
              <h3 className="text-xl font-primary font-semibold text-amber-100 mb-4">Kontakt</h3>
              <div className="space-y-3">
                <a 
                  href="mailto:kontakt@stavakiszewa.pl" 
                  className="group flex items-center justify-center md:justify-start gap-2 text-stone-200 hover:text-amber-100 transition-all duration-300 text-sm font-body"
                >
                  <span className="text-lg group-hover:scale-125 transition-transform duration-300">✉️</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">kontakt@stavakiszewa.pl</span>
                </a>
                
                {/* Media społecznościowe */}
                <div className="pt-4">
                  <p className="text-stone-300 text-xs font-body mb-3">Śledź nas:</p>
                  <div className="flex justify-center md:justify-start space-x-4">
                    <a 
                      href="#" 
                      className="group w-10 h-10 bg-amber-800/20 rounded-full flex items-center justify-center hover:bg-amber-700/30 transition-all duration-300 hover:scale-110"
                    >
                      <span className="text-lg group-hover:scale-125 transition-transform duration-300">📘</span>
                    </a>
                    <a 
                      href="#" 
                      className="group w-10 h-10 bg-amber-800/20 rounded-full flex items-center justify-center hover:bg-amber-700/30 transition-all duration-300 hover:scale-110"
                    >
                      <span className="text-lg group-hover:scale-125 transition-transform duration-300">📷</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stopka z prawami autorskimi */}
        <div className="border-t border-stone-600/30 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-4 md:space-y-0">
              <p className="text-stone-300 text-sm font-body">
                &copy; {currentYear} <span className="font-semibold text-amber-200">STAVA Stara Kiszewa</span>. 
                Wszelkie prawa zastrzeżone.
              </p>
              
              <div className="flex items-center gap-2 text-stone-300 text-xs font-body">
                <span>Wykonane z</span>
                <span className="text-red-400 animate-pulse">❤️</span>
                <span>dla natury</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 