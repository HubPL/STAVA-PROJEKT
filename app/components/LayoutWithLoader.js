'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoaderSmoke = dynamic(() => import('@/app/components/LoaderSmoke'), { ssr: false });

export default function LayoutWithLoader({ children }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);
    router.events?.on('routeChangeStart', handleStart);
    router.events?.on('routeChangeComplete', handleStop);
    router.events?.on('routeChangeError', handleStop);
    return () => {
      router.events?.off('routeChangeStart', handleStart);
      router.events?.off('routeChangeComplete', handleStop);
      router.events?.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-beige/80 backdrop-blur-md">
          <LoaderSmoke />
        </div>
      )}
      {children}
    </>
  );
} 