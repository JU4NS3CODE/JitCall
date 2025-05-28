export interface Message {
  id?: string;
  chatId?: string;
  senderId: string;
  type: 'text' | 'image' | 'audio' | 'location' | 'file';
  content: string;
  timestamp: any;
  metadata?: {
    name?: string;
    size?: number;
    lat?: number;
    lng?: number;
    duration?: number;
    mimeType?: string;
  };
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}