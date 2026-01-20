
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  userId: string; // Vínculo com o e-mail do usuário
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface UserSettings {
  id: string;
  userEmail: string;
  userName: string;
  userAvatarUrl: string;
  aiAvatarUrl: string;
  pin: string;
  isInitialSetupDone: boolean;
}

export interface GlobalConfig {
  aiAvatarUrl: string;
  lastUpdatedBy: string;
}
