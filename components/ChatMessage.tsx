import { Message } from '@/lib/types';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-teal-500 dark:bg-teal-600'
            : 'bg-slate-300 dark:bg-slate-600'
        }`}>
          <span className="text-white font-semibold text-sm">
            {isUser ? 'U' : 'AI'}
          </span>
        </div>

        {/* Message bubble */}
        <div className={`rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 ${
          isUser
            ? 'bg-teal-500 text-white dark:bg-teal-600'
            : 'bg-white text-slate-800 dark:bg-slate-700 dark:text-slate-100'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
