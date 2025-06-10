import { NextResponse } from 'next/server';
import { sendConfirmationEmailToGuest, sendNewReservationEmailToAdmin } from '@/lib/email';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    // Ograniczenie żądań - 3 żądania na 10 minut
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 3, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Za dużo żądań. Spróbuj ponownie za kilka minut.' },
        { status: 429 }
      );
    }

    const rezerwacjaData = await request.json();
    
    // Walidacja wymaganych danych
    if (!rezerwacjaData.email || !rezerwacjaData.tokenPotwierdzenia) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych (email, token)' },
        { status: 400 }
      );
    }
    
    const results = {};
    
    // Wysyłanie emaila do gościa
    try {
      const guestEmailResult = await sendConfirmationEmailToGuest(rezerwacjaData);
      results.guestEmail = guestEmailResult;
    } catch (error) {
      console.error('Błąd wysyłania emaila do gościa:', error);
      results.guestEmailError = error.message;
    }
    
    // Wysyłanie emaila do administratora
    try {
      const adminEmailResult = await sendNewReservationEmailToAdmin(rezerwacjaData);
      results.adminEmail = adminEmailResult;
    } catch (error) {
      console.error('Błąd wysyłania emaila do administratora:', error);
      results.adminEmailError = error.message;
    }
    
    // Sprawdzenie rezultatów
    const hasSuccess = results.guestEmail || results.adminEmail;
    const hasErrors = results.guestEmailError || results.adminEmailError;
    
    if (hasSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Emaile zostały wysłane',
        results,
        warnings: hasErrors ? 'Niektóre emaile nie zostały wysłane' : null
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nie udało się wysłać żadnego emaila',
          results 
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Błąd w API send-emails:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Błąd serwera podczas wysyłania emaili',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 