'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import { useTranslation } from "../lib/i18n";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { FaFacebookF, FaInstagram, FaTiktok, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { getImageUrl, HERO_IMAGES, GALLERY_IMAGES } from '../lib/image-paths';
import OptimizedImage from './components/OptimizedImage';

// Komponent do animacji pojawiania się
const AnimateOnScroll = ({ children, className = '', delay = 0 }) => {
  // W przyszłości można to podpiąć pod Intersection Observer API
  return (
    <div className={`transition-all duration-700 ease-out ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

export default function HomePage() {
  const { t, locale } = useTranslation();
  const basePath = locale === 'en' ? '/en' : '';

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Wyczyść błąd gdy użytkownik zaczyna pisać
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas wysyłania wiadomości');
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const galleryImages = [
    { src: getImageUrl(GALLERY_IMAGES.gallery1), alt: 'Galeria STAVA 1' },
    { src: getImageUrl(GALLERY_IMAGES.gallery2), alt: 'Galeria STAVA 2' },
  ];

  return (
    <div className="bg-[#fdf2d0] font-serif text-[#3c3333]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={getImageUrl(HERO_IMAGES.main)}
            alt="Las z lotu ptaka"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        <div className="absolute z-20 bottom-16 left-1/2 -translate-x-1/2 text-center w-full px-4">
            <div className="inline-block transition-all duration-500 hover:scale-105">
                <Link 
                  href={`${basePath}/rezerwacja`}
                  className="px-10 py-4 bg-[#fdf2d0] text-[#3c3333] font-montserrat font-bold text-lg uppercase tracking-widest hover:bg-opacity-90 transition-all duration-300 transform-gpu"
                >
                  {t('home.reserve')}
                </Link>
            </div>
            <a href="#o-nas" className="mt-8 uppercase text-sm tracking-widest flex flex-col items-center hover:opacity-80 transition-opacity animate-bounce">
                <span>{t('home.see_more')}</span>
                <svg className="w-6 h-6 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </a>
        </div>

        <div className="absolute bottom-24 left-8 z-30">
            <div className="bg-[#fdf2d0]/90 backdrop-blur-sm rounded-full p-2 hover:scale-110 transition-transform">
                <LanguageSwitcher />
            </div>
        </div>
        
        <div className="absolute bottom-24 right-8 z-30">
            <div className="bg-[#fdf2d0]/90 backdrop-blur-sm rounded-full p-3 flex items-center space-x-4">
                <a href="https://www.facebook.com/people/STAVA/61576052219084/" target="_blank" rel="noopener noreferrer" className="text-[#3c3333] hover:text-black transition-all hover:scale-125 transform-gpu"><FaFacebookF size={20}/></a>
                <a href="https://www.instagram.com/stavakiszewa?igsh=djdqZnJhYXVydzg5" target="_blank" rel="noopener noreferrer" className="text-[#3c3333] hover:text-black transition-all hover:scale-125 transform-gpu"><FaInstagram size={20}/></a>
                <a href="https://www.tiktok.com/@stavakiszewa?_r=1&_d=secCgYIASAHKAESPgo86AKRBJy%2F%2F0ulPZVVzpL8cpBqfcVy%2FITpK0a5%2FL2fhobzr2Av2La8xYWLgDl8XIXopK7AIIyU%2FjtnOQFJGgA%3D&_svg=2&checksum=348cac23501e99a759db6ab61df7b2d17609ffb037bdb3480df48cd9d07258fd&sec_uid=MS4wLjABAAAAIqLGeo_tuGCRgZ4x06hTKAhZDbiPKtCgnF4cHsHyh77TU5l5SsJpXRVy5zly5JAF&sec_user_id=MS4wLjABAAAAIqLGeo_tuGCRgZ4x06hTKAhZDbiPKtCgnF4cHsHyh77TU5l5SsJpXRVy5zly5JAF&share_app_id=1233&share_author_id=7513310117291590678&share_link_id=3D598EDA-1BC4-45C3-A358-E201D9BA7AB2&share_scene=1&sharer_language=pl&social_share_type=4&source=h5_m&timestamp=1750428408&tt_from=copy&u_code=ekj9hllcl1h53i&ug_btm=b8727%2Cb0&user_id=7513310117291590678&utm_campaign=client_share&utm_medium=ios&utm_source=copy" target="_blank" rel="noopener noreferrer" className="text-[#3c3333] hover:text-black transition-all hover:scale-125 transform-gpu"><FaTiktok size={20}/></a>
            </div>
        </div>
      </section>

      {/* 2. SEKCJA O NAS */}
      <AnimateOnScroll>
        <section id="o-nas" className="relative py-12 px-4 bg-[#fdf2d0] -mt-16 rounded-t-3xl z-20">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="mb-12">
              <div className="flex items-center justify-center mb-4">
                <span className="flex-grow h-px bg-[#3c3333]"></span>
                <h2 className="text-xl mx-4 tracking-widest uppercase font-semibold font-lumios">{t('home.what_is_stava')}</h2>
                <span className="flex-grow h-px bg-[#3c3333]"></span>
              </div>
              <p className="text-lg tracking-widest leading-relaxed whitespace-pre-line">
                {t('home.stava_description')}
              </p>
            </div>
            <div className="mb-12">
              <div className="flex items-center justify-center mb-4">
                <span className="flex-grow h-px bg-[#3c3333]"></span>
                <h3 className="text-xl mx-4 tracking-widest uppercase font-semibold font-lumios">{t('home.where_find')}</h3>
                <span className="flex-grow h-px bg-[#3c3333]"></span>
              </div>

              <p className="text-lg tracking-widest leading-relaxed">
                {t('home.location_description')}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <span className="flex-grow h-px bg-[#3c3333]"></span>
                <h3 className="text-xl mx-4 tracking-widest uppercase font-semibold font-lumios">{t('home.what_awaits')}</h3>
                <span className="flex-grow h-px bg-[#3c3333]"></span>
              </div>
              <p className="text-lg tracking-widest leading-relaxed whitespace-pre-line">
                {t('home.experience_description')}
              </p>
            </div>
            <div className="mt-12">
              <div className="flex items-center justify-center">
                  <span className="flex-grow h-px bg-[#3c3333]"></span>
                  <Link href={`${basePath}/o-nas`} className="inline-block mx-4 px-6 py-2 bg-[#3c3333] text-[#fdf2d0] rounded-full text-lg tracking-widest font-montserrat font-semibold hover:bg-opacity-80 transition-colors">
                    <span className="mr-2">&gt;</span> {t('home.about_us')}
                  </Link>
                  <span className="flex-grow h-px bg-[#3c3333]"></span>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* 3. SEKCJA GALERII */}
      <AnimateOnScroll>
        <section className="py-12 px-4 bg-[#fdf2d0]">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {galleryImages.map((img, index) => (
                        <div key={index} className="relative aspect-[4/3] overflow-hidden group rounded-lg shadow-lg">
                           <OptimizedImage 
                             src={img.src} 
                             alt={img.alt}
                             width={600}
                             height={450}
                             className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                             quality={85}
                           />
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <Link href={`${basePath}/galeria`} className="inline-block mx-4 px-8 py-3 bg-[#3c3333] text-[#fdf2d0] rounded-full text-lg tracking-widest font-montserrat font-semibold hover:bg-opacity-80 transition-all duration-300 transform-gpu hover:scale-105">
                        <span className="mr-2">&gt;</span> {t('home.gallery_photos')}
                    </Link>
                </div>
            </div>
        </section>
      </AnimateOnScroll>

      {/* 4. SEKCJA KONTAKT */}
      <AnimateOnScroll>
        <section id="kontakt" className="relative py-24 px-4">
            <div className="absolute inset-0 z-0">
                <Image
                    src={getImageUrl(HERO_IMAGES.about2)}
                    alt="Tło formularza kontaktowego"
                    fill
                    className="object-cover"
                />
                 <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="relative z-10 container mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                {/* Kolumna z formularzem */}
                <div className="bg-[#fdf2d0] p-6 lg:p-10 rounded-lg shadow-2xl h-full lg:order-1 flex flex-col">
                    <h2 className="text-2xl lg:text-3xl font-semibold uppercase tracking-widest mb-2 text-center font-lumios">{t('home.write_to_us')}</h2>
                    <p className="mt-2 text-md tracking-wider text-center mb-8">{t('home.write_subtitle')}</p>
                    {isSubmitted ? (
                      <div className="text-center py-10">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-xl tracking-wider text-green-800 font-semibold">{t('home.thanks_message')}</p>
                        <p className="text-sm mt-2 text-gray-600">{t('home.thanks_subtitle')}</p>
                        <button 
                          onClick={() => setIsSubmitted(false)}
                          className="mt-6 px-6 py-2 bg-[#3c3333] text-[#fdf2d0] font-montserrat font-semibold text-sm uppercase tracking-widest hover:bg-opacity-90 transition-all duration-300 transform-gpu hover:scale-105"
                        >
                          {t('home.send_another')}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                        {error && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {error}
                            </div>
                          </div>
                        )}
                        
                        <input 
                          type="text" 
                          name="name" 
                          placeholder={t('home.name_placeholder')}
                          required 
                          maxLength="100"
                          className="w-full bg-transparent border-b-2 border-[#3c3333]/50 p-2 text-lg tracking-widest uppercase focus:outline-none focus:border-[#3c3333] transition-colors disabled:opacity-50" 
                          value={formData.name} 
                          onChange={handleChange} 
                          disabled={isLoading}
                        />
                        
                        <input 
                          type="email" 
                          name="email" 
                          placeholder={t('home.email_placeholder')}
                          required 
                          className="w-full bg-transparent border-b-2 border-[#3c3333]/50 p-2 text-lg tracking-widest uppercase focus:outline-none focus:border-[#3c3333] transition-colors disabled:opacity-50" 
                          value={formData.email} 
                          onChange={handleChange} 
                          disabled={isLoading}
                        />
                        
                        <input 
                          type="text" 
                          name="subject" 
                          placeholder={t('home.subject_placeholder')}
                          required 
                          maxLength="200"
                          className="w-full bg-transparent border-b-2 border-[#3c3333]/50 p-2 text-lg tracking-widest uppercase focus:outline-none focus:border-[#3c3333] transition-colors disabled:opacity-50" 
                          value={formData.subject} 
                          onChange={handleChange} 
                          disabled={isLoading}
                        />
                        
                        <textarea 
                          name="message" 
                          rows="4" 
                          placeholder={t('home.message_placeholder')}
                          required 
                          maxLength="2000"
                          className="w-full bg-transparent border-b-2 border-[#3c3333]/50 p-2 text-lg tracking-widest uppercase focus:outline-none focus:border-[#3c3333] transition-colors disabled:opacity-50" 
                          value={formData.message} 
                          onChange={handleChange}
                          disabled={isLoading}
                        ></textarea>
                        
                        <div className="text-center pt-4 mt-auto">
                          <button 
                            type="submit" 
                            disabled={isLoading}
                            className="px-10 py-3 bg-[#3c3333] text-[#fdf2d0] font-montserrat font-semibold text-sm uppercase tracking-widest hover:bg-opacity-90 transition-all duration-300 transform-gpu hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {isLoading ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('home.sending')}
                              </span>
                            ) : (
                              t('home.send_message')
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                </div>
                {/* Kolumna z danymi kontaktowymi i mapą */}
                <div className="space-y-6 lg:order-2">
                    {/* Dane kontaktowe - góra prawej kolumny */}
                    <div className="bg-[#fdf2d0] p-6 lg:p-8 rounded-lg shadow-2xl h-fit">
                        <h3 className="text-xl lg:text-2xl font-semibold uppercase tracking-widest mb-6 font-lumios">{t('home.our_data')}</h3>
                        <div className="space-y-4 lg:space-y-5 text-base lg:text-lg tracking-wider">
                            <p className="flex items-center"><FaMapMarkerAlt className="mr-3 lg:mr-4 text-lg lg:text-xl flex-shrink-0"/><span>ul. Wygonińska 38, 83-430 Stara Kiszewa</span></p>
                            <p className="flex items-center"><FaEnvelope className="mr-3 lg:mr-4 text-lg lg:text-xl flex-shrink-0"/><a href="mailto:kontakt@stavakiszewa.pl" className="hover:text-black transition-colors">kontakt@stavakiszewa.pl</a></p>
                            <p className="flex items-center"><FaPhone className="mr-3 lg:mr-4 text-lg lg:text-xl flex-shrink-0"/><a href="tel:+48886627447" className="hover:text-black transition-colors">+48 886 627 447</a></p>
                        </div>
                    </div>
                    {/* Mapa - dół prawej kolumny */}
                    <div className="aspect-w-16 aspect-h-9 h-64 lg:h-96 rounded-lg overflow-hidden shadow-2xl border-4 border-white/50">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2346.903061988815!2d18.15842831586208!3d54.00445998012229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47020f670416b271%3A0x654e580879d75073!2sWygoni%C5%84ska%2038%2C%2083-430%20Stara%20Kiszewa!5e0!3m2!1spl!2spl!4v1620000000001!5m2!1spl!2spl" 
                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Lokalizacja Stava"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
      </AnimateOnScroll>
    </div>
  );
}
