import React, { useMemo } from 'react';
import { User } from 'firebase/auth';
import { roadmapData } from '../data/questions';

interface SidebarProps {
    totalSolved: number;
    totalQuestions: number;
    overallProgress: number;
    solvedIds: Set<string>;
    user: User | null;
    onLogin: () => void;
    onLogout: () => void;
    isOpen: boolean;
    onClose: () => void;
    isConfigured: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    totalSolved,
    totalQuestions,
    overallProgress,
    solvedIds,
    user,
    onLogin,
    onLogout,
    isOpen,
    onClose,
    isConfigured
}) => {
    // Breakdown calculations
    const stats = useMemo(() => {
        let easyTotal = 0, easySolved = 0;
        let medTotal = 0, medSolved = 0;
        let hardTotal = 0, hardSolved = 0;
        let completedPatterns = 0;

        roadmapData.forEach(cat => {
            let catSolved = 0;
            cat.questions.forEach(q => {
                const isSolved = solvedIds.has(q.id);
                if (q.difficulty === 'Easy') {
                    easyTotal++;
                    if (isSolved) easySolved++;
                } else if (q.difficulty === 'Medium') {
                    medTotal++;
                    if (isSolved) medSolved++;
                } else if (q.difficulty === 'Hard') {
                    hardTotal++;
                    if (isSolved) hardSolved++;
                }
                if (isSolved) catSolved++;
            });
            if (cat.questions.length > 0 && catSolved === cat.questions.length) {
                completedPatterns++;
            }
        });

        return {
            easyTotal, easySolved,
            medTotal, medSolved,
            hardTotal, hardSolved,
            completedPatterns,
            totalPatterns: roadmapData.length
        };
    }, [solvedIds]);

    return (
        <>
            {/* Backdrop overlay for mobile & outside click */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className={`fixed right-3 sm:right-4 top-3 sm:top-4 w-[330px] max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100vh-2rem)] bg-dark-card/95 backdrop-blur-md border border-dark-border z-50 flex flex-col shadow-2xl rounded-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}
            >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-dark-border flex justify-between items-start">
                <div className="flex items-start gap-2.5">
                    <img src="/logo.svg" alt="Logo" className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                        <h2 className="text-[15px] font-semibold text-[#ededf0] tracking-tight leading-tight">Shreyan's Arc</h2>
                        <p className="text-[11px] font-mono tabular-nums text-dark-muted mt-0.5">DSA Roadmap</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 -mr-1 -mt-0.5 rounded-lg text-dark-muted hover:text-[#ededf0] hover:bg-dark-highlight transition-colors flex-shrink-0"
                    title="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Scrollable Metrics Content */}
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-3.5 overflow-y-auto custom-scrollbar">
                {/* Overall Progress Block */}
                <div className="p-3.5 bg-dark-bg/60 border border-dark-border/80 rounded-xl space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-dark-muted font-medium">Overall Progress</span>
                        <span className="font-mono tabular-nums font-semibold text-[#ededf0]">
                            {totalSolved} / {totalQuestions} <span className="text-dark-muted font-normal">({overallProgress}%)</span>
                        </span>
                    </div>

                    <div className="w-full h-2 bg-dark-bg border border-dark-border/80 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-accent transition-all duration-500 ease-out"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[11px] text-dark-muted">
                        <span>Patterns Completed</span>
                        <span className="font-mono tabular-nums font-medium text-emerald-400">
                            {stats.completedPatterns} / {stats.totalPatterns}
                        </span>
                    </div>
                </div>

                {/* Difficulty Cards */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-dark-bg/40 border border-dark-border/60 rounded-xl">
                        <div className="text-[11px] font-medium text-emerald-400">Easy</div>
                        <div className="text-sm font-mono tabular-nums font-semibold text-[#ededf0] mt-0.5">
                            {stats.easySolved}<span className="text-xs text-dark-muted font-normal">/{stats.easyTotal}</span>
                        </div>
                    </div>

                    <div className="p-2.5 bg-dark-bg/40 border border-dark-border/60 rounded-xl">
                        <div className="text-[11px] font-medium text-amber-400">Medium</div>
                        <div className="text-sm font-mono tabular-nums font-semibold text-[#ededf0] mt-0.5">
                            {stats.medSolved}<span className="text-xs text-dark-muted font-normal">/{stats.medTotal}</span>
                        </div>
                    </div>

                    <div className="p-2.5 bg-dark-bg/40 border border-dark-border/60 rounded-xl">
                        <div className="text-[11px] font-medium text-rose-400">Hard</div>
                        <div className="text-sm font-mono tabular-nums font-semibold text-[#ededf0] mt-0.5">
                            {stats.hardSolved}<span className="text-xs text-dark-muted font-normal">/{stats.hardTotal}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Auth Section */}
            <div className="p-3.5 sm:p-4 border-t border-dark-border mt-auto bg-dark-card/50">
                {/* Auth Row */}
                {!isConfigured ? (
                    <div className="w-full py-2 px-3 rounded-lg bg-dark-bg/80 border border-dark-border text-center text-xs font-mono text-dark-muted flex items-center justify-center gap-2 select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                        Guest Mode · Saved locally
                    </div>
                ) : user ? (
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full flex-shrink-0" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                    {user.displayName?.[0] || 'U'}
                                </div>
                            )}
                            <span className="text-xs font-medium text-white truncate">
                                {user.displayName || user.email || 'Signed in'}
                            </span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="px-2.5 py-1 rounded-md border border-dark-border text-dark-muted hover:text-white hover:bg-dark-highlight text-xs font-medium transition-colors flex-shrink-0"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onLogin}
                        className="w-full py-2 px-3.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-900 font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign in with Google
                    </button>
                )}
            </div>
        </div>
        </>
    );
};

export default Sidebar;
