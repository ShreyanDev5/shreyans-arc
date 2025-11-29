import React from 'react';
import clsx from 'clsx';
import { Category } from '../data/questions';

interface RoadmapNodeProps {
    category: Category;
    solvedIds: Set<string>;
    onClick: (c: Category) => void;
    x: number;
    y: number;
    scale: number;
    isDragging: boolean;
    onMouseDown: (e: React.MouseEvent, id: string) => void;
}

const RoadmapNode: React.FC<RoadmapNodeProps> = ({
    category,
    solvedIds,
    onClick,
    x,
    y,
    scale,
    isDragging,
    onMouseDown
}) => {
    const total = category.questions.length;
    const solved = category.questions.filter(q => solvedIds.has(q.id)).length;
    const isComplete = solved === total && total > 0;
    const progress = total > 0 ? Math.round((solved / total) * 100) : 0;
    // Dynamic styles for positioning
    const style: React.CSSProperties = {
        transform: `translate(${x}px, ${y}px)`,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '200px', // Fixed width for pill
        zIndex: 20,
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
                "group cursor-pointer select-none transition-shadow duration-300",
                "rounded-full border border-dark-border bg-dark-card",
                isComplete ? "shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                    : "shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            )}
        >
            {/* Progress Fill Background */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
                <div
                    className={clsx(
                        "h-full transition-all duration-500 opacity-20",
                        isComplete ? "bg-brand-accent" : "bg-brand-primary"
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Content */}
            <div className="relative px-4 py-3 flex items-center justify-between">
                <span className={clsx(
                    "font-semibold text-sm truncate",
                    isComplete ? "text-brand-accent" : "text-white"
                )}>
                    {category.title}
                </span>

                <div className={clsx(
                    "text-xs font-mono px-2 py-0.5 rounded-full",
                    isComplete ? "bg-brand-accent/20 text-brand-accent" : "bg-black/30 text-dark-muted"
                )}>
                    {solved}/{total}
                </div>
            </div>
        </div>
    );
};

export default RoadmapNode;
