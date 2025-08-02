import { NextResponse } from 'next/server';
import { sendStatusUpdateEmail } from '@/lib/email';
import { verifyOrigin } from '@/lib/auth-middleware';
import { rateLimit, getClientIP } from '@/lib/rate-limit';
import { getRezerwacjaById } from '@/lib/firestore';

export async function POST(request) {
  try {
    // Weryfikacja pochodzenia żądania
    if (!verifyOrigin(request)) {
      return NextResponse.json(
        { error: 'Dostęp zabroniony - nieprawidłowa domena' },
        { status: 403 }
      );
    }

    // Rate limiting - zwiększone limity dla panelu administracyjnego
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 10, 10 * 60 * 1000)) { // 10 żądań na 10 minut
      return NextResponse.json(
        { error: 'Za dużo żądań. Spróbuj ponownie za kilka minut.' },
        { status: 429 }
      );
    }

    const requestBody = await request.json();
    let rezerwacjaData, newStatus;
    
    // Obsłuż różne formaty żądania
    if (requestBody.rezerwacjaData && requestBody.newStatus) {
      // Stary format - bezpośrednio dane rezerwacji
      rezerwacjaData = requestBody.rezerwacjaData;
      newStatus = requestBody.newStatus;
    } else if (requestBody.rezerwacjaId && requestBody.status) {
      // Nowy format - ID rezerwacji z panelu administracyjnego
      const rezerwacja = await getRezerwacjaById(requestBody.rezerwacjaId);
      if (!rezerwacja) {
        return NextResponse.json(
          { error: 'Nie znaleziono rezerwacji o podanym ID' },
          { status: 404 }
        );
      }
      rezerwacjaData = rezerwacja;
      newStatus = requestBody.status;
    } else {
      return NextResponse.json(
        { error: 'Nieprawidłowy format żądania. Wymagane: (rezerwacjaData + newStatus) lub (rezerwacjaId + status)' },
        { status: 400 }
      );
    }
    
    // Walidacja wymaganych danych
    if (!rezerwacjaData.email || !newStatus) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych w rezerwacji (email)' },
        { status: 400 }
      );
    }
    
    // Dodatkowa walidacja statusu
    const allowedStatuses = ['potwierdzona', 'odrzucona', 'anulowana'];
    if (!allowedStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy status. Dozwolone: potwierdzona, odrzucona, anulowana' },
        { status: 400 }
      );
    }

    console.log('Wysyłanie emaila o statusie:', {
      email: rezerwacjaData.email,
      status: newStatus,
      imie: rezerwacjaData.imie,
      nazwisko: rezerwacjaData.nazwisko
    });

    // Wysyłanie emaila o zmianie statusu
    const result = await sendStatusUpdateEmail(rezerwacjaData, newStatus);
    
    console.log('Email o statusie wysłany pomyślnie:', {
      email: rezerwacjaData.email,
      status: newStatus,
      emailResult: result
    });

    return NextResponse.json({
      success: true,
      message: `Email o statusie "${newStatus}" został wysłany do ${rezerwacjaData.email}`,
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
