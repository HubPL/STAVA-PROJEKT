'use client';

import Image from 'next/image';
import Head from 'next/head';
import PageHero from '../components/PageHero';
import { useTranslation } from '@/lib/i18n';

export default function RegulaminPage() {
    const { t } = useTranslation();
    
    return (
        <>
            <Head>
                <title>Regulamin w Trakcie Tworzenia | STAVA Stara Kiszewa</title>
                <meta name="description" content="Regulamin ośrodka wypoczynkowego STAVA w trakcie opracowania. Skontaktuj się z nami w sprawie pytań dotyczących pobytu w Starej Kiszewie." />
                <meta name="keywords" content="regulamin STAVA, zasady pobytu domek, regulamin Stara Kiszewa, warunki pobytu Kaszuby" />
                <meta property="og:title" content="Regulamin STAVA | Domek Wypoczynkowy" />
                <meta property="og:description" content="Pracujemy nad regulaminem ośrodka. W międzyczasie chętnie odpowiemy na pytania o zasady pobytu." />
                <meta property="og:url" content="https://stavakiszewa.pl/regulamin" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://stavakiszewa.pl/regulamin" />
            </Head>
            <div className="bg-[#fdf2d0] font-serif text-[#3c3333] min-h-screen">
            <PageHero 
                titleKey="terms.title"
                subtitleKey="terms.subtitle"
            />
            
            {/* 2. MAIN CONTENT */}
            <main className="container mx-auto px-6 sm:px-8 lg:px-4 py-16 sm:py-24">
                <article className="max-w-4xl mx-auto">

                    <div className="text-center py-20">
                        <div className="mb-8">
                                      <div className="w-16 h-16 bg-[#3c3333]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#3c3333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-widest uppercase mb-6 font-lumios">
                                {t('terms.in_progress')}
                            </h2>
                            <p className="text-lg tracking-wider mb-8 max-w-2xl mx-auto leading-relaxed">
                                {t('terms.working_on')}
                            </p>
                        </div>
                        
                        <div className="bg-white/60 p-8 rounded-xl border border-[#3c3333]/10 max-w-2xl mx-auto">
                            <h3 className="text-xl font-semibold mb-4 font-lumios">{t('terms.have_questions')}</h3>
                            <p className="text-base tracking-wide mb-6">
                                {t('terms.contact_us')}
                            </p>
                            <div className="space-y-3 text-sm">
                                <p><strong>{t('terms.phone')}</strong> <a href="tel:+48886627447" className="hover:text-black transition-colors">+48 886 627 447</a></p>
                                <p><strong>{t('terms.email')}</strong> <a href="mailto:kontakt@stavakiszewa.pl" className="hover:text-black transition-colors">kontakt@stavakiszewa.pl</a></p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12 text-center">
                        <p className="text-lg tracking-wider">{t('terms.pleasant_stay')}</p>
                        <p className="text-xl font-semibold tracking-widest mt-2">{t('terms.team')}</p>
                    </div>

                </article>
            </main>
        </div>
        </>
    );
} 
