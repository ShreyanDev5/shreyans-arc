import React, { useMemo, useEffect } from 'react';
import { Category, Question } from '../data/questions';
import clsx from 'clsx';

interface QuestionModalProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  solvedIds: Set<string>;
  toggleQuestion: (id: string) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  category,
  isOpen,
  onClose,
  solvedIds,
  toggleQuestion
}) => {

  // Handle Esc key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const total = category.questions.length;
  const solvedCount = category.questions.filter(q => solvedIds.has(q.id)).length;
  const progress = Math.round((solvedCount / total) * 100);

  // Sorting Logic: Easy -> Medium -> Hard
  const sortedQuestions = useMemo(() => {
    const difficultyWeight = { Easy: 0, Medium: 1, Hard: 2 };
    return [...category.questions].sort((a, b) => difficultyWeight[a.difficulty] - difficultyWeight[b.difficulty]);
  }, [category.questions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-[95%] md:w-full md:max-w-3xl bg-dark-card border border-dark-border rounded-xl shadow-2xl animate-slide-up max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-dark-border bg-dark-card rounded-t-xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate pr-4">{category.title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-dark-muted hover:text-white hover:bg-dark-highlight transition-all flex-shrink-0"
            >
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between text-sm font-medium text-dark-muted mb-2">
            <span>Progress</span>
            <span className={clsx(progress === 100 ? "text-brand-accent" : "")}>{solvedCount} / {total}</span>
          </div>

          <div className="w-full h-2.5 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
            <div
              className={clsx(
                "h-full transition-all duration-500 rounded-full",
                progress === 100 ? "bg-brand-accent" : "bg-brand-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-3 sm:p-4 space-y-2 custom-scrollbar bg-dark-bg/30">
          {/* Headers */}
          <div className="grid grid-cols-12 gap-2 sm:gap-4 px-2 sm:px-4 py-2 text-xs font-mono text-dark-muted uppercase tracking-wider border-b border-dark-border/50 mb-2">
            <div className="col-span-2 text-center">
              <span className="hidden sm:inline">Status</span>
              <span className="sm:hidden">Sts</span>
            </div>
            <div className="col-span-8">
              <span className="hidden sm:inline">Problem</span>
              <span className="sm:hidden">Prob</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="hidden sm:inline">Difficulty</span>
              <span className="sm:hidden">Diff</span>
            </div>
          </div>

          {sortedQuestions.map((q) => {
            const isSolved = solvedIds.has(q.id);
            const difficultyBorder = {
              Easy: "border-brand-accent/20",
              Medium: "border-brand-warning/20",
              Hard: "border-brand-danger/20"
            }[q.difficulty];

            return (
              <div
                key={q.id}
                className={clsx(
                  "grid grid-cols-12 gap-2 sm:gap-4 items-center p-2 sm:p-3 rounded-lg border transition-all duration-200 group",
                  isSolved
                    ? "bg-dark-highlight/10 border-brand-accent/20"
                    : clsx(
                      "bg-dark-card hover:border-dark-highlight hover:bg-dark-highlight/30",
                      difficultyBorder
                    )
                )}
              >
                {/* Checkbox Column */}
                <div className="col-span-2 flex justify-center">
                  <label className="checkbox-wrapper relative cursor-pointer flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={isSolved}
                      onChange={() => toggleQuestion(q.id)}
                    />
                    <div className={clsx(
                      "w-5 h-5 border-2 rounded transition-all flex items-center justify-center",
                      isSolved ? "bg-brand-accent border-brand-accent" : "border-dark-highlight bg-dark-bg hover:border-brand-primary/50"
                    )}>
                      <svg className="w-3.5 h-3.5 text-dark-bg hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>
                </div>

                {/* Title Column */}
                <div className="col-span-8">
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noreferrer"
                    className={clsx(
                      "font-medium text-sm transition-colors hover:text-brand-primary block break-words",
                      isSolved ? "text-dark-muted line-through opacity-70" : "text-dark-text"
                    )}
                  >
                    {q.title}
                  </a>
                </div>

                {/* Difficulty Column */}
                <div className="col-span-2 text-right">
                  <span className={clsx(
                    "text-[10px] sm:text-xs font-mono font-bold",
                    q.difficulty === 'Easy' && "text-brand-accent",
                    q.difficulty === 'Medium' && "text-brand-warning",
                    q.difficulty === 'Hard' && "text-brand-danger",
                  )}>
                    {q.difficulty.slice(0, 1)}<span className="hidden sm:inline">{q.difficulty.slice(1)}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};