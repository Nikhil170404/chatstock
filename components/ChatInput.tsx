'use client';

import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = '56px';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  return (
    <div className="w-full">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Input Container */}
        <div className="relative">
          <div className="flex items-end gap-2 sm:gap-3 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-slate-200 dark:border-slate-700 p-3 sm:p-4 transition-all duration-200 focus-within:border-teal-500 dark:focus-within:border-teal-400 focus-within:shadow-2xl focus-within:shadow-teal-500/20">
            
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about stocks, markets, or financial news..."
              disabled={disabled}
              rows={1}
              style={{ height: '56px' }}
              className="flex-1 resize-none bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none text-sm sm:text-base leading-relaxed max-h-[180px] overflow-y-auto scrollbar-thin py-3"
            />
            
            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={disabled || !input.trim()}
              className="flex-shrink-0 group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl font-semibold text-sm sm:text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 flex items-center gap-2">
                <span>Send</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          </div>
          
          {/* Helper Text */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-mono text-xs">Enter</kbd>
            <span>to send</span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-mono text-xs">Shift + Enter</kbd>
            <span>for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}