export default function TypingIndicator() {
  return (
    <div className="flex w-full justify-start animate-fade-in">
      <div className="flex max-w-[85%] sm:max-w-[75%] flex-row gap-2 sm:gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30 animate-pulse">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>

        {/* Typing Animation */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20"></div>
          <div className="relative px-6 py-4 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-lg rounded-bl-md">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}