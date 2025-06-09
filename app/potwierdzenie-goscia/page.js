import Link from 'next/link';
import { Suspense } from 'react';
import PotwierdzenieGosciaContent from './PotwierdzenieGosciaContent';

export default function PotwierdzenieGosciaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen section-forest flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="loading-forest mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-4 heading-forest">
            Ładowanie...
          </h1>
          <p className="text-stone-700 font-body text-lg">
            Pobieramy szczegóły Twojej rezerwacji...
          </p>
        </div>
      </div>
    }>
      <PotwierdzenieGosciaContent />
    </Suspense>
  );
} 