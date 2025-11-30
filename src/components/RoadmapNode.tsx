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
    panX: number;
    panY: number;
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
    panX,
    panY,
    isDragging,
    onMouseDown
}) => {
    const total = category.questions.length;
    const solved = category.questions.filter(q => solvedIds.has(q.id)).length;
    const isComplete = solved === total && total > 0;
    const progress = total > 0 ? Math.round((solved / total) * 100) : 0;

    // Screen space coordinates
    const screenX = x * scale + panX;
    const screenY = y * scale + panY;

    // Dynamic styles for positioning and sizing
    const style: React.CSSProperties = {
        transform: `translate(${screenX}px, ${screenY}px)`,
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${240 * scale}px`, // Scaled width
        zIndex: 20,
        fontSize: `${20 * scale}px`, // Scaled font size
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
                "group cursor-pointer select-none transition-shadow duration-300 overflow-hidden",
                "rounded-xl border border-dark-border",
                isComplete ? "bg-[#16a34a] shadow-none" : "bg-[#923B0F] shadow-lg" // Vibrant green for complete, specific red-brown for incomplete
            )}
        >
            {/* Minimal Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/20" style={{ height: `${8 * scale}px` }}>
                <div
                    className="h-full bg-[#16a34a] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Content */}
            <div className="relative flex items-center justify-center" style={{ padding: `${24 * scale}px ${20 * scale}px` }}>
                <span className="font-semibold text-white text-center" style={{ fontSize: '1em' }}>
                    {category.title}
                </span>
            </div>
        </div>
    );
};

export default RoadmapNode;
