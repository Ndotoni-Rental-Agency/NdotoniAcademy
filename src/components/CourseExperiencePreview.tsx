import { CheckCircle2, HelpCircle } from 'lucide-react';

const question = {
  module: 'Module 2 · Project Lifecycle & Methodologies',
  progress: '2 / 6',
  text: 'Which process group comes immediately after Planning?',
  options: ['Closure', 'Execution', 'Initiation', 'Monitoring & Controlling'],
  correctIndex: 1,
};

export default function CourseExperiencePreview() {
  return (
    <div className="rounded-2xl border-2 border-ink-100 shadow-xl shadow-ink-900/5 overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-ink-50 border-b border-ink-100">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-coral-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-warm-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
        </div>
        <span className="ml-2 text-xs text-ink-400 font-mono">academy.ndotoni.com/courses/project-management</span>
      </div>

      {/* Panel body */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-xs font-semibold text-ink-500 truncate">{question.module}</p>
          </div>
          <span className="text-xs font-bold text-white bg-indigo-600 px-2.5 py-1 rounded-full flex-shrink-0">
            {question.progress}
          </span>
        </div>

        <p className="text-sm sm:text-base font-bold text-ink-900 mb-4">{question.text}</p>

        <div className="space-y-2 mb-4">
          {question.options.map((option, i) => {
            const isCorrect = i === question.correctIndex;
            return (
              <div
                key={option}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm ${
                  isCorrect ? 'border-brand-500 bg-brand-50' : 'border-ink-100'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                    isCorrect ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-300 text-ink-500'
                  }`}
                >
                  {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : String.fromCharCode(65 + i)}
                </span>
                <span className={isCorrect ? 'text-ink-900 font-semibold' : 'text-ink-600'}>{option}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-2 rounded-lg">
          <CheckCircle2 className="w-4 h-4" /> Correct! Moving to the next question.
        </div>
      </div>
    </div>
  );
}
