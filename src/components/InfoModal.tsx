import React, { useEffect } from 'react';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalQuestions: number;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, totalQuestions }) => {
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

                <div className="space-y-3 text-dark-text leading-relaxed">
                    <p className="text-[15px]">
                        <span className="text-brand-primary font-semibold">{totalQuestions} handpicked problems.</span>{' '}
                        The exact questions top companies ask—optimized for New Grads & SDE-1 roles.
                    </p>

                    <div className="space-y-2 text-sm text-dark-muted">
                        <p>🎯 <span className="text-white">Click nodes</span> to reveal pattern-specific questions</p>
                        <p>📈 <span className="text-white">Track progress</span> as you solve and watch your bar grow</p>
                        <p>🗺️ <span className="text-white">Follow the path</span>—arrows guide the optimal learning order</p>
                    </div>

                    {/* J-Void Sister App Section */}
                    <div className="mt-4 pt-4 border-t border-dark-border">
                        <div className="bg-dark-bg/60 border border-dark-border rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">✨</span>
                                <h3 className="text-white font-semibold text-base">J-Void – Java Practice</h3>
                            </div>
                            <p className="text-dark-muted text-sm leading-relaxed mb-3">
                                A distraction-free environment to practice Java.<br />
                                <span className="text-dark-text font-medium">No execution, no output, no noise—just you and the code.</span>
                            </p>
                            <a
                                href="https://j-void.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 border border-dark-border hover:border-brand-primary/60 hover:bg-dark-highlight text-white text-xs font-semibold rounded-lg transition-all"
                            >
                                Try it now
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <p className="text-[11px] text-dark-muted text-center pt-2">
                        Inspired by <a href="https://neetcode.io" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">NeetCode.io</a> · Good luck crushing those interviews! 🚀
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
