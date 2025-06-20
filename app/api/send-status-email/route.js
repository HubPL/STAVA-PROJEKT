import { NextResponse } from 'next/server';
import { sendStatusUpdateEmail } from '@/lib/email';
import { verifyOrigin } from '@/lib/auth-middleware';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    // Weryfikacja pochodzenia żądania
    if (!verifyOrigin(request)) {
      return NextResponse.json(
        { error: 'Dostęp zabroniony - nieprawidłowa domena' },
        { status: 403 }
      );
    }

    // Rate limiting - bardzo restrykcyjny dla tego API
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 2, 10 * 60 * 1000)) { // 2 żądania na 10 minut
      return NextResponse.json(
        { error: 'Za dużo żądań. API endpoint jest przestarzały - użyj panelu administracyjnego.' },
        { status: 429 }
      );
    }



    const { rezerwacjaData, newStatus } = await request.json();
    
    // Walidacja wymaganych danych
    if (!rezerwacjaData.email || !newStatus) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych (email, newStatus)' },
        { status: 400 }
      );
    }
    
    // Dodatkowa walidacja statusu
    const allowedStatuses = ['potwierdzona', 'odrzucona'];
    if (!allowedStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy status. Dozwolone: potwierdzona, odrzucona' },
        { status: 400 }
      );
    }

    // Wysyłanie emaila o zmianie statusu
    const result = await sendStatusUpdateEmail(rezerwacjaData, newStatus);
    
    return NextResponse.json({
      success: true,
      message: `Email o statusie "${newStatus}" został wysłany`,
      result
    });
    
  } catch (error) {
    console.error('Błąd w API send-status-email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Błąd podczas wysyłania emaila o statusie',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 
