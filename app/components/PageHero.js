'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { getImageUrl, HERO_IMAGES } from '@/lib/image-paths';
import { useTranslation } from '@/lib/i18n';

const PageHero = ({ titleKey, subtitleKey, title, subtitle }) => {
  const { t } = useTranslation();
  
  // Użyj tłumaczenia jeśli podano klucz, w przeciwnym razie użyj bezpośredniego tekstu
  const displayTitle = titleKey ? t(titleKey) : title;
  const displaySubtitle = subtitleKey ? t(subtitleKey) : subtitle;
  
  return (
    <section className="relative h-[40vh] min-h-[280px] text-white flex items-center justify-center">
      <Image
        src={getImageUrl(HERO_IMAGES.hero2)}
        alt="Tło strony"
        fill
        className="object-cover z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <div className="relative z-20 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {displayTitle && (
            <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-widest">
              {displayTitle}
            </h1>
          )}
          {displaySubtitle && (
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto tracking-wider font-light">
              {displaySubtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero; 
