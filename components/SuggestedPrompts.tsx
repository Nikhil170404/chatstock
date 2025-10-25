interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  "What is the current price of TCS stock?",
  "Latest news about Reliance Industries",
  "Which stocks are trending in Indian market today?",
  "Compare HDFC Bank and ICICI Bank performance"
];

export default function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="mb-6">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-medium">
        Try asking:
      </p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt)}
            className="px-4 py-2 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
