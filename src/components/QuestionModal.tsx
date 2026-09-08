import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Category } from '../data/questions';
import clsx from 'clsx';

interface QuestionModalProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  solvedIds: Set<string>;
  toggleQuestion: (id: string) => void;
  highlightedQuestionId?: string | null;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  category,
  isOpen,
  onClose,
  solvedIds,
  toggleQuestion,
  highlightedQuestionId
}) => {
  const [highlightedId, setHighlightedId] = useState<string | null>(highlightedQuestionId || null);
  const highlightItemRef = useRef<HTMLDivElement | null>(null);

  // Handle Esc key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle auto-scroll and subtle hover-effect highlight that smoothly fades away without delay
  useEffect(() => {
    if (highlightedQuestionId && isOpen) {
      setHighlightedId(highlightedQuestionId);

      const scrollTimer = setTimeout(() => {
        highlightItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);

      const fadeTimer = setTimeout(() => {
        setHighlightedId(null);
      }, 800);

      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(fadeTimer);
      };
    } else {
      setHighlightedId(null);
    }
  }, [highlightedQuestionId, isOpen]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-dark-card/95 backdrop-blur-md border border-dark-border rounded-2xl shadow-2xl animate-slide-up max-h-[calc(100dvh-1.5rem)] sm:max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-dark-border bg-dark-card/80">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-base sm:text-xl font-semibold text-[#ededf0] tracking-tight truncate pr-4">{category.title}</h2>
              <p className="text-xs text-dark-muted mt-0.5 font-normal">Click a problem to open on LeetCode</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 -mr-1 -mt-0.5 rounded-lg text-dark-muted hover:text-[#ededf0] hover:bg-dark-highlight transition-colors flex-shrink-0"
            >
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-medium mb-2">
            {progress === 100 ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2.5 6.2 4.8 8.5 9.5 3.5" />
                  </svg>
                </span>
                <span>Completed</span>
              </div>
            ) : (
              <span className="text-dark-muted">Progress</span>
            )}
            <span className={clsx("font-mono tabular-nums font-medium", progress === 100 ? "text-emerald-400 font-semibold" : "text-[#ededf0]")}>
              {solvedCount} of {total} ({progress}%)
            </span>
          </div>

          <div className="w-full h-1.5 bg-dark-bg rounded-full overflow-hidden border border-dark-border/80">
            <div
              className={clsx(
                "h-full transition-all duration-500 rounded-full",
                progress === 100 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-brand-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-3 sm:p-5 space-y-2 custom-scrollbar bg-dark-bg/20">
          {sortedQuestions.map((q) => {
            const isSolved = solvedIds.has(q.id);
            const isHighlighted = highlightedId === q.id;

            return (
              <div
                key={q.id}
                ref={isHighlighted ? highlightItemRef : undefined}
                onClick={() => toggleQuestion(q.id)}
                className={clsx(
                  "flex items-center gap-3 p-3 rounded-xl border transition-colors duration-700 ease-out group cursor-pointer select-none",
                  isSolved
                    ? (isHighlighted
                        ? "bg-[#161c18] border-emerald-500/50"
                        : "bg-[#141815]/60 border-emerald-500/30 hover:border-emerald-500/50 hover:bg-[#161c18]")
                    : (isHighlighted
                        ? "bg-[#1a1a20] border-zinc-500/60"
                        : "bg-dark-card/90 border-dark-border hover:border-zinc-500/60 hover:bg-[#1a1a20]")
                )}
              >
                {/* Checkbox */}
                <div className="flex-shrink-0">
                  <div
                    className={clsx(
                      "w-5 h-5 border rounded-md transition-all duration-150 flex items-center justify-center",
                      isSolved 
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.25)]" 
                        : isHighlighted
                          ? "border-zinc-400 bg-dark-bg"
                          : "border-zinc-600 bg-dark-bg group-hover:border-zinc-400"
                    )}
                  >
                    {isSolved && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="flex-grow min-w-0 pr-2">
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={clsx(
                      "font-medium text-[13.5px] transition-colors inline-flex items-center gap-1.5 hover:text-brand-primary group-hover:translate-x-0.5 transition-transform max-w-full",
                      isSolved ? "text-[#8e8e99] font-normal hover:text-[#ededf0]" : "text-[#ededf0]"
                    )}
                    title="Open on LeetCode"
                  >
                    <span className="truncate">{q.title}</span>
                    <svg className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                {/* Difficulty */}
                <div className="flex-shrink-0">
                  <span className={clsx(
                    "text-[10.5px] font-mono tabular-nums font-medium px-2 py-0.5 rounded-md border",
                    q.difficulty === 'Easy' && "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
                    q.difficulty === 'Medium' && "bg-amber-500/10 border-amber-500/25 text-amber-400",
                    q.difficulty === 'Hard' && "bg-rose-500/10 border-rose-500/25 text-rose-400",
                  )}>
                    {q.difficulty}
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