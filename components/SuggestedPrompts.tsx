interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  {
    icon: "📈",
    text: "What is the current price of TCS stock?",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: "📰",
    text: "Latest news about Reliance Industries",
    color: "from-emerald-500 to-teal-600"
  },
  {
    icon: "🔥",
    text: "Which stocks are trending in Indian market today?",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: "⚖️",
    text: "Compare HDFC Bank and ICICI Bank performance",
    color: "from-purple-500 to-pink-600"
  }
];

export default function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-6">
        <p className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-400 mb-2">
          ✨ Try asking:
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt.text)}
            className="group relative overflow-hidden"
          >
            {/* Gradient Background Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${prompt.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl`}></div>
            
            {/* Card */}
            <div className="relative bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 group-hover:border-transparent group-hover:shadow-2xl group-hover:scale-105 group-hover:-translate-y-1">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${prompt.color} flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  {prompt.icon}
                </div>
                
                {/* Text */}
                <div className="flex-1 pt-1">
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                    {prompt.text}
                  </p>
                </div>
                
                {/* Arrow Icon */}
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}