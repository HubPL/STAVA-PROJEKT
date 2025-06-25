import Link from 'next/link';
import { Suspense } from 'react';
import PotwierdzenieGosciaContent from './PotwierdzenieGosciaContent';

export default function PotwierdzenieGosciaPage() {
  return (
    <div className="min-h-screen bg-[#fdf2d0]">
      <div className="h-32"></div>
      <Suspense fallback={
        <div className="min-h-screen bg-[#fdf2d0] flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#3c3333]/20 border-t-[#3c3333] rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-4xl md:text-5xl font-lumios text-[#3c3333] mb-4">
              Ładowanie...
            </h1>
            <p className="text-[#3c3333] font-inter text-lg">
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
