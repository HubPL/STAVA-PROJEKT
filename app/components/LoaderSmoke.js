// LoaderSmoke.js
// Animowany loader: domek z kominem i unoszącym się dymem

export default function LoaderSmoke() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Domek */}
        <rect x="35" y="55" width="50" height="30" rx="4" fill="#A0522D" stroke="#7B3F00" strokeWidth="2" />
        <polygon points="60,35 30,55 90,55" fill="#A9B18F" stroke="#3A5A40" strokeWidth="2" />
        {/* Komin */}
        <rect x="75" y="40" width="8" height="15" rx="2" fill="#7B3F00" stroke="#3A5A40" strokeWidth="1" />
        {/* Dym - animowany */}
        <g>
          <ellipse className="animate-dym1" cx="79" cy="35" rx="5" ry="7" fill="#ccc" fillOpacity="0.7" />
          <ellipse className="animate-dym2" cx="79" cy="25" rx="4" ry="6" fill="#eee" fillOpacity="0.5" />
          <ellipse className="animate-dym3" cx="79" cy="15" rx="3" ry="5" fill="#fff" fillOpacity="0.4" />
        </g>
      </svg>
      <style jsx>{`
        .animate-dym1 {
          animation: dym1 2.5s infinite ease-in-out;
        }
        .animate-dym2 {
          animation: dym2 2.5s infinite ease-in-out;
        }
        .animate-dym3 {
          animation: dym3 2.5s infinite ease-in-out;
        }
        @keyframes dym1 {
          0% { opacity: 0.7; transform: translateY(0) scale(1); }
          50% { opacity: 0.3; transform: translateY(-10px) scale(1.1); }
          100% { opacity: 0.7; transform: translateY(0) scale(1); }
        }
        @keyframes dym2 {
          0% { opacity: 0.5; transform: translateY(0) scale(1); }
          50% { opacity: 0.2; transform: translateY(-16px) scale(1.15); }
          100% { opacity: 0.5; transform: translateY(0) scale(1); }
        }
        @keyframes dym3 {
          0% { opacity: 0.4; transform: translateY(0) scale(1); }
          50% { opacity: 0.1; transform: translateY(-22px) scale(1.2); }
          100% { opacity: 0.4; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div className="mt-4 text-black drop-shadow font-amatic text-2xl animate-pulse">Ładowanie magicznego lasu...</div>
    </div>
  );
} 