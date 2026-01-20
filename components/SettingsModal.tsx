
import React, { useState, useRef } from 'react';
import { UserSettings } from '../types';
import { X, Trash2, Mail, CheckCircle, Settings, Camera, Lock, Sparkles, User } from 'lucide-react';

interface SettingsModalProps {
  settings: UserSettings;
  aiAvatar: string;
  onSave: (settings: UserSettings) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, aiAvatar, onSave, onClearHistory, onClose }) => {
  const [userEmail, setUserEmail] = useState(settings.userEmail);
  const [userName, setUserName] = useState(settings.userName);
  const [userAvatarUrl, setUserAvatarUrl] = useState(settings.userAvatarUrl);
  const [pin, setPin] = useState(settings.pin);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isOwner = userEmail.toLowerCase() === 'marcossousasilva349@gmail.com';

  const handleSave = () => {
    onSave({
      ...settings,
      userName: userName.trim() || settings.userName,
      userAvatarUrl,
      pin: pin.length === 4 ? pin : settings.pin
    });
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
      <div className="bg-[#080808] w-full max-w-xl rounded-[3rem] border border-white/10 shadow-[0_0_80px_-20px_rgba(59,130,246,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Settings className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Perfil & Preferências</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-500 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
          <section className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-[2.5rem] blur-2xl opacity-40"></div>
            <div className="relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center backdrop-blur-md">
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full bg-white p-4 shadow-2xl border-4 border-black overflow-hidden flex items-center justify-center">
                  <img src={aiAvatar} alt="Aither" className="w-full h-full object-contain" />
                </div>
                {isOwner && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2 border-4 border-[#080808]">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-black tracking-tight text-white">Aither Neural Link</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-black">Versão 2.5 Prime</p>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 flex items-center justify-center bg-zinc-900 transition-all duration-500 ${isOwner ? 'border-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-white/10'}`}>
                  {userAvatarUrl ? (
                    <img src={userAvatarUrl} className="w-full h-full object-cover" alt="User" />
                  ) : (
                    <User className={`w-10 h-10 ${isOwner ? 'text-blue-500' : 'text-zinc-800'}`} />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-3 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-[#080808]"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
              </div>

              <div className="w-full space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest px-2">Nome de Exibição</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-[1.8rem] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-lg"
                      placeholder="Seu nome"
                    />
                    <User className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-800" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest px-2">E-mail (Não editável)</label>
                  <div className="relative opacity-60">
                    <input 
                      type="email" 
                      value={userEmail} 
                      readOnly
                      className="w-full px-6 py-5 bg-black border border-white/5 rounded-[1.8rem] text-zinc-500 cursor-not-allowed font-bold"
                    />
                    <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-900" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest px-2">Alterar PIN (4 dígitos)</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={pin} 
                      maxLength={4}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-[1.8rem] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-black tracking-[1.2em] text-center text-xl"
                    />
                    <Lock className="absolute right-7 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-800" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-white/5">
            <button 
              onClick={onClearHistory}
              className="w-full py-5 bg-red-500/5 border border-red-500/10 text-red-500 rounded-[1.8rem] hover:bg-red-500/10 transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <Trash2 className="w-4 h-4" />
              Limpar histórico desta conta
            </button>
          </section>
        </div>

        <div className="p-8 bg-white/[0.01] border-t border-white/5 flex justify-end gap-5">
          <button onClick={onClose} className="px-6 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Descartar</button>
          <button 
            onClick={handleSave}
            className="px-14 py-4 bg-white text-black rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95"
          >
            Sincronizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
