
import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, Message, UserSettings } from '../types';
import { generateAIResponse } from '../services/aiService';
import { Send, ChevronLeft, BookOpen, Book, MessageSquare, User, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ChatAreaProps {
  session: ChatSession;
  settings: UserSettings;
  isSidebarVisible: boolean;
  onToggleSidebar: () => void;
  onUpdateMessages: (messages: Message[]) => void;
  onGoHome: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  session, 
  settings, 
  isSidebarVisible,
  onToggleSidebar,
  onUpdateMessages, 
  onGoHome 
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const isOwner = settings.userEmail === 'marcossousasilva349@gmail.com' && settings.pin === '2011';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session.messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    const newMessages = [...session.messages, userMsg];
    onUpdateMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(settings.userEmail, session.messages, userMsg.content);
      const aiMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      };
      onUpdateMessages([...newMessages, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] relative overflow-hidden">
      {isOwner && (
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/5 blur-[120px] pointer-events-none -z-10 animate-pulse duration-[4000ms]"></div>
      )}

      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/60 backdrop-blur-2xl sticky top-0 z-30">
        <div className="flex items-center gap-5">
          <button onClick={onGoHome} className="p-2.5 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white/90 tracking-tight truncate max-w-[200px]">{session.title}</h2>
              {isOwner && <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-current" />}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-black">Hypers Labs Secure Link</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isOwner && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full mr-4">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Root Console Active</span>
            </div>
          )}
          <button 
            onClick={onToggleSidebar}
            className={`p-3 rounded-2xl transition-all shadow-lg ${isSidebarVisible ? 'bg-white text-black' : 'text-zinc-600 hover:text-white hover:bg-white/5'}`}
          >
            {isSidebarVisible ? <Book className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-20 py-12 space-y-14 scroll-smooth">
        {session.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-800 opacity-20 select-none">
            <div className="w-24 h-24 rounded-full border-2 border-zinc-900 flex items-center justify-center mb-8">
              <MessageSquare className="w-10 h-10" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.5em] text-center">Inicie o Fluxo Neural</p>
          </div>
        ) : (
          session.messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-6 duration-700`}>
              <div className={`flex gap-6 max-w-[95%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="shrink-0 pt-2">
                  {msg.role === 'assistant' ? (
                    <div className="w-14 h-14 rounded-full bg-white p-3 border-2 border-black flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.15)] ring-4 ring-white/5">
                      <img src={settings.aiAvatarUrl} className="w-full h-full object-contain" alt="A" />
                    </div>
                  ) : (
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 overflow-hidden transition-all duration-500 ${isOwner ? 'border-blue-500 shadow-[0_10px_30px_rgba(59,130,246,0.2)] bg-zinc-950 scale-110' : 'border-zinc-800 bg-zinc-900 shadow-xl'}`}>
                      {settings.userAvatarUrl ? (
                        <img src={settings.userAvatarUrl} className="w-full h-full object-cover" alt="U" />
                      ) : (
                        <User className={`w-7 h-7 ${isOwner ? 'text-blue-500' : 'text-zinc-700'}`} />
                      )}
                    </div>
                  )}
                </div>
                <div className={`p-7 rounded-[2.5rem] leading-relaxed text-[15px] font-medium shadow-2xl transition-all duration-500 ${
                  msg.role === 'user' 
                    ? (isOwner ? 'bg-blue-600 text-white rounded-tr-none ring-4 ring-blue-500/10' : 'bg-white text-black rounded-tr-none')
                    : 'bg-[#0a0a0a] text-zinc-200 rounded-tl-none border border-white/5 backdrop-blur-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div className={`mt-4 text-[9px] font-bold uppercase tracking-widest opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex gap-6">
              <div className="w-14 h-14 rounded-full bg-white p-3 border border-black flex items-center justify-center">
                <img src={settings.aiAvatarUrl} className="w-full h-full object-contain" alt="A" />
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 p-7 rounded-[2.5rem] rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 md:p-12 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={isOwner ? `Sua vontade é minha diretriz, ${settings.userName.split(' ')[0]}...` : "Inicie sua jornada..."}
            className="w-full py-7 pl-10 pr-20 bg-zinc-900/50 border border-white/10 rounded-[2.8rem] text-white placeholder:text-zinc-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all disabled:opacity-50 backdrop-blur-xl font-medium text-lg"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-5 top-1/2 -translate-y-1/2 p-4 rounded-full transition-all shadow-2xl active:scale-90 ${isOwner ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white text-black hover:bg-zinc-200'}`}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
        <div className="flex items-center justify-center gap-3 mt-6 opacity-20 select-none">
           <ShieldCheck className="w-3 h-3" />
           <p className="text-[9px] font-black uppercase tracking-[0.5em]">{isOwner ? 'ENCRYPTED ROOT CHANNEL' : 'AITHER NEURAL LINK'}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
