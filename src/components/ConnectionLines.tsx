import React from 'react';

interface ConnectionLinesProps {
    nodePositions: Record<string, { x: number; y: number }>;
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

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ nodePositions }) => {
    // Node dimensions (approximate for centering lines)
    const NODE_WIDTH = 200;
    const NODE_HEIGHT = 50; // Pill height

    return (
        <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ width: '100%', height: '100%' }}>
            {CONNECTIONS.map(({ from, to }, index) => {
                const start = nodePositions[from];
                const end = nodePositions[to];

                if (!start || !end) return null;

                // Calculate center points
                const startX = start.x + NODE_WIDTH / 2;
                const startY = start.y + NODE_HEIGHT;
                const endX = end.x + NODE_WIDTH / 2;
                const endY = end.y;

                // Vertical Bezier Curve
                const distY = endY - startY;
                const controlOffset = Math.min(distY * 0.5, 150); // Cap control point distance

                const path = `M ${startX} ${startY} C ${startX} ${startY + controlOffset}, ${endX} ${endY - controlOffset}, ${endX} ${endY}`;

                return (
                    <path
                        key={`${from}-${to}`}
                        d={path}
                        stroke="#475569" // Slate 600
                        strokeWidth="3"
                        fill="none"
                        className="transition-all duration-300 opacity-40"
                    />
                );
            })}
        </svg>
    );
};

export default ConnectionLines;
