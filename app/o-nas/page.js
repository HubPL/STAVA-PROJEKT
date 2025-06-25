'use client';

import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useTranslation } from "@/lib/i18n";
import PageHero from "../components/PageHero";
import { getImageUrl, HERO_IMAGES } from '@/lib/image-paths';

export default function AboutPage() {
  const { t, locale } = useTranslation();
  const basePath = locale === 'en' ? '/en' : '';

  return (
    <>
      <Head>
        <title>O nas - Historia STAVA | Domki Letniskowe Stara Kiszewa</title>
        <meta name="description" content="Poznaj historię STAVA - od 1999 roku tworzymy miejsce wypoczynku w sercu lasu kaszubskiego. Nasze domki letniskowe w Starej Kiszewie to 25 lat doświadczenia w turystyce." />
        <meta name="keywords" content="historia STAVA, o nas domki Kiszewa, właściciele STAVA, ośrodek od 1999, Kaszuby historia, domki letniskowe właściciele" />
        <meta property="og:title" content="O nas - 25 lat Doświadczenia | STAVA Domki Kaszuby" />
        <meta property="og:description" content="Od 1999 roku tworzymy wyjątkowe miejsce wypoczynku w lesie kaszubskim. Poznaj naszą historię i filozofię gościnności." />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/hero%2Fhero-onas1.jpg?alt=media" />
        <meta property="og:url" content="https://stavakiszewa.pl/o-nas" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://stavakiszewa.pl/o-nas" />
      </Head>
      <div className="bg-[#fdf2d0] font-serif text-[#3c3333]">
      <PageHero 
        titleKey="about.title"
        subtitleKey="about.subtitle"
      />

      {/* 2. MAIN CONTENT SECTION */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Tekst */}
            <div className="order-2 lg:order-1">
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-widest uppercase mb-8 font-lumios">{t('about.our_history')}</h2>
                
                <div className="space-y-6 text-lg tracking-wider leading-relaxed">
                  <div>
                    <h3 className="font-semibold text-xl mb-2">{t('about.year_1999')}</h3>
                    <p>
                      {t('about.story_1999')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-xl mb-2">{t('about.year_1999_2014')}</h3>
                    <p>
                      {t('about.story_1999_2014')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-xl mb-2">{t('about.year_2014')}</h3>
                    <p>
                      {t('about.story_2014')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-xl mb-2">{t('about.year_2014_2022')}</h3>
                    <p>
                      {t('about.story_2014_2022')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-xl mb-2">{t('about.year_2022')}</h3>
                    <p>
                      {t('about.story_2022')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-xl mb-2">{t('about.year_2025')}</h3>
                    <p>
                      {t('about.story_2025')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolaż zdjęć */}
            <div className="order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] rounded-md overflow-hidden shadow-lg">
                  <Image src={getImageUrl(HERO_IMAGES.about1)} fill className="object-cover" alt="Hero O nas 1"/>
                </div>
                <div className="relative aspect-[3/4] mt-12 rounded-md overflow-hidden shadow-lg">
                   <Image src={getImageUrl(HERO_IMAGES.about2)} fill className="object-cover" alt="Hero O nas 2"/>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

       {/* 3. CTA SECTION */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto text-center">
            <div>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-widest uppercase mb-6 font-lumios">{t('about.ready_to_rest')}</h2>
                <p className="text-lg tracking-wider mb-10 max-w-xl mx-auto">
                    {t('about.check_availability')}
                </p>
                <Link 
                    href={`${basePath}/rezerwacja`}
                    className="inline-block px-10 py-4 bg-[#3c3333] text-[#fdf2d0] font-semibold text-lg uppercase tracking-widest hover:bg-opacity-90 transition-all duration-300 transform-gpu hover:scale-105"
                >
                    {t('cottages.reserve_now')}
                </Link>
            </div>
        </div>
      </section>
    </div>
    </>
  );
} 
