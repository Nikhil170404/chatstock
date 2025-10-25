'use client';

import { useState, useEffect, useRef } from 'react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';
import SuggestedPrompts from '@/components/SuggestedPrompts';
import ConversationHistory from '@/components/ConversationHistory';
import { Message, ChatRequest, ChatResponse, Conversation } from '@/lib/types';
import {
  getAllConversations,
  getConversationSummaries,
  getConversation,
  saveConversation,
  createNewConversation
} from '@/lib/conversationStorage';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversationSummaries, setConversationSummaries] = useState<ReturnType<typeof getConversationSummaries>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation summaries on mount
  useEffect(() => {
    refreshConversationList();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Save current conversation when messages change
  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      const conversation: Conversation = {
        id: currentConversationId,
        title: messages[0]?.content.slice(0, 40) + '...' || 'New Conversation',
        messages,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      saveConversation(conversation);
      refreshConversationList();
    }
  }, [messages, currentConversationId]);

  const refreshConversationList = () => {
    setConversationSummaries(getConversationSummaries());
  };

  const handleNewConversation = () => {
    const newConv = createNewConversation();
    setCurrentConversationId(newConv.id);
    setMessages([]);
    setError(null);
  };

  const handleSelectConversation = (id: string) => {
    const conversation = getConversation(id);
    if (conversation) {
      setCurrentConversationId(conversation.id);
      setMessages(conversation.messages);
      setError(null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Create new conversation if none exists
    if (!currentConversationId) {
      const newConv = createNewConversation();
      setCurrentConversationId(newConv.id);
    }

    // Clear any previous errors
    setError(null);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare request with conversation history
      const requestBody: ChatRequest = {
        message: content,
        history: messages
      };

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data: ChatResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);

      // Add error message to chat
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Conversation History Sidebar */}
      <ConversationHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        conversations={conversationSummaries}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onRefresh={refreshConversationList}
      />

      {/* Header - Fixed */}
      <header className="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              {/* History Button */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="p-2 sm:p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                title="Conversation History"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Stock Chat AI
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hidden sm:block">
                  Real-time market insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* New Chat Button */}
              <button
                onClick={handleNewConversation}
                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                title="New Chat"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">New</span>
              </button>

              {/* Live Badge */}
              <span className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg shadow-emerald-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Live
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex flex-col items-center justify-center min-h-full text-center py-8 sm:py-12">
              <div className="mb-8 sm:mb-12 space-y-6">
                {/* Hero Icon */}
                <div className="relative mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/40 transform hover:scale-105 transition-transform duration-300">
                    <svg
                      className="w-12 h-12 sm:w-14 sm:h-14 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                
                {/* Welcome Text */}
                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                    Welcome to Stock Chat AI
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                    Your intelligent assistant for real-time stock market insights. Ask me anything about stocks, markets, or financial news.
                  </p>
                </div>
              </div>
              
              {/* Suggested Prompts */}
              <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />
            </div>
          ) : (
            // Chat Messages
            <div className="space-y-4 sm:space-y-6">
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="flex-shrink-0 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-28 sm:bottom-32 right-4 sm:right-6 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl max-w-sm animate-slide-up z-50">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm sm:text-base font-semibold">Error</p>
              <p className="text-xs sm:text-sm opacity-90 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}