export interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
}

export interface Category {
  id: string;
  title: string;
  questions: Question[];
}

// Helper to generate LeetCode URL
const lc = (name: string) => `https://leetcode.com/problems/${name.toLowerCase().replace(/ /g, '-').replace(/[()]/g, '')}/`;

export const roadmapData: Category[] = [
  // 1. Hashmaps / Hashsets (5 questions)
  {
    id: 'hashmaps_hashsets',
    title: 'Hashmaps / Hashsets',
    questions: [
      { id: '1', title: 'Two Sum', difficulty: 'Easy', url: lc('Two Sum') },
      { id: '4', title: 'Group Anagrams', difficulty: 'Medium', url: lc('Group Anagrams') },
      { id: '5', title: 'Top K Frequent Elements', difficulty: 'Medium', url: lc('Top K Frequent Elements') },
      { id: '6', title: 'Longest Consecutive Sequence', difficulty: 'Medium', url: lc('Longest Consecutive Sequence') },
      { id: '146', title: 'LRU Cache', difficulty: 'Medium', url: lc('LRU Cache') },
    ]
  },
  // 2. Two Pointers (6 questions)
  {
    id: 'two_pointers',
    title: 'Two Pointers',
    questions: [
      { id: '9', title: 'Valid Palindrome', difficulty: 'Easy', url: lc('Valid Palindrome') },
      { id: '31', title: 'Reverse Linked List', difficulty: 'Easy', url: lc('Reverse Linked List') },
      { id: '33', title: 'Linked List Cycle', difficulty: 'Easy', url: lc('Linked List Cycle') },
      { id: '10', title: '3Sum', difficulty: 'Medium', url: lc('3Sum') },
      { id: '13', title: 'Container With Most Water', difficulty: 'Medium', url: lc('Container With Most Water') },
      { id: '86', title: 'Merge Intervals', difficulty: 'Medium', url: lc('Merge Intervals') },
    ]
  },
  // 3. Sliding Window (3 questions)
  {
    id: 'sliding_window',
    title: 'Sliding Window',
    questions: [
      { id: '19', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', url: lc('Best Time to Buy and Sell Stock') },
      { id: '15', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: lc('Longest Substring Without Repeating Characters') },
      { id: '16', title: 'Minimum Window Substring', difficulty: 'Hard', url: lc('Minimum Window Substring') },
    ]
  },
  // 4. Modified Binary Search (2 questions)
  {
    id: 'modified_binary_search',
    title: 'Modified Binary Search',
    questions: [
      { id: '26', title: 'Binary Search', difficulty: 'Easy', url: lc('Binary Search') },
      { id: '27', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', url: lc('Search in Rotated Sorted Array') },
    ]
  },
  // 5. Stack & Prefix Sum (4 questions)
  {
    id: 'monotonic_stack_prefix_sum',
    title: 'Stack & Prefix Sum',
    questions: [
      { id: '21', title: 'Valid Parentheses', difficulty: 'Easy', url: lc('Valid Parentheses') },
      { id: '23', title: 'Daily Temperatures', difficulty: 'Medium', url: lc('Daily Temperatures') },
      { id: '7', title: 'Product of Array Except Self', difficulty: 'Medium', url: lc('Product of Array Except Self') },
      { id: '83', title: 'Maximum Subarray', difficulty: 'Medium', url: lc('Maximum Subarray') },
    ]
  },
  // 6. Heap / Priority Queue (3 questions)
  {
    id: 'heap_priority_queue',
    title: 'Heap / Priority Queue',
    questions: [
      { id: '29', title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: lc('Kth Largest Element in an Array') },
      { id: '49', title: 'Task Scheduler', difficulty: 'Medium', url: lc('Task Scheduler') },
      { id: '48', title: 'Merge k Sorted Lists', difficulty: 'Hard', url: lc('Merge k Sorted Lists') },
    ]
  },
  // 7. BFS / DFS (8 questions)
  {
    id: 'bfs_dfs',
    title: 'BFS / DFS',
    questions: [
      { id: '40', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', url: lc('Binary Tree Level Order Traversal') },
      { id: '39', title: 'Validate Binary Search Tree', difficulty: 'Medium', url: lc('Validate Binary Search Tree') },
      { id: '44', title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', url: lc('Lowest Common Ancestor of a Binary Tree') },
      { id: '58', title: 'Number of Islands', difficulty: 'Medium', url: lc('Number of Islands') },
      { id: '60', title: 'Course Schedule', difficulty: 'Medium', url: lc('Course Schedule') },
      { id: '67', title: 'Network Delay Time', difficulty: 'Medium', url: lc('Network Delay Time') },
      { id: '54', title: 'Combination Sum', difficulty: 'Medium', url: lc('Combination Sum') },
      { id: '55', title: 'Word Search', difficulty: 'Medium', url: lc('Word Search') },
    ]
  },
  // 8. Memoization (6 questions)
  {
    id: 'memoization',
    title: 'Memoization',
    questions: [
      { id: '69', title: 'Climbing Stairs', difficulty: 'Easy', url: lc('Climbing Stairs') },
      { id: '70', title: 'House Robber', difficulty: 'Medium', url: lc('House Robber') },
      { id: '71', title: 'Coin Change', difficulty: 'Medium', url: lc('Coin Change') },
      { id: '72', title: 'Longest Increasing Subsequence', difficulty: 'Medium', url: lc('Longest Increasing Subsequence') },
      { id: '78', title: 'Unique Paths', difficulty: 'Medium', url: lc('Unique Paths') },
      { id: '79', title: 'Longest Common Subsequence', difficulty: 'Medium', url: lc('Longest Common Subsequence') },
    ]
  },
];