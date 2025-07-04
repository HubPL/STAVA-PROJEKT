export default function manifest() {
  return {
    name: 'STAVA - Domek wypoczynkowy w Kiszewie',
    short_name: 'STAVA',
    description: 'Ośrodek wypoczynkowy w Starej Kiszewie. Rezerwuj komfortowy domek wypoczynkowy otoczony naturą.',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#365314',
    icons: [
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/icons%2Ficon-192x192.png?alt=media',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/icons%2Ficon-512x512.png?alt=media',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
} 
