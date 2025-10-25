'use client';

import { useState } from 'react';
import { ConversationSummary } from '@/lib/types';
import { deleteConversation, clearAllConversations } from '@/lib/conversationStorage';

interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: ConversationSummary[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onRefresh: () => void;
}

export default function ConversationHistory({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onRefresh
}: ConversationHistoryProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const handleDelete = (id: string) => {
    deleteConversation(id);
    onRefresh();
    setShowDeleteConfirm(null);
    if (currentConversationId === id) {
      onNewConversation();
    }
  };

  const handleClearAll = () => {
    clearAllConversations();
    onRefresh();
    setShowClearAllConfirm(false);
    onNewConversation();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                History
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                onNewConversation();
                onClose();
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No conversations yet
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                  Start a new chat to begin
                </p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div key={conv.id} className="group relative">
                  <div
                    onClick={() => {
                      onSelectConversation(conv.id);
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      currentConversationId === conv.id
                        ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-2 border-teal-500/50'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {conv.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                          {conv.preview}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {formatDate(conv.updatedAt)}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {conv.messageCount} messages
                          </span>
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === conv.id && (
                    <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg border-2 border-red-500 z-10">
                      <p className="text-sm text-slate-900 dark:text-slate-100 font-semibold mb-3">
                        Delete this conversation?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(conv.id)}
                          className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="flex-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {conversations.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              {showClearAllConfirm ? (
                <div className="space-y-2">
                  <p className="text-sm text-slate-900 dark:text-slate-100 font-semibold text-center mb-2">
                    Clear all conversations?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearAll}
                      className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowClearAllConfirm(false)}
                      className="flex-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearAllConfirm(true)}
                  className="w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-semibold transition-colors"
                >
                  Clear All History
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}