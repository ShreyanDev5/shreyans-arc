import React from 'react';

interface ConnectionLinesProps {
    nodePositions: Record<string, { x: number; y: number }>;
    scale: number;
    panX: number;
    panY: number;
}

// Define the graph structure (adjacency list or edge list)
const CONNECTIONS = [
    { from: 'arrays', to: 'two_pointers' },
    { from: 'arrays', to: 'stack' },
    { from: 'two_pointers', to: 'binary_search' },
    { from: 'two_pointers', to: 'sliding_window' },
    { from: 'stack', to: 'linked_list' },
    { from: 'binary_search', to: 'trees' },
    { from: 'sliding_window', to: 'trees' },
    { from: 'linked_list', to: 'trees' },
    { from: 'trees', to: 'trie' },
    { from: 'trees', to: 'backtracking' },
    { from: 'trees', to: 'heap' },
    { from: 'backtracking', to: 'graphs' },
    { from: 'heap', to: 'intervals' },
    { from: 'heap', to: 'greedy' },
    { from: 'graphs', to: 'advanced_graphs' },
    { from: 'graphs', to: 'dp1' },
    { from: 'advanced_graphs', to: 'dp2' },
    { from: 'dp1', to: 'dp2' },
    { from: 'dp1', to: 'bit_manipulation' },
    { from: 'dp2', to: 'math' },
];

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ nodePositions, scale, panX, panY }) => {
    // Node dimensions (approximate for centering lines)
    const NODE_WIDTH = 240 * scale;
    const NODE_HEIGHT = 60 * scale; // Pill height (increased due to font/padding)

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
            {CONNECTIONS.map(({ from, to }, index) => {
                const start = nodePositions[from];
                const end = nodePositions[to];

                if (!start || !end) return null;

                // Calculate center points in screen space
                const startX = (start.x * scale) + panX + NODE_WIDTH / 2;
                const startY = (start.y * scale) + panY + NODE_HEIGHT;
                const endX = (end.x * scale) + panX + NODE_WIDTH / 2;
                const endY = (end.y * scale) + panY;

                // Vertical Bezier Curve with enhanced control for offset nodes
                const distY = endY - startY;
                const distX = Math.abs(endX - startX);

                // Increase control point offset for horizontal distances to ensure vertical entry
                // Base offset is half of vertical distance, but we clamp it
                // For offset nodes, we want a "stiffer" curve at the end
                const controlOffset = Math.min(distY * 0.6 + distX * 0.1, 150 * scale);

                const path = `M ${startX} ${startY} C ${startX} ${startY + controlOffset}, ${endX} ${endY - controlOffset}, ${endX} ${endY}`;

                return (
                    <path
                        key={`${from}-${to}`}
                        d={path}
                        stroke="#FFFFFF"
                        strokeWidth={3 * scale}
                        fill="none"
                        className="transition-all duration-300"
                        markerEnd="url(#arrowhead)"
                    />
                );
            })}
        </svg>
    );
};

export default ConnectionLines;
