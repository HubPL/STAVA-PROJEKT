import { NextResponse } from 'next/server';
import { cleanupExpiredReservations } from '@/lib/firestore';

/**
 * POST /api/cleanup-expired-reservations
 * Usuwa oczekujące rezerwacje starsze niż 24 godziny
 */
export async function POST(request) {
  try {
    // Sprawdź czy request zawiera prawidłowy klucz autoryzacji (opcjonalne)
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.CLEANUP_API_KEY;
    
    // Jeśli jest ustawiony klucz API, sprawdź autoryzację
    if (expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('Starting cleanup of expired reservations...');
    
    // Uruchom czyszczenie przeterminowanych rezerwacji
    const result = await cleanupExpiredReservations();
    
    return NextResponse.json(result, { 
      status: result.success ? 200 : 500 
    });
    
  } catch (error) {
    console.error('Error in cleanup-expired-reservations API:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        message: 'Wystąpił błąd podczas czyszczenia przeterminowanych rezerwacji'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cleanup-expired-reservations
 * Sprawdza ile przeterminowanych rezerwacji istnieje (bez usuwania)
 */
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.CLEANUP_API_KEY;
    
    if (expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Import funkcji potrzebnych do sprawdzenia
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    
    const rezerwacjeRef = collection(db, 'rezerwacje');
    const q = query(
      rezerwacjeRef,
      where('status', '==', 'oczekujaca')
    );
    
    const querySnapshot = await getDocs(q);
    const now = new Date();
    let expiredCount = 0;
    let totalPendingCount = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalPendingCount++;
      
      if (data.metadane && data.metadane.createdAt) {
        const createdAt = data.metadane.createdAt.toDate();
        const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
        
        if (hoursSinceCreation > 24) {
          expiredCount++;
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      totalPendingReservations: totalPendingCount,
      expiredReservations: expiredCount,
      message: `Znaleziono ${expiredCount} przeterminowanych rezerwacji z ${totalPendingCount} oczekujących`
    });
    
  } catch (error) {
    console.error('Error checking expired reservations:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        message: 'Wystąpił błąd podczas sprawdzania przeterminowanych rezerwacji'
      },
      { status: 500 }
    );
  }
} 