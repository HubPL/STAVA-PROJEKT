import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import { rateLimitStoreFunction, getClientIP } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    // Rate limiting - 5 wiadomości na godzinę
    const clientIP = getClientIP(request);
    const isAllowed = rateLimitStoreFunction(`contact_${clientIP}`, 5, 60 * 60 * 1000);
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Za dużo wiadomości. Spróbuj ponownie za godzinę.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Walidacja danych
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Wszystkie pola są wymagane.' },
        { status: 400 }
      );
    }

    // Walidacja emaila
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy adres email.' },
        { status: 400 }
      );
    }

    // Walidacja długości
    if (name.length > 100 || subject.length > 200 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Dane są zbyt długie.' },
        { status: 400 }
      );
    }

    // Sanityzacja danych
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    };

    // Wysyłanie emaila
    await sendContactEmail(contactData);

    return NextResponse.json(
      { message: 'Wiadomość została wysłana pomyślnie!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Błąd w API contact:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.' },
      { status: 500 }
    );
  }
} 