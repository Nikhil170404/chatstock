export default function TypingIndicator() {
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="flex max-w-[80%] flex-row gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-300 dark:bg-slate-600">
          <span className="text-white font-semibold text-sm">AI</span>
        </div>

        {/* Typing animation */}
        <div className="rounded-2xl px-4 py-3 bg-white dark:bg-slate-700 shadow-sm">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
