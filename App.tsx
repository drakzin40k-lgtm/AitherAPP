
import React, { useState, useEffect } from 'react';
import { UserSettings, ChatSession, Message, GlobalConfig } from './types';
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SettingsModal from './components/SettingsModal';
import AdminPanel from './components/AdminPanel';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_AI_LOGO = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMjU2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjU2IDg1TDI5NiAxMzVMMzQ2IDg1TDM2NiAxNjVIMTQ2TDE2NiA4NUwyMTYgMTM1TDI1NiA4NVoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xNzYgMTk1SDMzNlYyNTVIMTc2VjE5NVoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xNzYgMjcwSDI0NlYzMzBIMTc2VjI3MFoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0yNjYgMjcwSDMzNlYzMzBIMjY2VjI3MFoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xNzYgMzQ1SDMzNlY0MDVDMzM2IDQyMS41NjkgMzIyLjU2OSA0MzUgMzA2IDQzNUgyMDZDMTg5LjQzMSA0MzUgMTc2IDQyMS41NjkgMTc2IDQwNVYzNDVaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4=";

const OWNER_EMAIL = 'marcossousasilva349@gmail.com';
const OWNER_PIN = '2011';

const App: React.FC = () => {
  // CONFIGURAÇÕES GLOBAIS (Persistentes)
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>(() => {
    const saved = localStorage.getItem('aither_global_config');
    return saved ? JSON.parse(saved) : { aiAvatarUrl: DEFAULT_AI_LOGO, lastUpdatedBy: 'system' };
  });

  // BANCO DE DADOS DE USUÁRIOS (Persistente)
  const [userRegistry, setUserRegistry] = useState<UserSettings[]>(() => {
    const saved = localStorage.getItem('aither_database_users');
    let registry = saved ? JSON.parse(saved) : [];
    
    // Injeção Automática da Conta do Dono caso não exista
    const hasOwner = registry.some((u: UserSettings) => u.userEmail === OWNER_EMAIL);
    if (!hasOwner) {
      const ownerAccount: UserSettings = {
        id: uuidv4(),
        userEmail: OWNER_EMAIL,
        userName: 'Marcos Silva',
        userAvatarUrl: '',
        aiAvatarUrl: DEFAULT_AI_LOGO,
        pin: OWNER_PIN,
        isInitialSetupDone: true
      };
      registry.push(ownerAccount);
      localStorage.setItem('aither_database_users', JSON.stringify(registry));
    }
    return registry;
  });

  // USUÁRIO LOGADO ATUALMENTE (Sessão)
  const [currentUser, setCurrentUser] = useState<UserSettings | null>(() => {
    const saved = localStorage.getItem('aither_active_user_id');
    if (!saved) return null;
    const registry = JSON.parse(localStorage.getItem('aither_database_users') || '[]');
    return registry.find((u: UserSettings) => u.id === saved) || null;
  });

  // SESSÕES DE CHAT (Todas as mensagens de todos os usuários)
  const [allSessions, setAllSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('aither_database_chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Sincronizar Configurações Globais
  useEffect(() => {
    localStorage.setItem('aither_global_config', JSON.stringify(globalConfig));
  }, [globalConfig]);

  // Sincronizar Mudanças no Usuário Atual com o Registro
  useEffect(() => {
    if (currentUser) {
      const updatedRegistry = userRegistry.map(u => u.id === currentUser.id ? currentUser : u);
      setUserRegistry(updatedRegistry);
      localStorage.setItem('aither_database_users', JSON.stringify(updatedRegistry));
      localStorage.setItem('aither_active_user_id', currentUser.id);
    } else {
      localStorage.removeItem('aither_active_user_id');
    }
  }, [currentUser]);

  // Sincronizar Todos os Chats
  useEffect(() => {
    localStorage.setItem('aither_database_chats', JSON.stringify(allSessions));
  }, [allSessions]);

  const userSessions = allSessions.filter(s => s.userId === currentUser?.id);

  const handleAuthComplete = (user: UserSettings) => {
    setCurrentUser(user);
    if (!userRegistry.some(u => u.id === user.id)) {
      setUserRegistry(prev => [...prev, user]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentSessionId(null);
    setIsSettingsOpen(false);
    setIsAdminOpen(false);
  };

  const createNewChat = () => {
    if (!currentUser) return;
    const newId = uuidv4();
    const newSession: ChatSession = {
      id: newId,
      userId: currentUser.id,
      title: 'Nova Conversa',
      messages: [],
      updatedAt: Date.now()
    };
    setAllSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setIsSidebarVisible(false);
  };

  const deleteSession = (id: string) => {
    setAllSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) setCurrentSessionId(null);
  };

  const updateSessionMessages = (sessionId: string, messages: Message[]) => {
    setAllSessions(prev => {
      return prev.map(s => {
        if (s.id === sessionId) {
          const firstUserMsg = messages.find(m => m.role === 'user');
          const title = firstUserMsg 
            ? firstUserMsg.content.substring(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '')
            : s.title;
          return { ...s, messages, title, updatedAt: Date.now() };
        }
        return s;
      });
    });
  };

  if (!currentUser) {
    return (
      <AuthScreen 
        onAuthComplete={handleAuthComplete} 
        registry={userRegistry} 
        avatarUrl={globalConfig.aiAvatarUrl} 
      />
    );
  }

  const currentSession = allSessions.find(s => s.id === currentSessionId);

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden animate-in fade-in duration-700">
      <Sidebar 
        isVisible={isSidebarVisible}
        sessions={userSessions} 
        currentId={currentSessionId} 
        onSelect={(id) => { setCurrentSessionId(id); setIsSidebarVisible(false); }} 
        onNewChat={createNewChat} 
        onDelete={deleteSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onLogout={handleLogout}
        userEmail={currentUser.userEmail}
        userName={currentUser.userName}
        userPin={currentUser.pin}
        userAvatar={currentUser.userAvatarUrl}
      />
      
      <main className="flex-1 flex flex-col relative bg-[#050505]">
        {currentSessionId ? (
          <ChatArea 
            session={currentSession!} 
            settings={currentUser}
            isSidebarVisible={isSidebarVisible}
            onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
            onUpdateMessages={(msgs) => updateSessionMessages(currentSessionId, msgs)}
            onGoHome={() => setCurrentSessionId(null)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
            <div className="relative mb-10 group cursor-pointer animate-in zoom-in duration-1000">
              <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/40 transition-all duration-700"></div>
              <div className="relative w-40 h-40 rounded-full bg-white p-6 shadow-[0_0_100px_-20px_rgba(255,255,255,0.4)] border-4 border-zinc-900 flex items-center justify-center overflow-hidden">
                <img src={globalConfig.aiAvatarUrl} className="w-full h-full object-contain scale-110" alt="Aither" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
              Aither Prime
            </h1>
            <p className="text-zinc-500 max-w-sm text-lg font-medium mb-12 leading-snug tracking-wide uppercase text-[10px]">
              Sessão: {currentUser.userName} | {currentUser.userEmail}
            </p>
            <button 
              onClick={createNewChat}
              className="px-16 py-6 bg-white text-black rounded-full font-black hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] uppercase text-[10px] tracking-[0.4em]"
            >
              Iniciar Conexão Neural
            </button>
          </div>
        )}
      </main>

      {isSettingsOpen && (
        <SettingsModal 
          settings={currentUser} 
          aiAvatar={globalConfig.aiAvatarUrl}
          onSave={(newSettings) => setCurrentUser(newSettings)}
          onClearHistory={() => { 
            if(confirm("Deseja apagar permanentemente seu histórico nesta conta?")) {
              setAllSessions(prev => prev.filter(s => s.userId !== currentUser.id));
              setCurrentSessionId(null); 
            }
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isAdminOpen && (
        <AdminPanel 
          users={userRegistry}
          currentAiAvatar={globalConfig.aiAvatarUrl}
          onUpdateAiAvatar={(newUrl) => setGlobalConfig({ aiAvatarUrl: newUrl, lastUpdatedBy: 'Master' })}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
