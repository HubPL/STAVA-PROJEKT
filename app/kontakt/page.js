'use client';

import { useState } from 'react';

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(false);
    console.log("Dane formularza kontaktowego:", formData);
    alert('Formularz kontaktowy wysłany (symulacja). Dane w konsoli.');
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
        Skontaktuj się z Nami
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Formularz kontaktowy */}
        <div className="bg-white p-8 shadow-md rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Napisz do Nas</h2>
          {isSubmitted && (
            <p className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">Dziękujemy za wiadomość! Skontaktujemy się wkrótce.</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Imię i Nazwisko:</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Twój Email:</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-600 mb-1">Temat:</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-600 mb-1">Wiadomość:</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="5" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div>
              <button 
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-md transition-colors disabled:opacity-50"
              >
                Wyślij Wiadomość
              </button>
            </div>
          </form>
        </div>

        {/* Informacje kontaktowe i mapa */}
        <div className="space-y-8">
          <div className="bg-white p-8 shadow-md rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Dane Kontaktowe</h2>
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p><strong>Nazwa:</strong> STAVA Ośrodek Domków Letniskowych</p>
              <p><strong>Adres:</strong> Stara Kiszewa, ul. Leśna 1 (Przykładowy), 83-430 Stara Kiszewa</p>
              <p><strong>Email:</strong> <a href="mailto:kontakt@stavakiszewa.pl" className="text-blue-600 hover:text-blue-700 hover:underline">kontakt@stavakiszewa.pl</a></p>
              <p><strong>Telefon:</strong> <a href="tel:+48000000000" className="text-blue-600 hover:text-blue-700 hover:underline">+48 000 000 000</a> (Przykładowy, uzupełnij)</p>
            </div>
          </div>
          
          <div className="bg-white p-2 shadow-md rounded-lg h-80 md:h-96 border border-gray-200">
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-500 rounded-md text-center p-4">
              <p className="font-medium">[ Placeholder dla Mapy Google Maps ]</p>
              <p className="text-xs mt-2">(iframe z Google Maps zostanie tu osadzony)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 