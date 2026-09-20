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
}

const RoadmapNode: React.FC<RoadmapNodeProps> = ({
    category,
    solvedIds,
    onClick,
    x,
    y
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

    return (
        <div
            style={style}
            onClick={() => onClick(category)}
            className={clsx(
                "group cursor-pointer select-none overflow-hidden relative",
                "transition-all duration-150 ease-out hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]",
                "rounded-xl border shadow-sm",
                isComplete 
                    ? "bg-[#141a16] border-emerald-500/35 hover:border-emerald-500/70 hover:bg-[#151f18]" 
                    : isInProgress
                        ? "bg-[#14171f] border-brand-primary/40 hover:border-blue-500/70 hover:bg-[#161a26]"
                        : "bg-[#161619] border-dark-border hover:border-zinc-500/70 hover:bg-[#1b1b20]"
            )}
        >
            {/* Content */}
            <div className="relative flex flex-col items-center justify-center gap-1.5 h-[74px] px-3 pt-2 pb-3.5">
                <span className="font-medium text-center leading-snug text-[12.5px] tracking-[-0.01em] line-clamp-2 text-[#ededf0] group-hover:text-white transition-colors max-w-full px-1">
                    {category.title}
                </span>

                {total > 0 && (
                    <span className={clsx(
                        "text-[10.5px] font-mono tabular-nums font-medium px-2.5 py-0.5 rounded-full border leading-none transition-colors",
                        isComplete 
                            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 group-hover:border-emerald-500/50" 
                            : isInProgress
                                ? "bg-brand-primary/10 border-brand-primary/25 text-blue-400 group-hover:border-blue-400/50"
                                : "bg-white/[0.03] border-white/10 text-[#94949f] group-hover:border-white/20 group-hover:text-[#ededf0]"
                    )}>
                        {solved} / {total}
                    </span>
                )}
            </div>

            {/* Inset Floating Progress Capsule Bar */}
            <div className="absolute bottom-2 left-3.5 right-3.5 h-[4.5px] bg-black/60 rounded-full overflow-hidden">
                <div
                    className={clsx(
                        "h-full rounded-full transition-all duration-300 ease-out",
                        isComplete 
                            ? "bg-emerald-500 group-hover:bg-emerald-400" 
                            : "bg-brand-primary group-hover:bg-blue-400"
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default RoadmapNode;
