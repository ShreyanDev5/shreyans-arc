import React, { useState } from 'react';
import clsx from 'clsx';

interface SettingsPanelProps {
    settings: {
        allowPan: boolean;
        allowZoom: boolean;
        allowDrag: boolean;
    };
    onToggle: (key: keyof SettingsPanelProps['settings']) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-6 right-84 z-50 flex items-start gap-2">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 bg-dark-card border border-dark-border rounded-lg text-dark-muted hover:text-white hover:border-dark-highlight transition-colors shadow-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </button>

            {/* Panel */}
            {isOpen && (
                <div className="bg-dark-card border border-dark-border rounded-lg p-4 shadow-2xl w-64 animate-fade-in">
                    <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Interaction Settings</h3>

                    <div className="space-y-3">
                        <ToggleRow
                            label="Enable Panning"
                            active={settings.allowPan}
                            onClick={() => onToggle('allowPan')}
                        />
                        <ToggleRow
                            label="Enable Zooming"
                            active={settings.allowZoom}
                            onClick={() => onToggle('allowZoom')}
                        />
                        <div className="h-px bg-dark-border my-2" />
                        <ToggleRow
                            label="Edit Layout (Drag)"
                            active={settings.allowDrag}
                            onClick={() => onToggle('allowDrag')}
                            danger
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const ToggleRow: React.FC<{ label: string; active: boolean; onClick: () => void; danger?: boolean }> = ({ label, active, onClick, danger }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-dark-muted">{label}</span>
        <button
            onClick={onClick}
            className={clsx(
                "w-10 h-5 rounded-full relative transition-colors duration-300",
                active ? (danger ? "bg-brand-danger" : "bg-brand-accent") : "bg-dark-bg border border-dark-border"
            )}
        >
            <div className={clsx(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm",
                active ? "left-5" : "left-0.5"
            )} />
        </button>
    </div>
);

export default SettingsPanel;
