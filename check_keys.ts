
import { roadmapData } from './src/data/questions';

// Initial Layout Positions (Approximate Tree Structure)
const INITIAL_LAYOUT: Record<string, { x: number; y: number }> = {
    'arrays': { x: 0, y: 0 },
    'two_pointers': { x: -250, y: 180 },
    'stack': { x: 250, y: 180 },
    'binary_search': { x: -380, y: 360 },
    'sliding_window': { x: -120, y: 360 },
    'linked_list': { x: 250, y: 360 },
    'trees': { x: 0, y: 540 },
    'trie': { x: -250, y: 720 },
    'backtracking': { x: 250, y: 720 },
    'heap': { x: 0, y: 900 },
    'graphs': { x: 250, y: 900 },
    'intervals': { x: -250, y: 1080 },
    'greedy': { x: 0, y: 1080 },
    'advanced_graphs': { x: 250, y: 1080 },
    'dp1': { x: 500, y: 900 }, // Side branch
    'dp2': { x: 500, y: 1080 },
    'bit_manipulation': { x: 750, y: 1080 },
    'math': { x: 500, y: 1260 },
};

const roadmapIds = roadmapData.map(c => c.id);
const layoutIds = Object.keys(INITIAL_LAYOUT);

const missingInLayout = roadmapIds.filter(id => !layoutIds.includes(id));
const missingInRoadmap = layoutIds.filter(id => !roadmapIds.includes(id));

console.log('Missing in Layout:', missingInLayout);
console.log('Missing in Roadmap:', missingInRoadmap);
