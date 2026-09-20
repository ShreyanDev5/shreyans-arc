export interface Position {
  x: number;
  y: number;
}

export interface ViewportTransform extends Position {
  scale: number;
}

export const ROADMAP_NODE_WIDTH = 210;
export const ROADMAP_BASE_NODE_HEIGHT = 74;

export const INITIAL_LAYOUT: Record<string, Position> = {
  hashmaps_hashsets: { x: 250, y: 0 },
  two_pointers: { x: 100, y: 160 },
  monotonic_stack_prefix_sum: { x: 400, y: 160 },
  modified_binary_search: { x: -50, y: 320 },
  sliding_window: { x: 250, y: 320 },
  heap_priority_queue: { x: 550, y: 320 },
  bfs_dfs: { x: 250, y: 480 },
  memoization: { x: 250, y: 640 },
};

export const ROADMAP_CONNECTIONS = [
  { from: 'hashmaps_hashsets', to: 'two_pointers' },
  { from: 'hashmaps_hashsets', to: 'monotonic_stack_prefix_sum' },
  { from: 'two_pointers', to: 'modified_binary_search' },
  { from: 'two_pointers', to: 'sliding_window' },
  { from: 'monotonic_stack_prefix_sum', to: 'heap_priority_queue' },
  { from: 'modified_binary_search', to: 'bfs_dfs' },
  { from: 'sliding_window', to: 'bfs_dfs' },
  { from: 'heap_priority_queue', to: 'bfs_dfs' },
  { from: 'bfs_dfs', to: 'memoization' },
] as const;

export const CUSTOM_NODE_HEIGHTS: Record<string, number> = {};

export const getDefaultViewport = (width: number, height?: number): ViewportTransform => {
  const isMobile = width < 768;
  const viewportHeight = height || (typeof window !== 'undefined' ? window.innerHeight : 900);

  // Full roadmap bounding box:
  // X: spans -50 to 760 (width = 810, horizontal center = 355)
  // Y: spans 0 to 714 (height = 714, vertical center = 357)
  const ROADMAP_WIDTH = 810;
  const ROADMAP_HEIGHT = 714;
  const ROADMAP_CENTER_X = 355;
  const ROADMAP_CENTER_Y = 357;

  // Safe visual margins (accommodates top bar and bottom dock)
  const padX = isMobile ? 40 : 160;
  const padY = isMobile ? 140 : 200;

  const scaleX = (width - padX) / ROADMAP_WIDTH;
  const scaleY = (viewportHeight - padY) / ROADMAP_HEIGHT;

  // Slightly zoomed out for best breathing room
  const maxScale = isMobile ? 0.55 : 0.78;
  const scale = Math.min(maxScale, Math.max(0.25, Math.min(scaleX, scaleY)));

  return {
    x: width / 2 - ROADMAP_CENTER_X * scale,
    y: viewportHeight / 2 - ROADMAP_CENTER_Y * scale,
    scale,
  };
};