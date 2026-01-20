
import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle, Mail } from 'lucide-react';

interface InitialScreenProps {
  onComplete: (email: string, pin: string) => void;
  avatarUrl: string;
}

const InitialScreen: React.FC<InitialScreenProps> = ({ onComplete, avatarUrl }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const OWNER_EMAIL = 'marcossousasilva349@gmail.com';
  const OWNER_PIN = '2011';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formattedEmail = email.trim().toLowerCase();
    const isOwnerEmail = formattedEmail === OWNER_EMAIL;
    const isOwnerPin = pin === OWNER_PIN;

    // LÓGICA DE VALIDAÇÃO MASTER
    if (isOwnerEmail && isOwnerPin) {
      onComplete(formattedEmail, pin);
      return;
    }

    if (isOwnerEmail && !isOwnerPin) {
      setError('E-mail reservado. Falha na autenticação do PIN proprietário.');
      return;
    }

    if (!isOwnerEmail && isOwnerPin) {
      setError('Este PIN é exclusivo para o terminal administrativo do Dono.');
      return;
    }

    // Bloqueio de novos usuários tentando usar o e-mail do dono
    if (formattedEmail === OWNER_EMAIL) {
      setError('Acesso negado. Este endereço é de propriedade do Sistema.');
      return;
    }

    if (formattedEmail && pin.length === 4) {
      onComplete(formattedEmail, pin);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 4);
    setPin(val);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in duration-1000 relative z-10">
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 rounded-full bg-white p-6 shadow-[0_0_80px_-10px_rgba(255,255,255,0.4)] border-4 border-zinc-900 flex items-center justify-center">
            <img src={avatarUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="mt-8 text-5xl font-black tracking-tighter text-white">Aither Setup</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Protocolo de Identidade Digital</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 block px-4 uppercase tracking-[0.2em]">Endereço Gmail</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="seu@gmail.com"
                  className={`w-full px-7 py-5 bg-zinc-900/50 border rounded-[2rem] text-white focus:outline-none focus:ring-2 transition-all placeholder:text-zinc-800 font-bold text-lg ${error && email.toLowerCase() === OWNER_EMAIL ? 'border-red-500 focus:ring-red-500/20' : 'border-zinc-800 focus:ring-white/10'}`}
                  required
                />
                <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 block px-4 uppercase tracking-[0.2em]">PIN de Acesso</label>
              <div className="relative">
                <input 
                  type="password" 
                  inputMode="numeric"
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="••••"
                  className={`w-full px-7 py-5 bg-zinc-900/50 border rounded-[2rem] text-white focus:outline-none focus:ring-2 transition-all placeholder:text-zinc-800 font-black text-2xl tracking-[1.2em] text-center ${error && pin === OWNER_PIN ? 'border-red-500 focus:ring-red-500/20' : 'border-zinc-800 focus:ring-white/10'}`}
                  required
                />
                <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest text-left leading-tight">{error}</span>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={!email.trim() || pin.length !== 4}
            className="w-full py-5 bg-white text-black font-black rounded-[2rem] hover:bg-zinc-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl active:scale-95 uppercase text-xs tracking-[0.3em]"
          >
            Iniciar Conexão
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 opacity-30">
          <ShieldCheck className="w-4 h-4" />
          <p className="text-[10px] font-black uppercase tracking-widest">Criptografia Ponta-a-Ponta Hypers</p>
        </div>
      </div>
    </div>
  );
};

export default InitialScreen;
