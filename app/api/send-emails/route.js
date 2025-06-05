import { NextResponse } from 'next/server';
import { sendConfirmationEmailToGuest, sendNewReservationEmailToAdmin } from '@/lib/email';

export async function POST(request) {
  try {
    const rezerwacjaData = await request.json();
    
    console.log('📧 Wysyłanie emaili dla rezerwacji:', rezerwacjaData.tokenPotwierdzenia);
    
    // Walidacja danych
    if (!rezerwacjaData.email || !rezerwacjaData.tokenPotwierdzenia) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych (email, token)' },
        { status: 400 }
      );
    }
    
    const results = {};
    
    try {
      // Wyślij email do gościa
      console.log('📤 Wysyłanie emaila do gościa...');
      const guestEmailResult = await sendConfirmationEmailToGuest(rezerwacjaData);
      results.guestEmail = guestEmailResult;
      console.log('✅ Email do gościa wysłany');
    } catch (error) {
      console.error('❌ Błąd wysyłania emaila do gościa:', error);
      results.guestEmailError = error.message;
    }
    
    try {
      // Wyślij email do administratora
      console.log('📤 Wysyłanie emaila do administratora...');
      const adminEmailResult = await sendNewReservationEmailToAdmin(rezerwacjaData);
      results.adminEmail = adminEmailResult;
      console.log('✅ Email do administratora wysłany');
    } catch (error) {
      console.error('❌ Błąd wysyłania emaila do administratora:', error);
      results.adminEmailError = error.message;
    }
    
    // Sprawdź czy przynajmniej jeden email się udał
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
    console.error('❌ Błąd w API send-emails:', error);
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