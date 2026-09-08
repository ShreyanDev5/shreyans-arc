import React, { useEffect } from 'react';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalQuestions: number;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-3 sm:p-4"
            onClick={onClose}
        >
            <div
                className="bg-dark-card/95 backdrop-blur-md border border-dark-border rounded-2xl p-4 sm:p-6 shadow-2xl w-full max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto custom-scrollbar transform transition-all relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-xl font-semibold text-[#ededf0] tracking-tight">About Shreyan's Arc</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 -mr-1 rounded-lg text-dark-muted hover:text-[#ededf0] hover:bg-dark-highlight transition-colors flex-shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="space-y-3 sm:space-y-3.5 text-[13px] sm:text-sm leading-relaxed text-[#c4c4cf]">
                    <p>
                        58 essential problems across 17 patterns, organized into a visual roadmap connecting NeetCode and Sean Prashad's curated sets:
                    </p>

                    {/* Symmetrical Curated Resources Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <a
                            href="https://neetcode.io/"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-dark-bg/60 hover:bg-dark-bg border border-dark-border/80 hover:border-zinc-500/50 transition-all group"
                        >
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-mono font-medium text-dark-muted">01</span>
                                <span className="text-[11.5px] sm:text-xs font-medium text-[#ededf0] group-hover:text-blue-400 transition-colors truncate">NeetCode · Blind 75</span>
                            </div>
                            <svg className="w-3.5 h-3.5 text-dark-muted group-hover:text-blue-400 transition-transform duration-200 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] flex-shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                            </svg>
                        </a>

                        <a
                            href="https://seanprashad.com/leetcode-patterns/"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-dark-bg/60 hover:bg-dark-bg border border-dark-border/80 hover:border-zinc-500/50 transition-all group"
                        >
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-mono font-medium text-dark-muted">02</span>
                                <span className="text-[11.5px] sm:text-xs font-medium text-[#ededf0] group-hover:text-blue-400 transition-colors truncate">Sean Prashad Patterns</span>
                            </div>
                            <svg className="w-3.5 h-3.5 text-dark-muted group-hover:text-blue-400 transition-transform duration-200 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] flex-shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                            </svg>
                        </a>
                    </div>

                    {/* Navigation & Shortcuts */}
                    <div className="bg-dark-bg/60 border border-dark-border/80 rounded-xl divide-y divide-dark-border/60 overflow-hidden text-xs">
                        <div className="px-3 py-1.5 sm:py-2 sm:px-3.5 flex items-center justify-between hover:bg-white/[0.015] transition-colors">
                            <span className="text-[#94949f]">Zoom in / out</span>
                            <div className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[10.5px] sm:text-[11px] font-mono text-[#ededf0] shadow-sm">+</kbd>
                                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[10.5px] sm:text-[11px] font-mono text-[#ededf0] shadow-sm">-</kbd>
                                <span className="text-zinc-600 font-mono text-[10px]">or</span>
                                <span className="text-dark-muted text-[10.5px] sm:text-[11px]">Scroll / pinch</span>
                            </div>
                        </div>

                        <div className="px-3 py-1.5 sm:py-2 sm:px-3.5 flex items-center justify-between hover:bg-white/[0.015] transition-colors">
                            <span className="text-[#94949f]">Center view</span>
                            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[10.5px] sm:text-[11px] font-mono text-[#ededf0] shadow-sm">0</kbd>
                        </div>

                        <div className="px-3 py-1.5 sm:py-2 sm:px-3.5 flex items-center justify-between hover:bg-white/[0.015] transition-colors">
                            <span className="text-[#94949f]">Pan</span>
                            <span className="text-[10.5px] sm:text-[11px] text-dark-muted">Click & drag</span>
                        </div>

                        <div className="px-3 py-1.5 sm:py-2 sm:px-3.5 flex items-center justify-between hover:bg-white/[0.015] transition-colors">
                            <span className="text-[#94949f]">Close</span>
                            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[10.5px] sm:text-[11px] font-mono text-[#ededf0] shadow-sm">Esc</kbd>
                        </div>
                    </div>

                    {/* Minimal Showcase Footer */}
                    <div className="pt-2.5 sm:pt-3.5 mt-3 sm:mt-4 border-t border-dark-border/80 flex items-center justify-between text-xs text-dark-muted">
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#ededf0]">Shreyan's Arc</span>
                            <span className="hidden sm:inline text-zinc-600">·</span>
                            <span className="hidden sm:inline text-[#94949f]">DSA Roadmap</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href="https://shreyandev.vercel.app/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[#94949f] hover:text-[#ededf0] transition-colors group"
                            >
                                <span>Shreyan Sardar</span>
                                <svg
                                    className="w-[13px] h-[13px] transition-transform duration-200 ease-out group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="7" y1="17" x2="17" y2="7" />
                                    <polyline points="7 7 17 7 17 17" />
                                </svg>
                            </a>

                            <span className="text-zinc-600 font-mono text-[11px]">/</span>

                            <a
                                href="https://github.com/ShreyanDev5/shreyans-arc"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-[#94949f] hover:text-[#ededf0] transition-colors group"
                            >
                                <svg
                                    className="w-[13px] h-[13px] transition-transform duration-200 ease-out group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                    <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg>
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
