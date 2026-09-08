import React, { lazy, Suspense, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { roadmapData, Category } from './data/questions';
import { auth, googleProvider, signInWithPopup, firebaseSignOut, db, doc, onSnapshot, setDoc, isConfigured } from './lib/firebase';
import { getDefaultViewport, INITIAL_LAYOUT, Position, ViewportTransform } from './data/layout';
import Sidebar from './components/Sidebar';
import RoadmapNode from './components/RoadmapNode';
import ConnectionLines from './components/ConnectionLines';
import type { User } from 'firebase/auth';

const QuestionModal = lazy(async () => {
  const module = await import('./components/QuestionModal');
  return { default: module.QuestionModal };
});
const InfoModal = lazy(() => import('./components/InfoModal'));

const VALID_QUESTION_IDS = new Set(
  roadmapData.flatMap((category) => category.questions.map((question) => question.id))
);

const createInitialNodePositions = (): Record<string, Position> => {
  const positions = { ...INITIAL_LAYOUT };

  roadmapData.forEach((category) => {
    if (!positions[category.id]) {
      positions[category.id] = { x: 0, y: 0 };
    }
  });

  return positions;
};

const App: React.FC = () => {
  // --- State: User & Data ---
  const [user, setUser] = useState<User | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<string | null>(null);
  const [lastActiveCatId, setLastActiveCatId] = useState<string | null>(null);

  // --- State: UI ---
  const [nodePositions] = useState<Record<string, Position>>(createInitialNodePositions);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // --- Refs for Interaction Logic ---
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Transform State (Source of Truth)
  const transform = useRef<ViewportTransform>({ x: 0, y: 0, scale: 1 });

  // Pointer State
  const pointers = useRef<Map<number, { x: number, y: number }>>(new Map());

  // Helper: Update Transform
  const updateTransform = useCallback(() => {
    if (canvasRef.current) {
      const { x, y, scale } = transform.current;
      canvasRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }
  }, []);

  // Helper: Screen to World
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const { x, y, scale } = transform.current;
    return {
      x: (screenX - x) / scale,
      y: (screenY - y) / scale
    };
  }, []);

  // Initialize View
  useEffect(() => {
    transform.current = getDefaultViewport(window.innerWidth, window.innerHeight);
    updateTransform();
  }, [updateTransform]);

  // --- Firebase Auth & Data Sync ---
  useEffect(() => {
    const filterValidIds = (ids: string[]) => ids.filter((id) => VALID_QUESTION_IDS.has(id));

    // Fallback helper to load local guest progress
    const loadLocalProgress = () => {
      const local = localStorage.getItem('shreyans-arc-guest');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          const validSolved = filterValidIds(parsed);
          setSolvedIds(new Set(validSolved));
          return;
        } catch {
          localStorage.removeItem('shreyans-arc-guest');
        }
      }
      setSolvedIds(new Set());
    };

    if (!isConfigured || !auth || !db) {
      // Firebase not configured: load guest progress from localStorage immediately
      loadLocalProgress();
      return;
    }

    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      unsubscribeSnapshot?.();
      unsubscribeSnapshot = undefined;

      setUser(currentUser);

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const validSolved = filterValidIds(data.solved || []);
            setSolvedIds(new Set(validSolved));
            return;
          }
          setDoc(userRef, { solved: [] }, { merge: true });
        });
        return;
      }

      // If user logs out or is a guest on configured app
      loadLocalProgress();
    });

    return () => {
      unsubscribeSnapshot?.();
      unsubscribeAuth();
    };
  }, []);

  const toggleQuestion = async (id: string) => {
    const newSet = new Set(solvedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSolvedIds(newSet);

    // Track active category to seamlessly recommend the next problem in the active topic
    const cat = roadmapData.find(c => c.questions.some(q => q.id === id));
    if (cat) setLastActiveCatId(cat.id);

    const idsArray = Array.from(newSet);
    if (user && db) await setDoc(doc(db, 'users', user.uid), { solved: idsArray }, { merge: true });
    else localStorage.setItem('shreyans-arc-guest', JSON.stringify(idsArray));
  };

  const handleLogin = async () => {
    if (!isConfigured || !auth || !googleProvider) {
      alert("Cloud sync is not configured. Progress is saved locally in this browser.");
      return;
    }

    try { await signInWithPopup(auth, googleProvider); }
    catch (error) { console.error(error); alert("Sign in failed. Please try again."); }
  };

  const resetView = useCallback(() => {
    transform.current = getDefaultViewport(window.innerWidth, window.innerHeight);
    updateTransform();
  }, [updateTransform]);

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    if (!containerRef.current) return;
    const factor = direction === 'in' ? 1.25 : 0.8;
    const newScale = Math.min(Math.max(transform.current.scale * factor, 0.1), 3);
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const { x, y, scale } = transform.current;
    const newX = centerX - (centerX - x) * (newScale / scale);
    const newY = centerY - (centerY - y) * (newScale / scale);
    transform.current = { x: newX, y: newY, scale: newScale };
    updateTransform();
  }, [updateTransform]);

  // Keyboard Navigation & Shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        handleZoom('in');
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoom('out');
      } else if (e.key === '0') {
        e.preventDefault();
        resetView();
      } else if (e.key === 'Escape') {
        setIsSidebarOpen(false);
        setIsInfoOpen(false);
        setSelectedCategory(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleZoom, resetView]);

  // --- Interaction Handlers ---

  const getCentroid = (pointers: Map<number, { x: number, y: number }>) => {
    let x = 0, y = 0, count = 0;
    for (const p of pointers.values()) {
      x += p.x;
      y += p.y;
      count++;
    }
    return { x: x / count, y: y / count };
  };

  const getDistance = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  };

  // Track initial pointer positions to implement drag threshold
  const pointerStartPos = useRef<Map<number, { x: number, y: number }>>(new Map());
  const hasCaptured = useRef<Map<number, boolean>>(new Map());

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.sidebar-ignore')) return;

    // Don't capture yet. Just track start position.
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pointerStartPos.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    hasCaptured.current.set(e.pointerId, false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;

    const currentPos = { x: e.clientX, y: e.clientY };
    const startPos = pointerStartPos.current.get(e.pointerId)!;

    // Check threshold if not yet captured
    if (!hasCaptured.current.get(e.pointerId)) {
      const dist = Math.hypot(currentPos.x - startPos.x, currentPos.y - startPos.y);
      if (dist < 5) {
        // Update current pos but don't act yet
        // Actually, we shouldn't even update pointers.current if we want to avoid micro-movements
        // But for multi-touch zoom, we might need immediate updates?
        // Let's just update pointers.current but NOT pan/drag until threshold.

        return;
      }

      // Threshold passed: Capture and mark as moving
      containerRef.current?.setPointerCapture(e.pointerId);
      hasCaptured.current.set(e.pointerId, true);
    }

    const prevPointers = new Map<number, { x: number, y: number }>(pointers.current);
    pointers.current.set(e.pointerId, currentPos);

    // Pan & Zoom
    if (pointers.current.size === 1) {
      const prev = prevPointers.get(e.pointerId)!;
      const curr = pointers.current.get(e.pointerId)!;
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;

      transform.current.x += dx;
      transform.current.y += dy;
      updateTransform();
    } else if (pointers.current.size === 2) {
      const [p1Id, p2Id] = Array.from(pointers.current.keys()) as number[];
      const prevP1 = prevPointers.get(p1Id)!;
      const prevP2 = prevPointers.get(p2Id)!;
      const currP1 = pointers.current.get(p1Id)!;
      const currP2 = pointers.current.get(p2Id)!;

      const prevDist = getDistance(prevP1, prevP2);
      const currDist = getDistance(currP1, currP2);

      if (prevDist === 0) return;

      const scaleFactor = currDist / prevDist;
      const newScale = Math.min(Math.max(transform.current.scale * scaleFactor, 0.1), 3);

      // Zoom towards centroid
      const prevCenter = getCentroid(prevPointers);
      const currCenter = getCentroid(pointers.current);

      // Calculate how much the world moved due to panning (centroid shift)
      const dx = currCenter.x - prevCenter.x;
      const dy = currCenter.y - prevCenter.y;

      const oldScale = transform.current.scale;
      const x = currCenter.x - (prevCenter.x - transform.current.x) * (newScale / oldScale) + dx;
      const y = currCenter.y - (prevCenter.y - transform.current.y) * (newScale / oldScale) + dy;

      transform.current = { x, y, scale: newScale };
      updateTransform();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (hasCaptured.current.get(e.pointerId)) {
      containerRef.current?.releasePointerCapture(e.pointerId);
    }
    pointers.current.delete(e.pointerId);
    pointerStartPos.current.delete(e.pointerId);
    hasCaptured.current.delete(e.pointerId);
  };

  // Non-passive wheel listener for zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Fix for trackpad pinch-to-zoom on Windows (Ctrl + Wheel)
      let multiplier = 0.001;
      if (e.ctrlKey && e.deltaMode === 0 && Math.abs(e.deltaY) < 50) {
        multiplier = 0.015;
      }

      const scaleAmount = -e.deltaY * multiplier;
      const newScale = Math.min(Math.max(transform.current.scale * (1 + scaleAmount), 0.1), 3);

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const { x, y, scale } = transform.current;
      const newX = mouseX - (mouseX - x) * (newScale / scale);
      const newY = mouseY - (mouseY - y) * (newScale / scale);

      transform.current = { x: newX, y: newY, scale: newScale };
      updateTransform();
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [updateTransform]);

  const handleDoubleTap = (e: React.MouseEvent) => {
    // Simple double click/tap zoom reset or zoom in
    // For now, let's just zoom in to the point
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const targetScale = transform.current.scale < 1 ? 1.2 : 0.6;
    const { x, y, scale } = transform.current;

    const newX = mouseX - (mouseX - x) * (targetScale / scale);
    const newY = mouseY - (mouseY - y) * (targetScale / scale);

    transform.current = { x: newX, y: newY, scale: targetScale };
    updateTransform();
  };

  // --- Render Helpers ---
  const totalQuestions = roadmapData.reduce((acc, cat) => acc + cat.questions.length, 0);
  const totalSolved = solvedIds.size;
  const overallProgress = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

  // Next Recommended Problem
  // 1. Active category continuation: if user is practicing a topic, guide them through its questions
  // 2. Learning frontier: if user switched topics, continue at the latest in-progress pattern
  // 3. Sequential roadmap: guides from foundations (Arrays, Two Pointers) to advanced structures
  const nextQuestion = useMemo(() => {
    // 1. Active category continuation
    if (lastActiveCatId) {
      const activeCat = roadmapData.find(c => c.id === lastActiveCatId);
      if (activeCat) {
        const nextInActive = activeCat.questions.find(q => !solvedIds.has(q.id));
        if (nextInActive) {
          return { category: activeCat, question: nextInActive };
        }
      }
    }

    // 2. Latest in-progress category in roadmap sequence (active frontier)
    for (let i = roadmapData.length - 1; i >= 0; i--) {
      const cat = roadmapData[i];
      const solvedInCat = cat.questions.filter(q => solvedIds.has(q.id)).length;
      if (solvedInCat > 0 && solvedInCat < cat.questions.length) {
        const nextUnsolved = cat.questions.find(q => !solvedIds.has(q.id));
        if (nextUnsolved) {
          return { category: cat, question: nextUnsolved };
        }
      }
    }

    // 3. Earliest unsolved question in roadmap sequence
    for (const category of roadmapData) {
      for (const question of category.questions) {
        if (!solvedIds.has(question.id)) {
          return { category, question };
        }
      }
    }
    return null;
  }, [solvedIds, lastActiveCatId]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-dark-bg text-dark-text font-sans selection:bg-brand-primary/30">

      {/* Floating Top Controls */}
      <header className="sidebar-ignore fixed top-3 sm:top-4 right-3 sm:right-4 z-40 pointer-events-auto flex items-center gap-1.5 sm:gap-2">
        {/* Next Recommended Problem */}
          {nextQuestion ? (
            <button
              onClick={() => {
                setSelectedCategory(nextQuestion.category);
                setHighlightedQuestionId(nextQuestion.question.id);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-dark-card/90 backdrop-blur-md border border-dark-border hover:border-blue-500/50 rounded-xl shadow-lg text-xs transition-all group"
              title={`Next up in ${nextQuestion.category.title}: ${nextQuestion.question.title} (${nextQuestion.question.difficulty})`}
            >
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse flex-shrink-0" />
              <span className="hidden sm:inline text-dark-muted">Next up:</span>
              <span className="sm:hidden text-dark-muted">Next:</span>
              <span className="font-medium text-[#ededf0] group-hover:text-white transition-colors truncate max-w-[85px] xs:max-w-[130px] sm:max-w-[200px] lg:max-w-[320px] xl:max-w-[420px]">
                {nextQuestion.question.title}
              </span>
              <svg className="w-3 h-3 text-dark-muted group-hover:text-[#ededf0] group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-dark-card/90 backdrop-blur-md border border-emerald-500/30 rounded-xl shadow-lg text-xs font-medium text-emerald-400">
              <span>All 58 Solved</span>
              <span>🎉</span>
            </div>
          )}

          {/* Progress Pill / Sidebar Trigger */}
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-dark-card/90 backdrop-blur-md border border-dark-border hover:border-emerald-500/50 rounded-xl shadow-lg transition-all group flex-shrink-0"
            title="Progress & stats"
          >
            <div className="w-2 h-2 rounded-full bg-brand-accent group-hover:shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-shadow flex-shrink-0" />
            <span className="text-xs font-mono tabular-nums font-medium text-[#ededf0] group-hover:text-white transition-colors">
              {totalSolved} / {totalQuestions}
            </span>
            <span className="hidden sm:inline text-[11px] font-mono tabular-nums text-dark-muted group-hover:text-[#b4b4bf] transition-colors">
              ({overallProgress}%)
            </span>
          </button>
      </header>

      {/* Floating Canvas Dock (Bottom Center) */}
      <div
        className="sidebar-ignore fixed left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex items-center gap-0.5 p-1 bg-dark-card/90 backdrop-blur-md border border-dark-border/90 rounded-xl shadow-2xl"
        style={{ bottom: 'max(1rem, calc(0.75rem + env(safe-area-inset-bottom, 0px)))' }}
      >
        <button
          onClick={() => handleZoom('out')}
          className="p-2 sm:p-1.5 text-dark-muted hover:text-[#ededf0] hover:bg-dark-highlight rounded-lg transition-colors"
          title="Zoom out (-)"
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <button
          onClick={resetView}
          className="p-2 sm:p-1.5 text-dark-muted hover:text-[#ededf0] hover:bg-dark-highlight rounded-lg transition-colors"
          title="Center view (0)"
          aria-label="Center view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="22" y1="12" x2="18" y2="12"></line>
            <line x1="6" y1="12" x2="2" y2="12"></line>
            <line x1="12" y1="6" x2="12" y2="2"></line>
            <line x1="12" y1="22" x2="12" y2="18"></line>
          </svg>
        </button>

        <button
          onClick={() => handleZoom('in')}
          className="p-2 sm:p-1.5 text-dark-muted hover:text-[#ededf0] hover:bg-dark-highlight rounded-lg transition-colors"
          title="Zoom in (+)"
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <div className="w-px h-3.5 bg-dark-border mx-0.5" />

        <button
          onClick={() => setIsInfoOpen(true)}
          className="p-2 sm:p-1.5 text-dark-muted hover:text-[#ededf0] hover:bg-dark-highlight rounded-lg transition-colors"
          title="About & shortcuts"
          aria-label="About"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
      </div>

      {/* Sidebar Drawer */}
      <div className="sidebar-ignore">
        <Sidebar
          totalSolved={totalSolved}
          totalQuestions={totalQuestions}
          overallProgress={overallProgress}
          solvedIds={solvedIds}
          user={user}
          onLogin={handleLogin}
          onLogout={() => {
            if (auth) {
              return firebaseSignOut(auth);
            }
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isConfigured={isConfigured}
        />
      </div>

      {/* Modals */}
      <div className="sidebar-ignore">
        <Suspense fallback={null}>
          <InfoModal
            isOpen={isInfoOpen}
            onClose={() => setIsInfoOpen(false)}
            totalQuestions={totalQuestions}
          />
        </Suspense>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDoubleClick={handleDoubleTap}
      >
        {/* Transform Layer */}
        <div
          ref={canvasRef}
          className="w-full h-full origin-top-left"
          style={{ transform: 'translate(0px, 0px) scale(1)' }}
        >
          <ConnectionLines
            nodePositions={nodePositions}
            solvedIds={solvedIds}
          />

          {roadmapData.map(category => (
            <RoadmapNode
              key={category.id}
              category={category}
              solvedIds={solvedIds}
              onClick={(cat) => {
                setSelectedCategory(cat);
                setHighlightedQuestionId(null);
              }}
              x={nodePositions[category.id]?.x || 0}
              y={nodePositions[category.id]?.y || 0}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCategory && (
        <div className="sidebar-ignore">
          <Suspense fallback={null}>
            <QuestionModal
              category={selectedCategory}
              isOpen={!!selectedCategory}
              onClose={() => {
                setSelectedCategory(null);
                setHighlightedQuestionId(null);
              }}
              solvedIds={solvedIds}
              toggleQuestion={toggleQuestion}
              highlightedQuestionId={highlightedQuestionId}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default App;