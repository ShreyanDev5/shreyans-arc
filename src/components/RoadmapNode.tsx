import React from 'react';
import clsx from 'clsx';
import { Category } from '../data/questions';

interface RoadmapNodeProps {
    category: Category;
    solvedIds: Set<string>;
    onClick: (c: Category) => void;
    x: number;
    y: number;
    isDragging: boolean;
    onMouseDown: (e: React.MouseEvent, id: string) => void;
}

const RoadmapNode: React.FC<RoadmapNodeProps> = ({
    category,
    solvedIds,
    onClick,
    x,
    y,
    isDragging,
    onMouseDown
}) => {
    const total = category.questions.length;
    const solved = category.questions.filter(q => solvedIds.has(q.id)).length;
    const isComplete = solved === total && total > 0;
    const progress = total > 0 ? Math.round((solved / total) * 100) : 0;

    // Dynamic styles for positioning and sizing
    const style: React.CSSProperties = {
        transform: `translate(${x}px, ${y}px)`,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '240px',
        zIndex: 20,
        fontSize: '20px',
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent canvas drag start
        onMouseDown(e, category.id);
    };

    return (
        <div
            style={style}
            onMouseDown={handleMouseDown}
            onClick={(e) => {
                if (!isDragging) onClick(category);
            }}
            className={clsx(
                "group cursor-pointer select-none transition-all duration-300 overflow-hidden",
                "rounded-xl border shadow-md",
                isComplete 
                    ? "bg-brand-accent/5 border-brand-accent/50 hover:border-brand-accent hover:bg-brand-accent/10" 
                    : "bg-dark-card border-dark-border hover:border-brand-primary/50 hover:bg-dark-highlight/20"
            )}
        >
            {/* Minimal Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/25" style={{ height: '4px' }}>
                <div
                    className={clsx(
                        "h-full transition-all duration-500",
                        isComplete ? "bg-brand-accent" : "bg-brand-primary"
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Content */}
            <div className="relative flex flex-col items-center justify-center gap-1.5" style={{ padding: '20px 16px 24px 16px' }}>
                <span className="font-semibold text-white text-center leading-tight" style={{ fontSize: '0.9em' }}>
                    {category.title}
                </span>
                {total > 0 && (
                    <span className="text-xs font-mono text-dark-muted group-hover:text-dark-text/80 transition-colors">
                        {solved} / {total}
                    </span>
                )}
            </div>
        </div>
    );
};

export default RoadmapNode;
