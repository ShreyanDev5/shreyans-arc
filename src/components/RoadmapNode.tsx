import React from 'react';
import clsx from 'clsx';
import { Category } from '../data/questions';
import { ROADMAP_NODE_WIDTH } from '../data/layout';

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
    const isInProgress = solved > 0 && !isComplete;
    const progress = total > 0 ? Math.round((solved / total) * 100) : 0;

    // Dynamic styles for positioning and sizing
    const style: React.CSSProperties = {
        transform: `translate(${x}px, ${y}px)`,
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${ROADMAP_NODE_WIDTH}px`,
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
                "group cursor-pointer select-none overflow-hidden",
                !isDragging && "transition-all duration-300",
                "rounded-xl border-2 shadow-md",
                isComplete 
                    ? "bg-[#059669] border-[#059669] hover:bg-[#047857] hover:border-[#047857]" 
                    : isInProgress
                        ? "bg-[#202020] border-brand-primary/80 hover:border-brand-primary hover:bg-[#2c2c2c]"
                        : "bg-[#202020] border-dark-border hover:border-brand-primary/60 hover:bg-[#2c2c2c]"
            )}
        >
            {/* Minimal Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/25" style={{ height: '6px' }}>
                <div
                    className={clsx(
                        "h-full transition-all duration-500",
                        isComplete ? "bg-brand-accent" : "bg-brand-primary"
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Content */}
            <div className="relative flex flex-col items-center justify-center gap-1.5" style={{ padding: '18px 20px 24px 20px' }}>
                <span className="font-bold text-white text-center leading-tight text-[18px] tracking-wide">
                    {category.title}
                </span>
                {total > 0 && (
                    <span className={clsx(
                        "text-sm font-mono transition-colors",
                        isComplete ? "text-emerald-100/90" : "text-dark-muted group-hover:text-white/80"
                    )}>
                        {solved} / {total}
                    </span>
                )}
            </div>
        </div>
    );
};

export default RoadmapNode;
