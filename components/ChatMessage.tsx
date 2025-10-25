import { Message } from '@/lib/types';

interface ChatMessageProps {
  message: Message;
}

// Function to format message content with proper styling
function formatMessageContent(content: string) {
  // Split into lines
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let currentSection: string | null = null;

  const flushListItems = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="space-y-2 my-3 ml-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-teal-500 dark:text-teal-400 mt-1 flex-shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInlineStyles(item) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      flushListItems(`list-${index}`);
      if (elements.length > 0) {
        elements.push(<div key={`space-${index}`} className="h-3" />);
      }
      return;
    }

    // Handle section headers (lines with ** at start and end)
    if (trimmedLine.match(/^\*\*.*\*\*:?$/)) {
      flushListItems(`list-${index}`);
      const headerText = trimmedLine.replace(/^\*\*|\*\*:?$/g, '');
      elements.push(
        <h3 key={`header-${index}`} className="font-bold text-slate-800 dark:text-slate-100 mt-4 mb-2 text-base">
          {headerText}
        </h3>
      );
      currentSection = headerText;
      return;
    }

    // Handle bullet points
    if (trimmedLine.match(/^[\*\-•]\s/)) {
      const bulletText = trimmedLine.replace(/^[\*\-•]\s+/, '');
      listItems.push(bulletText);
      return;
    }

    // Regular paragraph
    flushListItems(`list-${index}`);
    elements.push(
      <p 
        key={`p-${index}`} 
        className="leading-relaxed my-2"
        dangerouslySetInnerHTML={{ __html: formatInlineStyles(trimmedLine) }}
      />
    );
  });

  // Flush any remaining list items
  flushListItems('list-final');

  return elements;
}

// Format inline styles (bold, italic, etc.)
function formatInlineStyles(text: string): string {
  // Bold text: **text** or __text__
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-slate-50">$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong class="font-bold text-slate-900 dark:text-slate-50">$1</strong>');
  
  // Italic text: *text* or _text_
  text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  text = text.replace(/_(.+?)_/g, '<em class="italic">$1</em>');
  
  // Inline code: `code`
  text = text.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-sm font-mono">$1</code>');
  
  return text;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-[90%] sm:max-w-[80%] lg:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2 sm:gap-3`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform ${
            isUser
              ? 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/30'
              : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30'
          }`}>
            {isUser ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
          </div>
        </div>

        {/* Message Bubble */}
        <div className={`group relative ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Bubble Effect */}
          {!isUser && (
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          )}
          
          <div className={`relative px-4 sm:px-6 py-3 sm:py-4 rounded-3xl shadow-lg transition-all duration-200 hover:shadow-xl ${
            isUser
              ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-br-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-700 rounded-bl-md'
          }`}>
            <div className="text-sm sm:text-base">
              {isUser ? (
                <p className="leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              ) : (
                <div className="space-y-1">
                  {formatMessageContent(message.content)}
                </div>
              )}
            </div>
          </div>
          
          {/* Timestamp */}
          {message.timestamp && (
            <div className={`mt-1.5 px-2 text-xs text-slate-400 dark:text-slate-500 ${isUser ? 'text-right' : 'text-left'}`}>
              {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}