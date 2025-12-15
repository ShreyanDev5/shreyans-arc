import React from 'react';
import clsx from 'clsx';

interface SettingsPanelProps {
    settings: {
        allowPan: boolean;
        allowZoom: boolean;
        allowDrag: boolean;
    };
    onToggle: (key: keyof SettingsPanelProps['settings']) => void;
    isOpen: boolean;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onToggle, isOpen, onClose }) => {
    React.useEffect(() => {
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
                className="bg-dark-card border border-dark-border rounded-lg p-5 shadow-2xl w-80 transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white tracking-wide">Settings</h3>
                    <button onClick={onClose} className="text-dark-muted hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
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
