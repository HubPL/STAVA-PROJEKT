'use client';

import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { getConfig } from '@/lib/firestore';
import { DOMEK_INFO, getAktualnaCena, kalkulujCeneZOsobami } from '@/lib/domek-config';
import { getStorageUrl } from '@/lib/storage';
import { DOMEK_IMAGES, getDomekImages } from '@/lib/image-paths';
import OptimizedImage from '../components/OptimizedImage';
import DynamicImage from '../components/DynamicImage';
import Lightbox from '../components/Lightbox';
import useLightbox from '../hooks/useLightbox';
import { FiUsers, FiHome, FiMaximize, FiCheckCircle, FiCalendar, FiDollarSign } from 'react-icons/fi'; // Ikony

// Funkcja do pobierania zdjęć z folderu
async function getImagesFromPath(path) {
    const storage = getStorage();
    const folderRef = ref(storage, path);
    try {
        const imageRefs = await listAll(folderRef);
        return Promise.all(imageRefs.items.map(item => getDownloadURL(item)));
    } catch (error) {
                        // Fallback to default images
        return [];
    }
}

// Funkcja do formatowania daty
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Komponent tabeli cen sezonowych
const TabelaCenSezonowych = ({ config }) => {
    if (!config?.ceny?.sezonowe || config.ceny.sezonowe.length === 0) {
        return (
            <div className="text-center text-gray-500">
                <p>Aktualnie obowiązuje jedna cena przez cały rok.</p>
            </div>
        );
    }

    // Pobierz cenę podstawową z bazy danych
    const cenaPostawowa = config.ceny.podstawowa || config.cena_podstawowa;

    // Jeśli nie ma ceny w bazie, pokaż komunikat
    if (!cenaPostawowa) {
        return (
            <div className="text-center text-gray-500">
                <p>Brak informacji o cenach. Skontaktuj się z nami po aktualne ceny.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-[#3c3333]">
                        <th className="text-left py-3 font-lumios text-lg">Sezon</th>
                        <th className="text-left py-3 font-lumios text-lg">Okres</th>
                        <th className="text-right py-3 font-lumios text-lg">Różnica cenowa</th>
                    </tr>
                </thead>
                <tbody>
                    {config.ceny.sezonowe.map((sezon, index) => {
                        const roznica = sezon.cena - cenaPostawowa;
                        const roznicaText = roznica > 0 ? `+${roznica} zł` : `${roznica} zł`;
                        const roznicaColor = roznica > 0 ? 'text-orange-600' : roznica < 0 ? 'text-green-600' : 'text-gray-600';
                        
                        return (
                            <tr key={index} className="border-b border-[#3c3333]/20 hover:bg-[#fdf2d0]/50 transition-colors">
                                <td className="py-4 font-medium">{sezon.nazwa}</td>
                                <td className="py-4 text-gray-600">
                                    {formatDate(sezon.od)} - {formatDate(sezon.do)}
                                </td>
                                <td className={`py-4 text-right font-semibold ${roznicaColor}`}>
                                    {roznicaText}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
                            <div className="mt-4 p-4 bg-[#fdf2d0]/50 rounded-lg">
                <p className="text-sm text-gray-600">
                    <FiDollarSign className="inline mr-2" />
                    Cena podstawowa: <strong>{cenaPostawowa} zł za dobę</strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    * Ceny mogą się różnić w zależności od sezonu i dostępności
                </p>
            </div>
        </div>
    );
};

export default function OfertaPage() {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);

    // Przygotuj obrazy domków
    const prepareImages = async () => {
        const domekPaths = getDomekImages();
        const imagePromises = domekPaths.map(async (path, index) => {
            try {
                const url = await getStorageUrl(path);
                const isExterior = path.includes('ext-');
                return {
                    id: `domek-${index + 1}`,
                    src: url,
                    alt: isExterior ? `Domek STAVA - widok zewnętrzny ${index + 1}` : `Domek STAVA - wnętrze ${index + 1}`,
                    title: isExterior ? `Exterior ${index + 1}` : `Interior ${index + 1}`,
                    category: isExterior ? 'exterior' : 'interior',
                };
            } catch (error) {
                console.warn(`Nie można załadować obrazu: ${path}`);
                return null;
            }
        });

        const loadedImages = await Promise.all(imagePromises);
        return loadedImages.filter(img => img !== null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Pobierz konfigurację i obrazy równolegle
                const [configData, preparedImages] = await Promise.all([
                    getConfig(),
                    prepareImages()
                ]);
                
                setConfig(configData);
                setImages(preparedImages);
                
            } catch (err) {
                console.error('Błąd podczas pobierania danych:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Lightbox hook
    const lightbox = useLightbox(images);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdf2d0] flex items-center justify-center font-serif text-[#3c3333]">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-[#3c3333] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl tracking-widest">Ładowanie oferty...</p>
                </div>
            </div>
        );
    }

    const aktualnaCena = config ? getAktualnaCena(config) : 380;

    return (
        <>
            <Head>
                <title>Komfortowe Domki Letniskowe | STAVA Stara Kiszewa</title>
                <meta name="description" content="Luksusowe domki letniskowe w sercu lasu kaszubskiego. 67m², 2 sypialnie, sauna, balia, 3 tarasy. Rezerwuj pobyt w naturze na Kaszubach. Od 350 PLN/doba." />
                <meta name="keywords" content="domki letniskowe Stara Kiszewa, domki na Kaszubach, domki w lesie, sauna, balia, wypoczynek w naturze, noclegi Kaszuby" />
                <meta property="og:title" content="Komfortowe Domki Letniskowe w Lesie | STAVA" />
                <meta property="og:description" content="67m² domek z sauną, balią i 3 tarasami w sercu lasu kaszubskiego. Idealne miejsce na wypoczynek z dala od zgiełku." />
                <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/domek%2Fext-1.jpg?alt=media" />
                <meta property="og:url" content="https://stavakiszewa.pl/domki" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://stavakiszewa.pl/domki" />
            </Head>
            <div className="bg-[#fdf2d0] font-serif text-[#3c3333] pt-32">
            {/* 1. GALERIA ZDJĘĆ */}
            <section className="container mx-auto px-4 pt-10 pb-16">
                {images.length > 0 ? (
                    <div className="space-y-6">
                        {/* Główne zdjęcie */}
                        <div 
                            className="rounded-lg overflow-hidden group cursor-pointer relative aspect-[16/9] mx-auto max-w-4xl"
                            onClick={() => lightbox.openLightbox(0)}
                        >
                            <OptimizedImage 
                                src={images[0]?.src} 
                                alt={images[0]?.alt}
                                width={1200}
                                height={675}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                            {/* Overlay z informacją o liczbie zdjęć */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
                                    {images.length} {images.length === 1 ? 'zdjęcie' : images.length <= 4 ? 'zdjęcia' : 'zdjęć'}
                                </div>
                            </div>
                        </div>
                        
                        {/* Małe thumbnails */}
                        {images.length > 1 && (
                            <div className="max-w-4xl mx-auto">
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {images.slice(1).map((image, index) => (
                                        <div key={image.id} className="flex-shrink-0 w-20 h-20">
                                            <DynamicImage
                                                src={image.src}
                                                alt={image.alt}
                                                fixedAspectRatio="aspect-square"
                                                onClick={() => lightbox.openLightbox(index + 1)}
                                                className="transition-all duration-300 hover:scale-105 w-full h-full"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-[60vh] bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-xl text-gray-500">Ładowanie zdjęć domków...</p>
                    </div>
                )}
            </section>
            
            {/* 2. MAIN CONTENT */}
            <section className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl tracking-wider mb-4 font-lumios">{DOMEK_INFO.nazwa}</h1>
                            <p className="text-lg leading-relaxed tracking-wide whitespace-pre-line">{DOMEK_INFO.opis}</p>
                        </div>

                        {/* Układ przestrzenny */}
                        <div>
                            <h2 className="text-3xl tracking-wider mb-8 font-lumios">Układ przestrzenny</h2>
                            <div className="bg-[#ffffff] p-6 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-lg mb-4">{DOMEK_INFO.uklad.opis}</p>
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <h3 className="font-semibold text-xl mb-3">Parter:</h3>
                                    <ul className="space-y-2">
                                        <li>• <strong>Salon z jadalnią:</strong> {DOMEK_INFO.uklad.szczegoly.parter.salon}</li>
                                        <li>• <strong>Kuchnia:</strong> {DOMEK_INFO.uklad.szczegoly.parter.kuchnia}</li>
                                        <li>• <strong>Łazienka:</strong> {DOMEK_INFO.uklad.szczegoly.parter.lazienka}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl mb-3">Piętro:</h3>
                                    <ul className="space-y-2">
                                        <li>• <strong>Sypialnia 1:</strong> {DOMEK_INFO.uklad.szczegoly.pietro.sypialnia1}</li>
                                        <li>• <strong>Sypialnia 2:</strong> {DOMEK_INFO.uklad.szczegoly.pietro.sypialnia2}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        </div>

                        {/* Udogodnienia */}
                        <div>
                             <h2 className="text-3xl tracking-wider mb-8 font-lumios">Co na Ciebie czeka?</h2>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                                {DOMEK_INFO.udogodnienia.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <FiCheckCircle className="text-xl text-green-700/70 flex-shrink-0" />
                                        <span className="tracking-wide">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tarasy i przestrzeń zewnętrzna */}
                        <div>
                            <h2 className="text-3xl tracking-wider mb-8 font-lumios">Tarasy i przestrzeń zewnętrzna</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-[#ffffff] p-5 rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-2">Taras główny</h3>
                                    <p>{DOMEK_INFO.tarasy.taras1}</p>
                                </div>
                                <div className="bg-[#ffffff] p-5 rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-2">Taras intymny</h3>
                                    <p>{DOMEK_INFO.tarasy.taras2}</p>
                                </div>
                                <div className="bg-[#ffffff] p-5 rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-2">Leśna wyspa SPA</h3>
                                    <p>{DOMEK_INFO.tarasy.taras3}</p>
                                </div>
                            </div>
                        </div>

                        {/* Wyposażenie */}
                        <div>
                             <h2 className="text-3xl tracking-wider mb-8 font-lumios">Wyposażenie domku</h2>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                                {DOMEK_INFO.wyposazenie.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-[#3c3333]/30 rounded-full flex-shrink-0"></span>
                                        <span className="tracking-wide">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ceny sezonowe */}
                        {(config?.ceny?.podstawowa || config?.cena_podstawowa) && (
                            <div id="tabela-cen">
                                <h2 className="text-3xl tracking-wider mb-8 font-lumios">Cennik sezonowy</h2>
                                <div className="bg-white p-6 rounded-lg border border-[#3c3333]/20 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FiCalendar className="text-[#3c3333]" />
                                        <p className="text-[#3c3333]">
                                            Ceny mogą różnić się w zależności od sezonu. Sprawdź aktualne ceny:
                                        </p>
                                    </div>
                                    <TabelaCenSezonowych config={config} />
                                </div>
                            </div>
                        )}

                        {/* Dodatkowe informacje */}
                        <div>
                             <h2 className="text-3xl tracking-wider mb-8 font-lumios">Informacje praktyczne</h2>
                             <div className="space-y-4 text-lg">
                                <div className="flex justify-between py-3 border-b border-[#3c3333]/10">
                                    <span>Zameldowanie:</span>
                                    <span className="font-medium">{DOMEK_INFO.dodatkoweInfo.zameldowanie}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-[#3c3333]/10">
                                    <span>Wymeldowanie:</span>
                                    <span className="font-medium">{DOMEK_INFO.dodatkoweInfo.wymeldowanie}</span>
                                </div>
                                <div className="py-3 border-b border-[#3c3333]/10">
                                    <span className="font-medium">Liczba osób:</span>
                                    <p className="mt-1 text-base">{DOMEK_INFO.dodatkoweInfo.maxOsob}</p>
                                </div>
                                <div className="py-3 border-b border-[#3c3333]/10">
                                    <span className="font-medium">Zwierzęta:</span>
                                    <p className="mt-1 text-base">{DOMEK_INFO.dodatkoweInfo.zwierzeta}</p>
                                </div>
                                <div className="py-3 border-b border-[#3c3333]/10">
                                    <span className="font-medium">Palenie:</span>
                                    <p className="mt-1 text-base">{DOMEK_INFO.dodatkoweInfo.palenie}</p>
                                </div>
                                <div className="py-3 border-b border-[#3c3333]/10">
                                    <span className="font-medium">Klimatyzacja:</span>
                                    <p className="mt-1 text-base">{DOMEK_INFO.dodatkoweInfo.klimatyzacja}</p>
                                </div>
                                <div className="py-3 border-b border-[#3c3333]/10">
                                    <span className="font-medium">Ogrzewanie:</span>
                                    <p className="mt-1 text-base">{DOMEK_INFO.dodatkoweInfo.ogrzewanie}</p>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Right Column (Sticky) */}
                    <div className="lg:sticky top-28 h-fit">
                        <div className="border border-[#3c3333]/20 rounded-sm p-8">
                            <div className="flex justify-between items-baseline mb-6">
                                <span className="text-lg">Aktualna cena za dobę od</span>
                                <span className="text-3xl font-semibold">
                                    {aktualnaCena ? `${aktualnaCena} PLN` : 'Zapytaj o cenę'}
                                </span>
                            </div>
                            
                            {/* Cennik według liczby osób */}
                            {aktualnaCena && config?.ceny?.cena_za_dodatkowa_osoba !== undefined && (
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-3">Cennik według liczby osób:</h4>
                                    <div className="space-y-2 text-sm">
                                        {[...Array(config?.max_osob || 6)].map((_, index) => {
                                            const liczbOsob = index + 1;
                                            const obliczenia = kalkulujCeneZOsobami(config, liczbOsob, 1);
                                            if (obliczenia) {
                                                return (
                                                    <div key={liczbOsob} className="flex justify-between">
                                                        <span className="text-blue-800">
                                                            {liczbOsob} {liczbOsob === 1 ? 'osoba' : liczbOsob <= 4 ? 'osoby' : 'osób'}:
                                                        </span>
                                                        <span className="font-medium text-blue-900">
                                                            {obliczenia.cenaZaDobe} PLN
                                                        </span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <p className="text-xs text-blue-700 mt-2">
                                        Cena bazowa dla {config?.bazowa_liczba_osob || 4} osób, 
                                        +{config?.ceny?.cena_za_dodatkowa_osoba || 0} PLN za każdą dodatkową osobę
                                    </p>
                                </div>
                            )}
                            
                            {aktualnaCena && config?.ceny?.sezonowe && config.ceny.sezonowe.length > 0 && (
                                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-sm text-[#3c3333]">
                                        <FiCalendar className="inline mr-1" />
                                        Ceny różnią się w zależności od <a href="#tabela-cen" className="underline hover:text-[#3c3333] transition-colors">sezonu</a>
                                    </p>
                                </div>
                            )}
                            <div className="space-y-4 text-lg mb-8">
                                <div className="flex items-center gap-3">
                                    <FiUsers />
                                    <span>Do {config?.max_osob || 6} osób</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FiMaximize/>
                                    <span>{DOMEK_INFO.uklad.powierzchnia}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FiHome/>
                                    <span>{DOMEK_INFO.uklad.pietra} piętra</span>
                                </div>
                            </div>
                            <Link 
                              href="/rezerwacja" 
                              className="w-full block text-center px-8 py-4 bg-[#3c3333] text-[#fdf2d0] font-montserrat font-bold text-lg uppercase tracking-widest hover:bg-opacity-90 transition-all duration-300 transform-gpu hover:scale-105"
                            >
                              {aktualnaCena ? 'Zarezerwuj' : 'Zapytaj o dostępność'}
                            </Link>
                            {aktualnaCena && (
                                <p className="text-sm text-center mt-4 text-[#3c3333]/60">
                                    Minimalny pobyt: {config?.min_nocy || 2} noce
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightbox.isOpen && (
                <Lightbox
                    images={images}
                    selectedIndex={lightbox.selectedIndex}
                    onClose={lightbox.closeLightbox}
                    onNavigate={lightbox.navigateToIndex}
                />
            )}
        </div>
        </>
    );
} 
