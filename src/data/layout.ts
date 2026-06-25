export interface Position {
  x: number;
  y: number;
}

export interface ViewportTransform extends Position {
  scale: number;
}

export const ROADMAP_NODE_WIDTH = 320;
export const ROADMAP_BASE_NODE_HEIGHT = 60;

export const INITIAL_LAYOUT: Record<string, Position> = {
  arrays_hashing: { x: 100, y: 0 },
  two_pointers: { x: -200, y: 290 },
  stacks_monotonic: { x: 400, y: 290 },
  binary_search_quickselect: { x: -550, y: 580 },
  sliding_window: { x: -100, y: 580 },
  linked_list: { x: 350, y: 580 },
  trees: { x: 100, y: 870 },
  trie: { x: -320, y: 1160 },
  heap_priority_queue: { x: 100, y: 1160 },
  backtracking: { x: 520, y: 1160 },
  graphs: { x: 380, y: 1450 },
  greedy: { x: 60, y: 1740 },
  dp_1d: { x: 540, y: 1740 },
  intervals: { x: 60, y: 2030 },
  dp_2d: { x: 540, y: 2030 },
  bit_manipulation: { x: 1020, y: 2030 },
  math_geometry: { x: 540, y: 2320 },
};

export const ROADMAP_CONNECTIONS = [
  { from: 'arrays_hashing', to: 'two_pointers' },
  { from: 'arrays_hashing', to: 'stacks_monotonic' },
  { from: 'two_pointers', to: 'sliding_window' },
  { from: 'two_pointers', to: 'binary_search_quickselect' },
  { from: 'two_pointers', to: 'linked_list' },
  { from: 'binary_search_quickselect', to: 'trees' },
  { from: 'linked_list', to: 'trees' },
  { from: 'trees', to: 'trie' },
  { from: 'trees', to: 'heap_priority_queue' },
  { from: 'trees', to: 'backtracking' },
  { from: 'backtracking', to: 'graphs' },
  { from: 'heap_priority_queue', to: 'greedy' },
  { from: 'graphs', to: 'greedy' },
  { from: 'graphs', to: 'dp_1d' },
  { from: 'greedy', to: 'intervals' },
  { from: 'dp_1d', to: 'dp_2d' },
  { from: 'dp_1d', to: 'bit_manipulation' },
  { from: 'dp_2d', to: 'math_geometry' },
] as const;

export const CUSTOM_NODE_HEIGHTS: Record<string, number> = {
  two_pointers: 90,
  sliding_window: 90,
  binary_search_quickselect: 90,
  heap_priority_queue: 90,
  bit_manipulation: 90,
  math_geometry: 90,
  dp_1d: 90,
  dp_2d: 90,
};

export const getDefaultViewport = (width: number): ViewportTransform => {
  const isMobile = width < 768;
  const scale = isMobile ? 0.35 : 0.6;
  const centerOffset = isMobile ? 250 : 450;

  return {
    x: width / 2 - centerOffset * scale,
    y: 100,
    scale,
  };
};