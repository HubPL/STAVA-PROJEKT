import { NextResponse } from 'next/server';
import { sendStatusUpdateEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { rezerwacjaData, newStatus } = await request.json();
    
    console.log('📧 Wysyłanie emaila o zmianie statusu:', newStatus);
    
    // Walidacja danych
    if (!rezerwacjaData.email || !newStatus) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych (email, newStatus)' },
        { status: 400 }
      );
    }
    
    // Wyślij email o zmianie statusu
    const result = await sendStatusUpdateEmail(rezerwacjaData, newStatus);
    
    return NextResponse.json({
      success: true,
      message: `Email o statusie "${newStatus}" został wysłany`,
      result
    });
    
  } catch (error) {
    console.error('❌ Błąd w API send-status-email:', error);
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