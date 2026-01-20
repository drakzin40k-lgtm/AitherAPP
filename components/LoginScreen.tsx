
import React, { useState, useEffect } from 'react';
import { Lock, Mail } from 'lucide-react';

interface LoginScreenProps {
  savedPin: string;
  userEmail: string;
  onUnlock: () => void;
  avatarUrl: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ savedPin, userEmail, onUnlock, avatarUrl }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (input.length === 4) {
      if (input === savedPin) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setInput('');
          setError(false);
        }, 1000);
      }
    }
  }, [input, savedPin, onUnlock]);

  const handleKeyPress = (num: string) => {
    if (input.length < 4) setInput(prev => prev + num);
  };

  const handleClear = () => setInput('');

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden relative">
      <div className="absolute inset-0 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-xs w-full text-center space-y-10 relative z-10">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white p-4 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] border-4 border-zinc-900 flex items-center justify-center animate-pulse duration-[3000ms]">
            <img src={avatarUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="mt-8 space-y-2">
            <h2 className="text-xl font-black tracking-widest uppercase text-white">Bloqueio Ativo</h2>
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
              <Mail className="w-3 h-3 text-zinc-500" />
              <span className="text-zinc-400 text-[10px] font-bold tracking-tight truncate max-w-[150px]">{userEmail}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex justify-center gap-4">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  input.length > i 
                    ? 'bg-white border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                    : error ? 'border-red-500' : 'border-zinc-800'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button 
                key={num}
                onClick={() => handleKeyPress(num)}
                className="w-16 h-16 rounded-full bg-zinc-900/40 border border-zinc-800/50 text-xl font-bold hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                {num}
              </button>
            ))}
            <button onClick={handleClear} className="w-16 h-16 flex items-center justify-center text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Limpar</button>
            <button onClick={() => handleKeyPress('0')} className="w-16 h-16 rounded-full bg-zinc-900/40 border border-zinc-800/50 text-xl font-bold flex items-center justify-center hover:bg-zinc-800">0</button>
            <div className="w-16 h-16 flex items-center justify-center">
              <Lock className={`w-5 h-5 ${error ? 'text-red-500 animate-shake' : 'text-zinc-800'}`} />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Acesso Negado</p>
        )}
      </div>
      
      <p className="absolute bottom-10 text-zinc-800 text-[9px] font-black uppercase tracking-[0.5em]">Hypers Labs Security Module</p>
    </div>
  );
};

export default LoginScreen;
