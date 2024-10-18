export interface ChatbotLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
  historyChat?: any[];
  handleNewSession?: () => void;
  activeSession?: (session: any) => void;
}
