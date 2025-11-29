import React from 'react';
import clsx from 'clsx';

interface SidebarProps {
    totalSolved: number;
    totalQuestions: number;
    overallProgress: number;
}

const Sidebar: React.FC<SidebarProps> = ({ totalSolved, totalQuestions, overallProgress }) => {
    return (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-dark-card border-l border-dark-border z-50 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-dark-border">
                <h2 className="text-xl font-bold text-white mb-1">NeetCode 150</h2>
                <p className="text-xs text-dark-muted font-mono">INTERACTIVE ROADMAP</p>
            </div>

            {/* Progress Section */}
            <div className="p-6">
                <div className="flex justify-between text-sm font-medium text-dark-muted mb-2">
                    <span>Total Progress</span>
                    <span className="text-white">{totalSolved} / {totalQuestions}</span>
                </div>
                <div className="w-full h-3 bg-dark-bg border border-dark-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-accent transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
                <p className="text-xs text-dark-muted mt-3 text-center">
                    {overallProgress === 100 ? "Mastery Achieved!" : "Keep grinding!"}
                </p>
            </div>

            {/* Roadmap Selector (Placeholder for now) */}
            <div className="p-6 border-t border-dark-border mt-auto">
                <h3 className="text-sm font-semibold text-white mb-3">Select Roadmap</h3>
                <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-brand-primary font-medium text-sm">
                        Algorithms & Data Structures
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg bg-dark-bg border border-dark-border text-dark-muted hover:text-white hover:border-dark-highlight transition-colors text-sm">
                        System Design (Coming Soon)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
