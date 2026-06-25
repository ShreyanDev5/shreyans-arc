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
                    markerHeight="4.5"
                    refX="5"
                    refY="2.25"
                    orient="auto"
                >
                    <polygon points="1 0.75, 5 2.25, 1 3.75" fill="#3b82f6" />
                </marker>
                <marker
                    id="arrowhead-completed"
                    markerWidth="6"
                    markerHeight="4.5"
                    refX="5"
                    refY="2.25"
                    orient="auto"
                >
                    <polygon points="1 0.75, 5 2.25, 1 3.75" fill="#10b981" />
                </marker>
            </defs>
            {ROADMAP_CONNECTIONS.map(({ from, to }) => {
                const start = nodePositions[from];
                const end = nodePositions[to];

                if (!start || !end) return null;

                // Determine height for start node
                const startBaseHeight = CUSTOM_NODE_HEIGHTS[from] || ROADMAP_BASE_NODE_HEIGHT;
                const startNodeHeight = startBaseHeight;

                // Calculate center points in world space
                const startX = start.x + ROADMAP_NODE_WIDTH / 2;
                const startY = start.y + startNodeHeight;
                const endX = end.x + ROADMAP_NODE_WIDTH / 2;
                const endY = end.y - 1; // Terminate line exactly on the node's top border for perfect arrowhead alignment

                // Shared Vertical Trunk Routing (Path Merging)
                const TRUNK_HEIGHT = 35;
                const adjStartY = startY + TRUNK_HEIGHT;

                // Vertical Bezier Curve from trunk end
                const distY = endY - adjStartY;
                const distX = Math.abs(endX - startX);

                // Smoother, gentler curve transition to prevent arrowhead misalignment on curves
                const controlOffset = Math.min(distY * 0.45 + distX * 0.05, 110);

                const path = `M ${startX} ${startY} L ${startX} ${adjStartY} C ${startX} ${adjStartY + controlOffset}, ${endX} ${endY - controlOffset}, ${endX} ${endY}`;

                // A path is active/unlocked if its starting node has been fully completed
                const active = isCategoryComplete(from);

                return (
                    <path
                        key={`${from}-${to}`}
                        d={path}
                        stroke={active ? "#10b981" : "#3b82f6"}
                        strokeWidth={4}
                        fill="none"
                        className="transition-colors duration-500"
                        markerEnd={active ? "url(#arrowhead-completed)" : "url(#arrowhead-incomplete)"}
                        vectorEffect="non-scaling-stroke"
                    />
                );
            })}
        </svg>
    );
};

export default ConnectionLines;
