
import React from 'react';
import VoiceStudio from './components/VoiceStudio';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#151b2b] selection:bg-indigo-500/30">
      {/* Abstract Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-900/10 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10">
        <VoiceStudio />
      </main>

      <footer className="relative z-10 py-8 border-t border-slate-800/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} AI Cinematic Studio • Pro Narration Suite
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
