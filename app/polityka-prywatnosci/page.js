'use client';

import Image from 'next/image';
import Head from 'next/head';
import PageHero from '../components/PageHero';
import { useTranslation } from '@/lib/i18n';

export default function PolitykaPrywatnosciPage() {
    const { t } = useTranslation();

    const Section = ({ title, children }) => (
        <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-wider mb-6 pb-3 border-b border-[#3c3333]/20 font-lumios">
      {title}
    </h2>
    <div className="prose prose-lg max-w-none text-[#3c3333] tracking-wide leading-relaxed">
                {children}
            </div>
        </div>
    );

    const InfoBox = ({ title, children, type = 'info' }) => (
        <div className={`p-6 rounded-lg border-l-4 mb-6 ${
            type === 'important' ? 'bg-orange-50 border-orange-400' : 
            type === 'warning' ? 'bg-red-50 border-red-400' : 
            'bg-blue-50 border-blue-400'
        }`}>
                      <h4 className="font-semibold text-[#3c3333] mb-3 font-montserrat">{title}</h4>
          <div className="text-sm text-[#3c3333]/80 leading-relaxed">{children}</div>
        </div>
    );

    return (
        <>
            <Head>
                <title>Polityka Prywatności RODO | STAVA Stara Kiszewa</title>
                <meta name="description" content="Polityka prywatności STAVA zgodna z RODO. Dowiedz się jak chronimy Twoje dane osobowe podczas rezerwacji domku wypoczynkowego w Starej Kiszewie." />
                <meta name="keywords" content="polityka prywatności STAVA, RODO domek, ochrona danych STAVA, prywatność rezerwacja, dane osobowe Kiszewa" />
                <meta property="og:title" content="Polityka Prywatności RODO | STAVA" />
                <meta property="og:description" content="Sprawdź jak chronimy Twoje dane osobowe zgodnie z RODO. Transparentna polityka prywatności dla gości STAVA." />
                <meta property="og:url" content="https://stavakiszewa.pl/polityka-prywatnosci" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://stavakiszewa.pl/polityka-prywatnosci" />
            </Head>
            <div className="bg-[#FFF9E8] font-serif text-[#3c3333] min-h-screen">
            <PageHero 
                titleKey="privacy.title"
                subtitleKey="privacy.subtitle"
            />
            
            {/* 2. MAIN CONTENT */}
            <main className="container mx-auto px-6 sm:px-8 lg:px-4 py-16 sm:py-24">
                <article className="max-w-4xl mx-auto">

                    <InfoBox title="Ważne informacje" type="important">
                        <p>Ta polityka prywatności została utworzona zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych (RODO).</p>
                        <p className="mt-2"><strong>Data ostatniej aktualizacji:</strong> 20 czerwca 2025</p>
                    </InfoBox>

                    <Section title="1. Administrator danych osobowych">
                        <p><strong>Administratorem</strong> Twoich danych osobowych jest:</p>
                        <div className="bg-white/60 p-6 rounded-lg mt-4 border border-[#3a3a3a]/10">
                            <p><strong>STAVA Kiszewa</strong><br/>
                            ul. Wygonińska 38<br/>
                            83-430 Stara Kiszewa<br/>
                            NIP: [do uzupełnienia]<br/>
                            Email: <a href="mailto:kontakt@stavakiszewa.pl" className="underline hover:opacity-80">kontakt@stavakiszewa.pl</a><br/>
                            Telefon: +48 886 627 447</p>
                        </div>
                        <p className="mt-4">W sprawach dotyczących ochrony danych osobowych możesz skontaktować się z nami pod adresem: <a href="mailto:kontakt@stavakiszewa.pl" className="underline hover:opacity-80">kontakt@stavakiszewa.pl</a></p>
                    </Section>

                    <Section title="2. Jakie dane zbieramy i w jakim celu?">
                        <h3 className="text-xl font-semibold mt-8 mb-4 font-montserrat">2.1. Dane zbierane podczas rezerwacji</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-[#3a3a3a]/20 mb-6">
                                <thead>
                                    <tr className="bg-white/60">
                                        <th className="border border-[#3a3a3a]/20 p-3 text-left font-montserrat">Kategoria danych</th>
                                        <th className="border border-[#3a3a3a]/20 p-3 text-left font-montserrat">Cel przetwarzania</th>
                                        <th className="border border-[#3a3a3a]/20 p-3 text-left font-montserrat">Podstawa prawna</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-[#3a3a3a]/20 p-3">Imię, nazwisko</td>
                                        <td className="border border-[#3a3a3a]/20 p-3">Identyfikacja gościa, wykonanie usługi</td>
                                        <td className="border border-[#3a3a3a]/20 p-3">Art. 6 ust. 1 lit. b RODO</td>
                                    </tr>
                                    <tr className="bg-white/30">
                                        <td className="border border-[#3a3a3a]/20 p-3">Adres email</td>
                                        <td className="border border-[#3a3a3a]/20 p-3">Komunikacja, potwierdzenia</td>
                                        <td className="border border-[#3a3a3a]/20 p-3">Art. 6 ust. 1 lit. b RODO</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-[#3a3a3a]/20 p-3">Numer telefonu</td>
                                        <td className="border border-[#3a3a3a]/20 p-3">Kontakt w sprawach organizacyjnych</td>
                                        <td className="border border-[#3a3a3a]/20 p-3">Art. 6 ust. 1 lit. b RODO</td>
                                    </tr>
                                    <tr className="bg-white/30">
                                        <td className="border border-[#3a3a3a]/20 p-3">Dane pobytowe</td>
                                        <td className="border border-[#3a3a3a]/20 p-3">Realizacja pobytu, obowiązki prawne</td>
                                        <td className="border border-[#3a3a3a]/20 p-3">Art. 6 ust. 1 lit. b,c RODO</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="text-xl font-semibold mt-8 mb-4 font-montserrat">2.2. Dane zbierane przez formularz kontaktowy</h3>
                        <p>Przetwarzamy: imię, adres email, treść wiadomości w celu udzielenia odpowiedzi na Twoje zapytanie (art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes).</p>

                        <h3 className="text-xl font-semibold mt-8 mb-4 font-montserrat">2.3. Dane techniczne</h3>
                        <p>Automatycznie zbieramy: adres IP, typ przeglądarki, system operacyjny, czas wizyty w celach bezpieczeństwa i analitycznych (art. 6 ust. 1 lit. f RODO).</p>
                    </Section>

                    <Section title="3. Cookies i technologie śledzące">
                        <InfoBox title="Co to są cookies?">
                            <p>Cookies to małe pliki tekstowe przechowywane w Twojej przeglądarce podczas odwiedzania stron internetowych. Pomagają nam zapamiętać Twoje preferencje i poprawić działanie strony.</p>
                        </InfoBox>

                        <h3 className="text-xl font-semibold mt-8 mb-4 font-montserrat">3.1. Rodzaje używanych cookies</h3>
                        
                        <div className="space-y-6">
                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">🔧 Cookies niezbędne</h4>
                                <p><strong>Cel:</strong> Podstawowe funkcje strony, bezpieczeństwo, preferencje językowe</p>
                                <p><strong>Czas przechowywania:</strong> Do zamknięcia sesji lub 1 rok</p>
                                <p><strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes)</p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">📊 Cookies analityczne</h4>
                                <p><strong>Cel:</strong> Analiza ruchu, poprawa funkcjonalności</p>
                                <p><strong>Dostawca:</strong> Vercel Analytics (anonimowe)</p>
                                <p><strong>Czas przechowywania:</strong> Do 24 miesięcy</p>
                                <p><strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. a RODO (zgoda)</p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">🎯 Cookies marketingowe</h4>
                                <p><strong>Cel:</strong> Personalizacja reklam, remarketing</p>
                                <p><strong>Dostawcy:</strong> Google Ads, Facebook Pixel</p>
                                <p><strong>Czas przechowywania:</strong> Do 24 miesięcy</p>
                                <p><strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. a RODO (zgoda)</p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">⚡ Cookies funkcjonalne</h4>
                                <p><strong>Cel:</strong> Osadzone mapy, czat, media społecznościowe</p>
                                <p><strong>Dostawcy:</strong> Google Maps, YouTube</p>
                                <p><strong>Czas przechowywania:</strong> Różny, do 24 miesięcy</p>
                                <p><strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. a RODO (zgoda)</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mt-8 mb-4 font-montserrat">3.2. Zarządzanie cookies</h3>
                        <p>Możesz zarządzać cookies poprzez:</p>
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            <li>Banner na naszej stronie (przy pierwszej wizycie)</li>
                            <li>Ustawienia przeglądarki</li>
                            <li>Bezpośrednie wyłączenie w ustawieniach dostawców (Google, Facebook)</li>
                        </ul>
                    </Section>

                    <Section title="4. Udostępnianie danych">
                        <p>Twoje dane możemy udostępnić następującym podmiotom:</p>
                        
                        <div className="space-y-4 mt-6">
                            <div className="bg-white/60 p-4 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat">🔧 Dostawcy usług technicznych</h4>
                                <p>Hosting (Vercel), email (Resend), zarządzanie rezerwacjami - w celu świadczenia usług</p>
                            </div>
                            
                            <div className="bg-white/60 p-4 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat">🏛️ Organy publiczne</h4>
                                <p>Na żądanie uprawnionych organów (policja, sąd, urząd skarbowy) - na podstawie przepisów prawa</p>
                            </div>

                            <div className="bg-white/60 p-4 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat">📊 Dostawcy narzędzi analitycznych</h4>
                                <p>Google Analytics, Vercel Analytics - tylko z Twoją zgodą na cookies analityczne</p>
                            </div>
                        </div>

                        <InfoBox title="Przekazywanie danych poza EOG" type="warning">
                            <p>Niektórzy nasi dostawcy usług (np. Vercel, Google) mogą przetwarzać dane w krajach spoza Europejskiego Obszaru Gospodarczego. Zapewniamy odpowiednie zabezpieczenia poprzez:</p>
                            <ul className="list-disc list-inside mt-2">
                                <li>Standardowe klauzule umowne zatwierdzone przez Komisję Europejską</li>
                                <li>Decyzje o adekwatności ochrony wydane przez Komisję Europejską</li>
                                <li>Programy certyfikacji (np. Privacy Shield dla USA)</li>
                            </ul>
                        </InfoBox>
                    </Section>

                    <Section title="5. Okres przechowywania danych">
                        <div className="space-y-4">
                            <div className="bg-white/60 p-4 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat">📅 Dane rezerwacji</h4>
                                <p>5 lat od zakończenia pobytu (obowiązki podatkowe i księgowe)</p>
                            </div>
                            
                            <div className="bg-white/60 p-4 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat">💬 Dane z formularza kontaktowego</h4>
                                <p>3 lata od ostatniej korespondencji lub do cofnięcia zgody</p>
                            </div>

                            <div className="bg-white/60 p-4 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat">🍪 Dane z cookies</h4>
                                <p>Zgodnie z ustawieniami poszczególnych typów cookies (od sesji do 24 miesięcy)</p>
                            </div>

                            <div className="bg-white/60 p-4 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat">🔍 Logi serwera</h4>
                                <p>12 miesięcy (cele bezpieczeństwa i statystyczne)</p>
                            </div>
                        </div>
                    </Section>

                    <Section title="6. Twoje prawa">
                        <p>Zgodnie z RODO przysługują Ci następujące prawa:</p>
                        
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">🔍 Prawo dostępu</h4>
                                <p className="text-sm">Możesz uzyskać informację o tym, czy i jakie dane o Tobie przetwarzamy</p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">✏️ Prawo sprostowania</h4>
                                <p className="text-sm">Możesz żądać poprawienia nieprawidłowych lub uzupełnienia niekompletnych danych</p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">🗑️ Prawo usunięcia</h4>
                                <p className="text-sm">Możesz żądać usunięcia danych (prawo do bycia zapomnianym)</p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">⏸️ Prawo ograniczenia</h4>
                                <p className="text-sm">Możesz żądać ograniczenia przetwarzania danych w określonych przypadkach</p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">📤 Prawo przenoszenia</h4>
                                <p className="text-sm">Możesz otrzymać swoje dane w formacie umożliwiającym ich przeniesienie</p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">❌ Prawo sprzeciwu</h4>
                                <p className="text-sm">Możesz sprzeciwić się przetwarzaniu danych w określonych przypadkach</p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">🔄 Cofnięcie zgody</h4>
                                <p className="text-sm">Możesz w każdej chwili cofnąć zgodę na przetwarzanie danych</p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat mb-3">⚖️ Prawo skargi</h4>
                                <p className="text-sm">Możesz złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych</p>
                            </div>
                        </div>

                        <InfoBox title="Jak skorzystać z praw?" type="info">
                            <p>Aby skorzystać z powyższych praw, skontaktuj się z nami:</p>
                            <ul className="list-disc list-inside mt-2">
                                <li>Email: <a href="mailto:kontakt@stavakiszewa.pl" className="underline">kontakt@stavakiszewa.pl</a></li>
                                <li>Telefon: +48 886 627 447</li>
                                <li>Pisemnie na adres: ul. Wygonińska 38, 83-430 Stara Kiszewa</li>
                            </ul>
                            <p className="mt-2">Odpowiemy na Twoje żądanie w ciągu miesiąca od jego otrzymania.</p>
                        </InfoBox>
                    </Section>

                    <Section title="7. Profilowanie i zautomatyzowane podejmowanie decyzji">
                        <p>Informujemy, że:</p>
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            <li><strong>Nie stosujemy</strong> profilowania w rozumieniu art. 22 RODO</li>
                            <li><strong>Nie podejmujemy</strong> zautomatyzowanych decyzji mających skutki prawne</li>
                            <li>Wszystkie decyzje dotyczące rezerwacji są podejmowane przez człowieka</li>
                            <li>Możemy używać podstawowych narzędzi analitycznych do poprawy funkcjonalności strony</li>
                        </ul>
                    </Section>

                    <Section title="8. Bezpieczeństwo danych">
                        <p>Dbamy o bezpieczeństwo Twoich danych poprzez:</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <div className="bg-white/60 p-4 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat text-sm">🔐 Szyfrowanie</h4>
                                <p className="text-sm mt-2">Połączenia SSL/TLS, szyfrowanie danych w bazie</p>
                            </div>
                            
                            <div className="bg-white/60 p-4 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat text-sm">🔑 Kontrola dostępu</h4>
                                <p className="text-sm mt-2">Ograniczony dostęp tylko dla upoważnionych osób</p>
                            </div>

                            <div className="bg-white/60 p-4 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat text-sm">💾 Kopie zapasowe</h4>
                                <p className="text-sm mt-2">Regularne, szyfrowane kopie zapasowe danych</p>
                            </div>

                            <div className="bg-white/60 p-4 rounded-lg border border-[#3a3a3a]/10">
                                <h4 className="font-semibold font-montserrat text-sm">🔍 Monitoring</h4>
                                <p className="text-sm mt-2">Ciągłe monitorowanie systemów i logowanie dostępu</p>
                            </div>
                        </div>
                    </Section>

                    <Section title="9. Naruszenia ochrony danych">
                        <p>W przypadku naruszenia ochrony danych osobowych, które może powodować wysokie ryzyko naruszenia praw lub wolności osób fizycznych, poinformujemy Cię o tym w ciągu 72 godzin od wykrycia naruszenia.</p>
                        
                        <InfoBox title="Co robimy w przypadku naruszenia?">
                            <ul className="list-disc list-inside space-y-1">
                                <li>Natychmiast zabezpieczamy system i usuwamy zagrożenie</li>
                                <li>Oceniamy skalę i skutki naruszenia</li>
                                <li>Informujemy Urząd Ochrony Danych Osobowych</li>
                                <li>Informujemy Cię, jeśli naruszenie może wpłynąć na Twoje prawa</li>
                                <li>Podejmujemy działania zapobiegające podobnym incydentom</li>
                            </ul>
                        </InfoBox>
                    </Section>

                    <Section title="10. Kontakt w sprawach ochrony danych">
                        <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10">
                            <h3 className="font-semibold font-montserrat mb-4">📧 Administrator danych</h3>
                            <p><strong>STAVA Kiszewa</strong><br/>
                            Email: <a href="mailto:kontakt@stavakiszewa.pl" className="underline hover:opacity-80">kontakt@stavakiszewa.pl</a><br/>
                            Telefon: +48 886 627 447<br/>
                            Adres: ul. Wygonińska 38, 83-430 Stara Kiszewa</p>
                        </div>

                        <div className="bg-white/60 p-6 rounded-lg border border-[#3a3a3a]/10 mt-6">
                            <h3 className="font-semibold font-montserrat mb-4">⚖️ Urząd Ochrony Danych Osobowych</h3>
                            <p>Jeśli uważasz, że przetwarzanie Twoich danych narusza przepisy RODO, możesz złożyć skargę do:</p>
                            <p className="mt-2"><strong>Prezes Urzędu Ochrony Danych Osobowych</strong><br/>
                            ul. Stawki 2, 00-193 Warszawa<br/>
                            Email: kancelaria@uodo.gov.pl<br/>
                            Telefon: +48 22 531 03 00</p>
                        </div>
                    </Section>

                    <Section title="11. Zmiany w Polityce Prywatności">
                        <p>Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności. O istotnych zmianach poinformujemy Cię poprzez:</p>
                        
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            <li>Powiadomienie email (jeśli posiadamy Twój adres)</li>
                            <li>Informację na stronie głównej serwisu</li>
                            <li>Popup lub banner na stronie</li>
                        </ul>

                        <p className="mt-4">Zachęcamy do regularnego sprawdzania tej strony w celu zapoznania się z ewentualnymi zmianami.</p>
                    </Section>
                    
                    <div className="mt-16 p-8 bg-gradient-to-r from-[#3a3a3a] to-[#3a3a3a]/80 text-[#e3e0d8] rounded-xl text-center">
                        <h3 className="text-xl font-semibold mb-4 font-lumios">{t('privacy.questions_title')}</h3>
                        <p className="mb-6 tracking-wide">{t('privacy.questions_text')}</p>
                        <a 
                            href="mailto:kontakt@stavakiszewa.pl" 
                            className="inline-block px-8 py-3 bg-[#e3e0d8] text-[#3a3a3a] rounded-lg hover:bg-opacity-90 transition-all duration-300 font-montserrat font-semibold uppercase tracking-widest transform-gpu hover:scale-105"
                        >
                            {t('privacy.write_to_us')}
                        </a>
                    </div>

                    <div className="mt-12 text-center text-sm tracking-wider text-[#3a3a3a]/60">
                        <p><strong>Data ostatniej aktualizacji:</strong> 20 czerwca 2025</p>
                        <p><strong>Wersja:</strong> 2.0</p>
                        <p className="mt-2">Niniejsza polityka prywatności jest zgodna z Rozporządzeniem RODO (UE) 2016/679</p>
                    </div>

                </article>
            </main>
        </div>
        </>
    );
} 
