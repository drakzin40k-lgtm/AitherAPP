
import React from 'react';
import { ChatSession } from '../types';
import { Plus, MessageSquare, Trash2, Settings, User, CheckCircle, ShieldAlert, LogOut } from 'lucide-react';

interface SidebarProps {
  isVisible: boolean;
  sessions: ChatSession[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
  userEmail: string;
  userName: string;
  userPin: string;
  userAvatar?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isVisible,
  sessions, 
  currentId, 
  onSelect, 
  onNewChat, 
  onDelete, 
  onOpenSettings,
  onOpenAdmin,
  onLogout,
  userEmail,
  userName,
  userPin,
  userAvatar
}) => {
  const isOwner = userEmail === 'marcossousasilva349@gmail.com' && userPin === '2011';

  return (
    <aside className={`${isVisible ? 'w-72 border-r' : 'w-0 border-r-0'} bg-black border-zinc-900 flex flex-col h-full shrink-0 transition-all duration-500 ease-in-out overflow-hidden z-20`}>
      <div className="w-72 flex flex-col h-full">
        <div className="p-6">
          <button 
            onClick={onNewChat}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.8rem] transition-all group/btn shadow-xl ${isOwner ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white text-black hover:bg-zinc-200'}`}
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Novo Ciclo</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          <div className="px-4 py-3">
             <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Registros</span>
          </div>
          {sessions.length === 0 ? (
            <div className="px-5 py-10 text-center opacity-10">
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Memória Vazia</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div 
                key={session.id}
                className={`group flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer transition-all border ${
                  currentId === session.id 
                    ? 'bg-zinc-900 border-white/10 text-white shadow-lg' 
                    : 'border-transparent text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300'
                }`}
                onClick={() => onSelect(session.id)}
              >
                <div className="flex items-center gap-4 truncate">
                  <MessageSquare className={`w-4 h-4 shrink-0 ${currentId === session.id ? (isOwner ? 'text-blue-500' : 'text-zinc-400') : 'text-zinc-800'}`} />
                  <span className="text-xs font-bold truncate tracking-tight">{session.title}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-zinc-900 space-y-3">
          {isOwner && (
            <button 
              onClick={onOpenAdmin}
              className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500 hover:bg-blue-600/20 transition-all text-xs font-black uppercase tracking-widest"
            >
              <ShieldAlert className="w-4 h-4" />
              Painel Mestre
            </button>
          )}

          <button 
            onClick={onOpenSettings}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl hover:bg-white/5 text-zinc-600 hover:text-white transition-all text-xs font-bold"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </button>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-all text-xs font-bold"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </button>
          
          <div className={`flex items-center gap-4 px-5 py-5 rounded-[2rem] border backdrop-blur-sm relative overflow-hidden transition-all duration-500 ${isOwner ? 'bg-blue-600/5 border-blue-500/20' : 'bg-zinc-950 border-white/5'}`}>
            <div className={`w-11 h-11 rounded-full flex items-center justify-center overflow-hidden border-2 ${isOwner ? 'border-blue-500 bg-zinc-900' : 'border-zinc-800 bg-zinc-900'}`}>
              {userAvatar ? (
                <img src={userAvatar} className="w-full h-full object-cover" alt="User" />
              ) : (
                <User className={`w-5 h-5 ${isOwner ? 'text-blue-500' : 'text-zinc-700'}`} />
              )}
            </div>
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-1.5 truncate">
                <span className={`text-[10px] font-black truncate uppercase tracking-widest ${isOwner ? 'text-blue-100' : 'text-white'}`}>{userName}</span>
                {isOwner && <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-current shrink-0" />}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isOwner ? 'text-blue-500' : 'text-zinc-700'}`}>
                {isOwner ? 'Proprietário' : 'Usuário Verificado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
