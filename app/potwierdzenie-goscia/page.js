import Link from 'next/link';
import { Suspense } from 'react';
import PotwierdzenieGosciaContent from './PotwierdzenieGosciaContent';

export default function PotwierdzenieGosciaPage() {
  return (
    <div className="min-h-screen bg-brand-200">
      <div className="h-32"></div>
      <Suspense fallback={
        <div className="min-h-screen bg-brand-200 flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-4xl md:text-5xl font-lumios text-brand-800 mb-4">
              Ładowanie...
            </h1>
            <p className="text-brand-600 font-inter text-lg">
              Pobieramy szczegóły Twojej rezerwacji...
            </p>
          </div>
        </div>
      }>
        <PotwierdzenieGosciaContent />
      </Suspense>
    </div>
  );
} 
