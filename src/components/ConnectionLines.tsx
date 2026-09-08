import React from 'react';
import {
    CUSTOM_NODE_HEIGHTS,
    ROADMAP_BASE_NODE_HEIGHT,
    ROADMAP_CONNECTIONS,
    ROADMAP_NODE_WIDTH,
} from '../data/layout';
import { roadmapData } from '../data/questions';

interface ConnectionLinesProps {
    nodePositions: Record<string, { x: number; y: number }>;
    solvedIds: Set<string>;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ nodePositions, solvedIds }) => {
    // Helper to check if a category is complete
    const isCategoryComplete = (catId: string) => {
        const category = roadmapData.find(c => c.id === catId);
        if (!category) return false;
        const total = category.questions.length;
        if (total === 0) return false;
        const solved = category.questions.filter(q => solvedIds.has(q.id)).length;
        return solved === total;
    };

    return (
        <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ width: '100%', height: '100%' }}>
            <defs>
                <marker
                    id="arrowhead-incomplete"
                    markerWidth="6"
                    markerHeight="6"
                    refX="0"
                    refY="3"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                >
                    <polygon points="0 0.5, 6 3, 0 5.5" fill="#52525d" />
                </marker>
                <marker
                    id="arrowhead-completed"
                    markerWidth="6"
                    markerHeight="6"
                    refX="0"
                    refY="3"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                >
                    <polygon points="0 0.5, 6 3, 0 5.5" fill="#10b981" />
                </marker>
            </defs>
            {ROADMAP_CONNECTIONS.map(({ from, to }) => {
                const start = nodePositions[from];
                const end = nodePositions[to];

                if (!start || !end) return null;

                // Center points in world space (compact node: 240px wide, 72px tall)
                const startX = start.x + ROADMAP_NODE_WIDTH / 2;
                const startY = start.y + ROADMAP_BASE_NODE_HEIGHT;
                const endX = end.x + ROADMAP_NODE_WIDTH / 2;
                const endY = end.y;

                // Pure vertical approach and departure stubs ensure arrowheads are 100% vertical
                const departureY = startY + 12;
                const approachY = endY - 14;

                const curveDy = approachY - departureY;
                const dx = Math.abs(endX - startX);

                // Smooth the curve for distant left/right nodes without over-bulging
                const isWide = dx > 80;
                const horizontalBoost = isWide ? Math.min(dx * 0.12, 48) : Math.min(dx * 0.04, 12);
                const handleY = Math.max(curveDy * 0.42, 20) + horizontalBoost;

                const cp1x = startX;
                const cp1y = departureY + handleY;
                const cp2x = endX;
                const cp2y = approachY - handleY;

                // Stop line stroke exactly at (endY - 6) so stroke never renders beneath arrowhead
                const path = `M ${startX} ${startY} L ${startX} ${departureY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${approachY} L ${endX} ${endY - 6}`;

                const active = isCategoryComplete(from);

                return (
                    <path
                        key={`${from}-${to}`}
                        d={path}
                        stroke={active ? "#10b981" : "#52525d"}
                        strokeWidth={1.8}
                        strokeOpacity={active ? 1 : 0.8}
                        fill="none"
                        className="transition-colors duration-200"
                        markerEnd={active ? "url(#arrowhead-completed)" : "url(#arrowhead-incomplete)"}
                        vectorEffect="non-scaling-stroke"
                    />
                );
            })}
        </svg>
    );
};

export default ConnectionLines;
