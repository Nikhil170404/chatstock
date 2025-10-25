import { Conversation, ConversationSummary, Message } from './types';

const STORAGE_KEY = 'stock_chat_conversations';

// Get all conversations from localStorage
export function getAllConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const conversations = JSON.parse(stored);
    // Convert date strings back to Date objects
    return conversations.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined
      }))
    }));
  } catch (error) {
    console.error('Error reading conversations:', error);
    return [];
  }
}

// Get conversation summaries for sidebar
export function getConversationSummaries(): ConversationSummary[] {
  const conversations = getAllConversations();
  return conversations
    .map(conv => ({
      id: conv.id,
      title: conv.title,
      preview: conv.messages[0]?.content.slice(0, 60) + '...' || 'New conversation',
      messageCount: conv.messages.length,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    }))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

// Get a specific conversation by ID
export function getConversation(id: string): Conversation | null {
  const conversations = getAllConversations();
  return conversations.find(conv => conv.id === id) || null;
}

// Save or update a conversation
export function saveConversation(conversation: Conversation): void {
  if (typeof window === 'undefined') return;
  
  try {
    const conversations = getAllConversations();
    const existingIndex = conversations.findIndex(conv => conv.id === conversation.id);
    
    if (existingIndex >= 0) {
      conversations[existingIndex] = {
        ...conversation,
        updatedAt: new Date()
      };
    } else {
      conversations.push(conversation);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
}

// Delete a conversation
export function deleteConversation(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const conversations = getAllConversations();
    const filtered = conversations.filter(conv => conv.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting conversation:', error);
  }
}

// Clear all conversations
export function clearAllConversations(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing conversations:', error);
  }
}

// Generate a title for the conversation based on first message
export function generateConversationTitle(firstMessage: string): string {
  const maxLength = 40;
  const cleaned = firstMessage.trim();
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  return cleaned.slice(0, maxLength).trim() + '...';
}

// Create a new conversation
export function createNewConversation(firstMessage?: Message): Conversation {
  const now = new Date();
  return {
    id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: firstMessage 
      ? generateConversationTitle(firstMessage.content)
      : 'New Conversation',
    messages: firstMessage ? [firstMessage] : [],
    createdAt: now,
    updatedAt: now
  };
}