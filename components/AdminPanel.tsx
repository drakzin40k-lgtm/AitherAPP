
import React, { useState, useRef } from 'react';
import { UserSettings, ChatSession } from '../types';
import { X, ShieldAlert, Users, Image as ImageIcon, Key, User, Camera, CheckCircle, Database, LayoutDashboard, Mail, Download, Upload } from 'lucide-react';

interface AdminPanelProps {
  users: UserSettings[];
  currentAiAvatar: string;
  onUpdateAiAvatar: (newUrl: string) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, currentAiAvatar, onUpdateAiAvatar, onClose }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'ai' | 'database'>('users');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateAiAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const exportDatabase = () => {
    const data = {
      users: localStorage.getItem('aither_database_users'),
      chats: localStorage.getItem('aither_database_chats'),
      config: localStorage.getItem('aither_global_config')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aither_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 bg-black/98 backdrop-blur-3xl animate-in zoom-in-95 duration-300">
      <div className="bg-[#050505] w-full max-w-5xl h-[85vh] rounded-[3.5rem] border border-blue-500/20 shadow-[0_0_100px_-20px_rgba(59,130,246,0.3)] overflow-hidden flex flex-col">
        
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-blue-600/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white">Admin Command Center</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Master Root: Hypers Access</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full text-zinc-500 transition-all">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-72 border-r border-white/5 p-6 space-y-3 bg-black/40">
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-600 hover:bg-white/5 hover:text-white'}`}
            >
              <Users className="w-4 h-4" />
              Usuários
            </button>
            <button 
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === 'ai' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-600 hover:bg-white/5 hover:text-white'}`}
            >
              <ImageIcon className="w-4 h-4" />
              Interface IA
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === 'database' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-600 hover:bg-white/5 hover:text-white'}`}
            >
              <Database className="w-4 h-4" />
              Dados Master
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 bg-gradient-to-br from-black to-[#080808]">
            {activeTab === 'users' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Database Registry</h3>
                  <span className="px-4 py-1.5 bg-zinc-900 border border-white/5 rounded-full text-[9px] font-bold text-zinc-500">{users.length} Registros</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {users.map((u) => (
                    <div key={u.id} className="group bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/[0.04] hover:border-blue-500/20 transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-800 bg-zinc-900 shadow-xl group-hover:border-blue-500/40 transition-all">
                          {u.userAvatarUrl ? <img src={u.userAvatarUrl} className="w-full h-full object-cover" /> : <User className="w-full h-full p-4 text-zinc-800" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-lg tracking-tight text-white">{u.userName}</h4>
                            {u.userEmail === 'marcossousasilva349@gmail.com' && <CheckCircle className="w-4 h-4 text-blue-500 fill-current" />}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-zinc-600" />
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{u.userEmail}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1">ACCESS PIN</p>
                        <span className="font-black text-xl tracking-[0.2em] text-white/90">{u.pin}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center space-y-4">
                  <div className="inline-flex p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20 mb-4">
                    <LayoutDashboard className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-white">Interface Neural</h3>
                  <p className="text-zinc-500 font-medium">Altere a identidade visual da Aither.</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 flex flex-col items-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full scale-125 group-hover:bg-blue-500/40 transition-all duration-700"></div>
                    <div className="relative w-48 h-48 rounded-full bg-white p-8 shadow-[0_0_60px_rgba(255,255,255,0.2)] border-4 border-zinc-900 overflow-hidden flex items-center justify-center">
                      <img src={currentAiAvatar} className="w-full h-full object-contain scale-110" alt="Aither AI" />
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 p-5 bg-blue-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-[#050505]"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center space-y-4">
                  <div className="inline-flex p-4 bg-green-500/10 rounded-3xl border border-green-500/20 mb-4">
                    <Database className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-white">Banco de Dados Eterno</h3>
                  <p className="text-zinc-500 font-medium">Gerencie a persistência física dos seus dados.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={exportDatabase}
                    className="group p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all text-left"
                  >
                    <Download className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">Exportar Backup</h4>
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">Gere um arquivo JSON com todos os usuários, fotos e mensagens para salvar externamente.</p>
                  </button>
                  <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <ShieldAlert className="w-20 h-20" />
                    </div>
                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">Integridade Local</h4>
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">O sistema utiliza o LocalStorage para manter os dados vivos entre reinicializações.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
