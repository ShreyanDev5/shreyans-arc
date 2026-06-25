import React from 'react';
import { User } from 'firebase/auth';

interface SidebarProps {
    totalSolved: number;
    totalQuestions: number;
    overallProgress: number;
    user: User | null;
    onLogin: () => void;
    onLogout: () => void;
    onOpenSettings: () => void;
    onReset: () => void;
    onOpenInfo: () => void;
    isOpen: boolean;
    onClose: () => void;
    isConfigured: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    totalSolved,
    totalQuestions,
    overallProgress,
    user,
    onLogin,
    onLogout,
    onOpenSettings,
    onReset,
    onOpenInfo,
    isOpen,
    onClose,
    isConfigured
}) => {
    const getMotivationalMessage = (progress: number, solved: number) => {
        if (progress === 100) return "Mastery Unlocked! You're ready. 🚀";
        if (progress === 0) return "Your journey starts here.";

        const messages = {
            early: [ // 1-24%
                "Off to a great start!",
                "Consistency is key. Keep going.",
                "One problem at a time.",
                "Building your foundation...",
                "Small steps, big results."
            ],
            building: [ // 25-49%
                "You're getting the hang of this!",
                "Momentum is building.",
                "Keep pushing, you're doing great.",
                "Don't break the streak!",
                "Leveling up, one day at a time."
            ],
            strong: [ // 50-74%
                "Halfway there! Unstoppable.",
                "You're crushing the core patterns.",
                "Serious progress detected.",
                "Nothing can stop you now.",
                "Turning algorithms into muscle memory."
            ],
            advanced: [ // 75-89%
                "Elite territory. Keep focused.",
                "Almost at the finish line!",
                "Polishing your skills for the interview.",
                "Stay sharp, you're nearly there.",
                "The hard work is paying off."
            ],
            final: [ // 90-99%
                "Final stretch! Finish strong.",
                "So close to 100%. Don't stop!",
                "One last push for mastery.",
                " Victory is in sight.",
                "You've come so far. Finish it!"
            ]
        };

        let pool: string[] = [];
        if (progress < 25) pool = messages.early;
        else if (progress < 50) pool = messages.building;
        else if (progress < 75) pool = messages.strong;
        else if (progress < 90) pool = messages.advanced;
        else pool = messages.final;

        // Deterministic rotation based on solved count to keep it fresh but stable
        return pool[solved % pool.length];
    };

    return (
        <div
            className={`fixed right-4 top-4 w-80 max-h-[calc(100vh-2rem)] bg-dark-card border border-dark-border z-50 flex flex-col shadow-2xl rounded-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-dark-border flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
                    <div>
                        <h2 className="text-xl font-bold text-white leading-tight">Shreyan's Arc</h2>
                    </div>
                </div>
                <button onClick={onClose} className="text-dark-muted hover:text-white transition-colors p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Progress Section */}
            <div className="py-6 px-5">
                <div className="flex justify-between text-sm font-medium text-dark-muted mb-2">
                    <span>Total Progress</span>
                    <span className="text-white">{totalSolved} / {totalQuestions}</span>
                </div>
                <div className="w-full h-2 bg-dark-bg border border-dark-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-accent transition-all duration-700 ease-out"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
                <p className="text-xs font-mono text-dark-muted mt-3 text-center h-4 flex items-center justify-center transition-all duration-300 select-none">
                    {getMotivationalMessage(overallProgress, totalSolved)}
                </p>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 border-t border-dark-border mt-auto flex flex-col gap-4 items-center">
                {/* Action Buttons Row */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onReset}
                        className="p-2 text-dark-muted hover:text-white transition-colors rounded-full hover:bg-dark-bg"
                        title="Reset graph position"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                            <path d="M3 3v5h5"></path>
                        </svg>
                    </button>

                    <button
                        onClick={onOpenSettings}
                        className="p-2 text-dark-muted hover:text-white transition-colors rounded-full hover:bg-dark-bg"
                        title="Settings"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>

                    <button
                        onClick={onOpenInfo}
                        className="p-2 text-dark-muted hover:text-white transition-colors rounded-full hover:bg-dark-bg"
                        title="What's this?"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </button>
                </div>

                {/* Auth Button */}
                {!isConfigured ? (
                    <div className="w-full py-2.5 px-4 rounded-lg bg-dark-bg border border-dark-border text-center text-xs font-mono text-dark-muted flex items-center justify-center gap-2 select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                        Guest Mode (Local Storage)
                    </div>
                ) : user ? (
                    <button
                        onClick={onLogout}
                        className="w-full py-2 px-4 rounded-lg border border-dark-border text-dark-muted hover:text-white hover:bg-dark-bg transition-all text-sm font-medium flex items-center justify-center gap-2"
                    >
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-5 h-5 rounded-full" />
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-xs">
                                {user.displayName?.[0] || 'U'}
                            </div>
                        )}
                        Sign Out
                    </button>
                ) : (
                    <button
                        onClick={onLogin}
                        className="w-full py-2 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm border border-slate-200"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign in with Google
                    </button>
                )}
            </div>        </div>
    );
};

export default Sidebar;
