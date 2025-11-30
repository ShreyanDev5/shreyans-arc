import React, { useEffect } from 'react';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
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
                className="bg-dark-card border border-dark-border rounded-lg p-8 shadow-2xl w-[500px] max-w-[90vw] transform transition-all scale-100 relative"
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

                <h2 className="text-2xl font-bold text-white mb-4">Interactive Roadmap</h2>

                <div className="space-y-4 text-dark-text leading-relaxed">
                    <p>
                        Welcome to <span className="text-brand-primary font-semibold">Shreyan's Arc</span>.
                        This curated roadmap consists of 118 questions, offering the perfect "sweet spot" combination of the Blind 75 and NeetCode 150.
                    </p>
                    <p>
                        These are the most repeatedly asked questions by top product-based companies, making this the optimal tool for acing coding interviews quickly with maximum effectiveness and efficiency.
                    </p>

                    <ul className="space-y-2 list-disc list-inside text-dark-muted">
                        <li><strong className="text-white">Patterns:</strong> Each node represents a pattern (e.g., Arrays, Graphs). Click to see questions.</li>
                        <li><strong className="text-white">Connections:</strong> Lines show the recommended learning path and dependencies.</li>
                        <li><strong className="text-white">Progress:</strong> Mark questions as solved to see your progress bar fill up.</li>
                        <li><strong className="text-white">Navigation:</strong> Pan and zoom to explore the tree. Drag nodes to customize the layout (enable in settings).</li>
                    </ul>

                    <div className="pt-4 border-t border-dark-border mt-6">
                        <p className="text-xs text-dark-muted text-center">
                            Inspired by <a href="https://neetcode.io" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">NeetCode.io</a>. Good luck with your interview prep!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
