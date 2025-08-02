'use client';

import { lazy, Suspense } from 'react';

// Lazy loading dla dużych komponentów
export const LazyReservationCalendar = lazy(() => import('./ReservationCalendar'));
export const LazyLightbox = lazy(() => import('./Lightbox'));
export const LazyCookieConsent = lazy(() => import('./CookieConsent'));

// Loading fallbacks
export const CalendarSkeleton = () => (
  <div className="w-full h-96 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
    <div className="text-gray-500">Ładowanie kalendarza...</div>
  </div>
);

export const LightboxSkeleton = () => (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div className="text-white">Ładowanie galerii...</div>
  </div>
);

export const CookieConsentSkeleton = () => (
  <div className="fixed bottom-4 left-4 right-4 bg-white shadow-lg rounded-lg p-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  </div>
);

// Wrapped components z Suspense
export const SuspensedReservationCalendar = (props) => (
  <Suspense fallback={<CalendarSkeleton />}>
    <LazyReservationCalendar {...props} />
  </Suspense>
);

export const SuspensedLightbox = (props) => (
  <Suspense fallback={<LightboxSkeleton />}>
    <LazyLightbox {...props} />
  </Suspense>
);

export const SuspensedCookieConsent = (props) => (
  <Suspense fallback={<CookieConsentSkeleton />}>
    <LazyCookieConsent {...props} />
  </Suspense>
);