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
    onClose
}) => {
    return (
        <div
            className={`fixed right-0 top-0 bottom-0 w-80 bg-dark-card border-l border-dark-border z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-dark-border flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1">Shreyan's Arc</h2>
                    <p className="text-xs text-dark-muted font-mono">INTERACTIVE ROADMAP</p>
                </div>
                <button onClick={onClose} className="text-dark-muted hover:text-white transition-colors p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Progress Section */}
            <div className="p-6">
                <div className="flex justify-between text-sm font-medium text-dark-muted mb-2">
                    <span>Total Progress</span>
                    <span className="text-white">{totalSolved} / {totalQuestions}</span>
                </div>
                <div className="w-full h-3 bg-dark-bg border border-dark-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#16a34a] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(22,163,74,0.4)]"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
                <p className="text-xs text-dark-muted mt-3 text-center">
                    {totalSolved === totalQuestions ? "Mastery Achieved!" :
                        overallProgress === 0 ? "Start your journey!" :
                            overallProgress < 25 ? "Off to a great start!" :
                                overallProgress < 50 ? "Keep grinding!" :
                                    overallProgress < 75 ? "You're crushing it!" :
                                        "Almost there!"}
                </p>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-dark-border mt-auto flex flex-col gap-4 items-center">
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                {user ? (
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
                        className="w-full py-2 px-4 rounded-lg bg-[#2563eb] text-white font-medium text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                    >
                        Login to Save Progress
                    </button>
                )}
            </div>        </div>
    );
};

export default Sidebar;
