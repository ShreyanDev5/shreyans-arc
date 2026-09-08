export interface Position {
  x: number;
  y: number;
}

export interface ViewportTransform extends Position {
  scale: number;
}

export const ROADMAP_NODE_WIDTH = 200;
export const ROADMAP_BASE_NODE_HEIGHT = 72;

export const INITIAL_LAYOUT: Record<string, Position> = {
  arrays_hashing: { x: 220, y: 0 },
  two_pointers: { x: 80, y: 185 },
  stacks_monotonic: { x: 360, y: 185 },
  binary_search_quickselect: { x: -50, y: 370 },
  sliding_window: { x: 220, y: 370 },
  linked_list: { x: 490, y: 370 },
  trees: { x: 220, y: 555 },
  trie: { x: -50, y: 740 },
  heap_priority_queue: { x: 220, y: 740 },
  backtracking: { x: 490, y: 740 },
  graphs: { x: 490, y: 925 },
  greedy: { x: 220, y: 1110 },
  dp_1d: { x: 490, y: 1110 },
  intervals: { x: 220, y: 1295 },
  dp_2d: { x: 490, y: 1295 },
  bit_manipulation: { x: 760, y: 1295 },
  math_geometry: { x: 490, y: 1480 },
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

export const CUSTOM_NODE_HEIGHTS: Record<string, number> = {};

export const getDefaultViewport = (width: number, height?: number): ViewportTransform => {
  const isMobile = width < 768;
  const viewportHeight = height || (typeof window !== 'undefined' ? window.innerHeight : 900);

  // Full roadmap bounding box:
  // X: spans -50 to 960 (width = 1010, horizontal center = 455)
  // Y: spans 0 to 1552 (height = 1552, vertical center = 776)
  const ROADMAP_WIDTH = 1010;
  const ROADMAP_HEIGHT = 1552;
  const ROADMAP_CENTER_X = 455;
  const ROADMAP_CENTER_Y = 776;

  // Safe visual margins (accommodates top bar and bottom dock)
  const padX = isMobile ? 32 : 100;
  const padY = isMobile ? 120 : 150;

  const scaleX = (width - padX) / ROADMAP_WIDTH;
  const scaleY = (viewportHeight - padY) / ROADMAP_HEIGHT;

  // Fit the ENTIRE roadmap both horizontally and vertically
  const maxScale = isMobile ? 0.40 : 0.62;
  const scale = Math.min(maxScale, Math.max(0.18, Math.min(scaleX, scaleY)));

  return {
    x: width / 2 - ROADMAP_CENTER_X * scale,
    y: viewportHeight / 2 - ROADMAP_CENTER_Y * scale,
    scale,
  };
};