import React from 'react';

interface ConnectionLinesProps {
    nodePositions: Record<string, { x: number; y: number }>;
}

// Define the graph structure (adjacency list or edge list)
const CONNECTIONS = [
    { from: 'arrays_hashing', to: 'core_sorting' },
    { from: 'arrays_hashing', to: 'stacks_monotonic' },
    { from: 'core_sorting', to: 'two_pointers_sliding_window' },
    { from: 'two_pointers_sliding_window', to: 'binary_search_quickselect' },
    { from: 'two_pointers_sliding_window', to: 'linked_list' },
    { from: 'binary_search_quickselect', to: 'trees' },
    { from: 'stacks_monotonic', to: 'trees' },
    { from: 'linked_list', to: 'trees' },
    { from: 'trees', to: 'trie' },
    { from: 'trees', to: 'heap_priority_queue' },
    { from: 'trees', to: 'backtracking' },
    { from: 'backtracking', to: 'core_graph_basics' },
    { from: 'core_graph_basics', to: 'graphs' },
    { from: 'graphs', to: 'core_advanced_graph' },
    { from: 'graphs', to: 'core_dp_patterns' },
    { from: 'heap_priority_queue', to: 'core_advanced_graph' },
    { from: 'core_advanced_graph', to: 'greedy' },
    { from: 'greedy', to: 'intervals' },
    { from: 'core_dp_patterns', to: 'dp_1d' },
    { from: 'dp_1d', to: 'dp_2d' },
    { from: 'dp_1d', to: 'bit_manipulation' },
    { from: 'dp_2d', to: 'math_geometry' },
    { from: 'math_geometry', to: 'system_design_misc' },
];

// Static height configuration for nodes with wrapped text
// Standard height is ~60px (scaled), tall nodes need more.
// These values are unscaled base heights.
const CUSTOM_NODE_HEIGHTS: Record<string, number> = {
    'two_pointers_sliding_window': 90,
    'binary_search_quickselect': 90,
    'heap_priority_queue': 90,
    'bit_manipulation': 90,
    'math_geometry': 90,
    'system_design_misc': 90,
    // Add others if needed based on visual inspection
};

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ nodePositions }) => {
    // Node dimensions (fixed base size)
    const NODE_WIDTH = 240;
    const BASE_NODE_HEIGHT = 60;

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

                // Determine height for start node
                const startBaseHeight = CUSTOM_NODE_HEIGHTS[from] || 60;
                const startNodeHeight = startBaseHeight;

                // Calculate center points in world space
                const startX = start.x + NODE_WIDTH / 2;
                const startY = start.y + startNodeHeight;
                const endX = end.x + NODE_WIDTH / 2;
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
