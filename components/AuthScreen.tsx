
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertTriangle, Mail, UserPlus, ArrowRight, User } from 'lucide-react';
import { UserSettings } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AuthScreenProps {
  onAuthComplete: (user: UserSettings) => void;
  registry: UserSettings[];
  avatarUrl: string;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthComplete, registry, avatarUrl }) => {
  const [step, setStep] = useState<'email' | 'pin' | 'setup'>('email');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [existingUser, setExistingUser] = useState<UserSettings | null>(null);

  const OWNER_EMAIL = 'marcossousasilva349@gmail.com';
  const OWNER_PIN = '2011';

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const formattedEmail = email.trim().toLowerCase();
    
    const user = registry.find(u => u.userEmail === formattedEmail);
    if (user) {
      setExistingUser(user);
      setStep('pin');
    } else {
      // Se tentar registrar o email do dono sem conta (caso deletado)
      if (formattedEmail === OWNER_EMAIL) {
        setError('Este e-mail é reservado. Se você é o dono, contate o suporte do sistema.');
        return;
      }
      setStep('setup');
    }
  };

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (existingUser) {
      if (pin === existingUser.pin) {
        onAuthComplete(existingUser);
      } else {
        setError('PIN incorreto. Acesso negado.');
        setPin('');
      }
    }
  };

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('O PIN deve conter 4 dígitos.');
      return;
    }

    const newUser: UserSettings = {
      id: uuidv4(),
      userEmail: email.trim().toLowerCase(),
      userName: name.trim() || 'Usuário',
      userAvatarUrl: '',
      aiAvatarUrl: avatarUrl,
      pin: pin,
      isInitialSetupDone: true
    };

    onAuthComplete(newUser);
  };

  useEffect(() => {
    if (step === 'pin' && pin.length === 4) {
      handlePinSubmit();
    }
  }, [pin]);

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-left">
        <label className="text-[10px] font-black text-zinc-600 block px-4 uppercase tracking-[0.2em]">Endereço Gmail</label>
        <div className="relative">
          <input 
            type="email" 
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="seu@gmail.com"
            className="w-full px-7 py-5 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all placeholder:text-zinc-800 font-bold text-lg"
            required
          />
          <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
        </div>
      </div>
      {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest px-4">{error}</p>}
      <button 
        type="submit"
        className="w-full py-5 bg-white text-black font-black rounded-[2rem] hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.3em]"
      >
        Continuar <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );

  const renderPinStep = () => (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center space-y-2">
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Bem-vindo de volta,</p>
        <p className="text-white font-bold text-xl">{existingUser?.userName}</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center gap-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                pin.length > i ? 'bg-white border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-zinc-800'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button 
              key={num}
              onClick={() => pin.length < 4 && setPin(p => p + num)}
              className="w-14 h-14 rounded-full bg-zinc-900/50 border border-zinc-800 text-lg font-bold hover:bg-zinc-800 transition-all"
            >
              {num}
            </button>
          ))}
          <button onClick={() => setPin('')} className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Limpar</button>
          <button onClick={() => pin.length < 4 && setPin(p => p + '0')} className="w-14 h-14 rounded-full bg-zinc-900/50 border border-zinc-800 text-lg font-bold hover:bg-zinc-800 transition-all">0</button>
          <button onClick={() => { setStep('email'); setPin(''); }} className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Trocar</button>
        </div>
      </div>
      {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>}
    </div>
  );

  const renderSetupStep = () => (
    <form onSubmit={handleSetupSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-2 mb-4">
        <div className="inline-flex p-3 bg-blue-500/10 rounded-full border border-blue-500/20">
          <UserPlus className="w-5 h-5 text-blue-500" />
        </div>
        <h2 className="text-white font-black uppercase tracking-widest text-xs">Criar Nova Conta</h2>
      </div>

      <div className="space-y-4 text-left">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-600 block px-4 uppercase tracking-[0.2em]">Seu Nome</label>
          <div className="relative">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full px-7 py-5 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all placeholder:text-zinc-800 font-bold"
              required
            />
            <User className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-600 block px-4 uppercase tracking-[0.2em]">Defina um PIN (4 dígitos)</label>
          <div className="relative">
            <input 
              type="password" 
              value={pin}
              maxLength={4}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full px-7 py-5 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all placeholder:text-zinc-800 font-black text-2xl tracking-[1em] text-center"
              required
            />
            <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          type="submit"
          disabled={!name.trim() || pin.length !== 4}
          className="w-full py-5 bg-white text-black font-black rounded-[2rem] hover:bg-zinc-200 transition-all disabled:opacity-30 uppercase text-xs tracking-[0.3em]"
        >
          Finalizar Registro
        </button>
        <button 
          type="button"
          onClick={() => setStep('email')}
          className="text-[9px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-all"
        >
          Voltar ao Início
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-md w-full text-center space-y-10 relative z-10">
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 rounded-full bg-white p-6 shadow-[0_0_80px_-10px_rgba(255,255,255,0.4)] border-4 border-zinc-900 flex items-center justify-center">
            <img src={avatarUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="mt-8 text-5xl font-black tracking-tighter text-white">Aither</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Protocolo de Conexão Neural</p>
        </div>

        <div className="min-h-[300px] flex flex-col justify-center">
          {step === 'email' && renderEmailStep()}
          {step === 'pin' && renderPinStep()}
          {step === 'setup' && renderSetupStep()}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-2 opacity-30">
            <ShieldCheck className="w-4 h-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">Base de Dados Hypers Local Ativa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
