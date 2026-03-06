import React from 'react';
import {
    CUSTOM_NODE_HEIGHTS,
    ROADMAP_BASE_NODE_HEIGHT,
    ROADMAP_CONNECTIONS,
    ROADMAP_NODE_WIDTH,
} from '../data/layout';

interface ConnectionLinesProps {
    nodePositions: Record<string, { x: number; y: number }>;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ nodePositions }) => {
    return (
        <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ width: '100%', height: '100%' }}>
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="6"
                    markerHeight="4"
                    refX="5"
                    refY="2"
                    orient="auto"
                >
                    <polygon points="0 0, 6 2, 0 4" fill="#FFFFFF" />
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
                const endY = end.y;

                // Vertical Bezier Curve with enhanced control for offset nodes
                const distY = endY - startY;
                const distX = Math.abs(endX - startX);

                // Increase control point offset for horizontal distances to ensure vertical entry
                // Base offset is half of vertical distance, but we clamp it
                // For offset nodes, we want a "stiffer" curve at the end
                const controlOffset = Math.min(distY * 0.6 + distX * 0.1, 150);

                const path = `M ${startX} ${startY} C ${startX} ${startY + controlOffset}, ${endX} ${endY - controlOffset}, ${endX} ${endY}`;

                return (
                    <path
                        key={`${from}-${to}`}
                        d={path}
                        stroke="#FFFFFF"
                        strokeWidth={3}
                        fill="none"
                        className=""
                        markerEnd="url(#arrowhead)"
                        vectorEffect="non-scaling-stroke"
                    />
                );
            })}
        </svg>
    );
};

export default ConnectionLines;
