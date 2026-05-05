import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = Cookies.get('auth_token');
      if (token) {
        window.location.href = '/chat';
      } else {
        window.location.href = '/login';
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center m-0 p-0 h-screen w-full" 
         style={{ background: 'linear-gradient(135deg, #006878 0%, #0ac4e0 100%)' }}>
      <main className="flex flex-col items-center justify-center space-y-12 w-full max-w-md p-8 text-center animate-fade-in">
        
        {/* App Logo & Wordmark Container */}
        <div className="flex flex-col items-center space-y-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-white flex items-center justify-center elevation-2 p-4">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_D-d0It9dxs0hFPk0fMi4Y_OziIHVXua_lFSZBr4pJxVB7NmSH1XFrEyuYuQa9kipGeEHvkec1xXUZlKVWn7RLZajcgWxvQ0FMzus-GVApH8yJI-YmNan9brOXaasi5NruloOCNBA3wg-e-uv4DH2NMBsAwUMUSs1aZvl03bXvG8nmXdoI_JKxEAU5ECPsky_eGGt_z1a5DuVncwngsgCO_QF-YPY67BcftPRCb5GFkVT8YkeWz9guR7v_TQVY1nJ5TBIlJQKYoqD" 
              alt="DocuMind AI Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md font-roboto">
            DocuMind AI
          </h1>
        </div>

        {/* M3 Circular Progress Indicator */}
        <div className="pt-16 flex flex-col items-center space-y-6">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-white/80 font-medium text-sm tracking-widest uppercase font-roboto">
            Initializing Context...
          </p>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
}
