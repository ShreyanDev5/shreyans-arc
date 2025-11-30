import React, { useState, useEffect, useRef, useCallback } from 'react';
import { roadmapData, Category } from './data/questions';
import { auth, googleProvider, signInWithPopup, firebaseSignOut, db, doc, onSnapshot, setDoc, isConfigured } from './lib/firebase';
import { QuestionModal } from './components/QuestionModal';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import RoadmapNode from './components/RoadmapNode';
import ConnectionLines from './components/ConnectionLines';
import InfoModal from './components/InfoModal';
import { User } from 'firebase/auth';

// Initial Layout Positions (Tree Structure)
const INITIAL_LAYOUT: Record<string, { x: number; y: number }> = {
  'arrays_hashing': { x: 100, y: 0 },
  'core_sorting': { x: -150, y: 180 },
  'stacks_monotonic': { x: 350, y: 180 },
  'two_pointers_sliding_window': { x: -150, y: 360 },
  'linked_list': { x: 350, y: 540 },
  'binary_search_quickselect': { x: -150, y: 540 },
  'trees': { x: 100, y: 720 },
  'trie': { x: -200, y: 900 },
  'heap_priority_queue': { x: 100, y: 900 },
  'backtracking': { x: 400, y: 900 },
  'core_graph_basics': { x: 400, y: 1080 },
  'graphs': { x: 300, y: 1260 },
  'core_advanced_graph': { x: 100, y: 1440 },
  'core_dp_patterns': { x: 500, y: 1440 },
  'greedy': { x: 100, y: 1620 },
  'dp_1d': { x: 500, y: 1620 },
  'bit_manipulation': { x: 900, y: 1800 },
  'intervals': { x: 100, y: 1800 },
  'dp_2d': { x: 500, y: 1800 },
  'math_geometry': { x: 500, y: 1980 },
  'system_design_misc': { x: 300, y: 2160 },
};

const App: React.FC = () => {
  // --- State: User & Data ---
  const [user, setUser] = useState<User | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // --- State: UI ---
  const [nodePositions, setNodePositions] = useState(() => {
    const positions = { ...INITIAL_LAYOUT };
    roadmapData.forEach(cat => {
      if (!positions[cat.id]) {
        positions[cat.id] = { x: 0, y: 0 };
      }
    });
    return positions;
  });
  const [settings, setSettings] = useState({ allowPan: true, allowZoom: true, allowDrag: false });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // --- Refs for Interaction Logic ---
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Transform State (Source of Truth)
  const transform = useRef({ x: 0, y: 0, scale: 1 });

  // Pointer State
  const pointers = useRef<Map<number, { x: number, y: number }>>(new Map());
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const lastDragPos = useRef({ x: 0, y: 0 }); // World coordinates for node dragging

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
    // Center the graph initially
    const padding = 100;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Simple centering logic (can be improved with bounding box)
    const isMobile = width < 768;
    const initialScale = isMobile ? 0.35 : 0.6;
    const centerOffset = isMobile ? 250 : 450;
    const initialX = width / 2 - (centerOffset * initialScale); // Approx center of tree width
    const initialY = 100;

    transform.current = { x: initialX, y: initialY, scale: initialScale };
    updateTransform();
  }, [updateTransform]);

  // --- Firebase Auth & Data Sync ---
  useEffect(() => {
    if (!isConfigured) return;

    // Create a Set of all valid question IDs for integrity checking
    const validQuestionIds = new Set<string>();
    roadmapData.forEach(cat => {
      cat.questions.forEach(q => validQuestionIds.add(q.id));
    });

    const filterValidIds = (ids: string[]) => {
      return ids.filter(id => validQuestionIds.has(id));
    };

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        return onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const validSolved = filterValidIds(data.solved || []);
            setSolvedIds(new Set(validSolved));
          }
          else setDoc(userRef, { solved: [] }, { merge: true });
        });
      }
      else {
        const local = localStorage.getItem('shreyans-arc-guest');
        if (local) {
          const parsed = JSON.parse(local);
          const validSolved = filterValidIds(parsed);
          setSolvedIds(new Set(validSolved));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleQuestion = async (id: string) => {
    const newSet = new Set(solvedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSolvedIds(newSet);
    const idsArray = Array.from(newSet);
    if (user) await setDoc(doc(db, 'users', user.uid), { solved: idsArray }, { merge: true });
    else localStorage.setItem('shreyans-arc-guest', JSON.stringify(idsArray));
  };

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); }
    catch (error) { console.error(error); alert("Login failed."); }
  };

  const resetView = () => {
    const width = window.innerWidth;
    const isMobile = width < 768;
    const initialScale = isMobile ? 0.35 : 0.6;
    const centerOffset = isMobile ? 250 : 450;
    const initialX = width / 2 - (centerOffset * initialScale);
    const initialY = 100;

    transform.current = { x: initialX, y: initialY, scale: initialScale };
    updateTransform();
    setNodePositions(INITIAL_LAYOUT);
  };

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
        // pointers.current.set(e.pointerId, currentPos); 
        // If we update pointers, the delta calculation below will be small.
        // Better to NOT update pointers.current until capture, so the first "move" is a jump of >5px?
        // Or just track "isMoving" state.
        return;
      }

      // Threshold passed: Capture and mark as moving
      containerRef.current?.setPointerCapture(e.pointerId);
      hasCaptured.current.set(e.pointerId, true);
    }

    const prevPointers = new Map<number, { x: number, y: number }>(pointers.current);
    pointers.current.set(e.pointerId, currentPos);

    // Node Dragging
    if (draggingNodeId && settings.allowDrag) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      const dx = worldPos.x - lastDragPos.current.x;
      const dy = worldPos.y - lastDragPos.current.y;

      setNodePositions(prev => {
        const id = draggingNodeId;
        const current = prev[id] || { x: 0, y: 0 };
        return {
          ...prev,
          [id]: { x: current.x + dx, y: current.y + dy }
        };
      });
      lastDragPos.current = worldPos;
      return;
    }

    // Pan & Zoom
    if (pointers.current.size === 1 && settings.allowPan) {
      const prev = prevPointers.get(e.pointerId)!;
      const curr = pointers.current.get(e.pointerId)!;
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;

      transform.current.x += dx;
      transform.current.y += dy;
      updateTransform();
    } else if (pointers.current.size === 2 && settings.allowZoom) {
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

      // Calculate zoom offset
      // World point under centroid should stay under centroid
      // (Center - Pan) / OldScale = (Center - NewPan) / NewScale
      // NewPan = Center - (Center - Pan) * (NewScale / OldScale)

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
    setDraggingNodeId(null);
  };

  // Non-passive wheel listener for zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (!settings.allowZoom) return;
      e.preventDefault();

      const scaleAmount = -e.deltaY * 0.001;
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
  }, [settings.allowZoom, updateTransform]);

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    if (settings.allowDrag) {
      e.stopPropagation();
      setDraggingNodeId(id);
      lastDragPos.current = screenToWorld(e.clientX, e.clientY);
    }
  };

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

  if (!isConfigured) return <div className="text-white p-10">Config Required</div>;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-dark-bg text-dark-text font-sans selection:bg-brand-primary/30">

      {/* UI Layer */}
      <div className="sidebar-ignore">
        <Sidebar
          totalSolved={totalSolved}
          totalQuestions={totalQuestions}
          overallProgress={overallProgress}
          user={user}
          onLogin={handleLogin}
          onLogout={() => firebaseSignOut(auth)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onReset={resetView}
          onOpenInfo={() => setIsInfoOpen(true)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Menu Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="sidebar-ignore fixed top-6 right-6 z-40 p-3 bg-dark-card border border-dark-border rounded-lg text-white shadow-xl hover:bg-dark-highlight transition-all animate-fade-in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}

      <div className="sidebar-ignore">
        <SettingsPanel
          settings={settings}
          onToggle={(key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
        <InfoModal
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
        />
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
          className="w-full h-full origin-top-left will-change-transform"
          style={{ transform: 'translate(0px, 0px) scale(1)' }}
        >
          <ConnectionLines
            nodePositions={nodePositions}
          />

          {roadmapData.map(category => (
            <RoadmapNode
              key={category.id}
              category={category}
              solvedIds={solvedIds}
              onClick={setSelectedCategory}
              x={nodePositions[category.id]?.x || 0}
              y={nodePositions[category.id]?.y || 0}
              isDragging={!!draggingNodeId}
              onMouseDown={handleNodeMouseDown}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCategory && (
        <div className="sidebar-ignore">
          <QuestionModal
            category={selectedCategory}
            isOpen={!!selectedCategory}
            onClose={() => setSelectedCategory(null)}
            solvedIds={solvedIds}
            toggleQuestion={toggleQuestion}
          />
        </div>
      )}
    </div>
  );
};

export default App;