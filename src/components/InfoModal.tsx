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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-dark-card border border-dark-border rounded-lg p-5 shadow-2xl w-[500px] max-w-[90vw] transform transition-all scale-100 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-dark-muted hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">Your DSA Interview Roadmap</h2>

                <div className="space-y-4 text-dark-text leading-relaxed">
                    <p className="text-sm leading-relaxed text-dark-text">
                        Combines the <a href="https://neetcode.io" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-medium hover:underline">Blind 75 list (popularized by NeetCode)</a> with key problems from <a href="https://seanprashad.com/leetcode-patterns/" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-medium hover:underline">Sean Prashad&apos;s LeetCode Patterns</a>—built to master essential DSA patterns in minimal time.
                    </p>

                    <div className="space-y-2 text-sm text-dark-muted">
                        <p>📌 <span className="text-white font-medium">Click nodes</span> to view pattern-specific questions</p>
                        <p>📌 <span className="text-white font-medium">Track progress</span> as you solve problems</p>
                        <p>📌 <span className="text-white font-medium">Follow arrows</span> for the optimal learning sequence</p>
                    </div>

                    {/* J-Void Project Section */}
                    <div className="mt-4 pt-4 border-t border-dark-border">
                        <div className="bg-dark-bg/60 border border-dark-border rounded-xl p-4">
                            <h3 className="text-white font-semibold text-base mb-1.5">J-Void – Java Practice</h3>
                            <p className="text-dark-muted text-sm leading-relaxed mb-3">
                                Check out <span className="text-white font-medium">J-Void</span>, another project of mine offering a distraction-free Java coding environment—no execution, no output, no noise.
                            </p>
                            <a
                                href="https://j-void.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 border border-dark-border hover:border-brand-primary/60 hover:bg-dark-highlight text-white text-xs font-semibold rounded-lg transition-all"
                            >
                                Explore J-Void
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
