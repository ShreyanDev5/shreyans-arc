import React, { useState, useEffect, useRef, useCallback } from 'react';
import { roadmapData, Category } from './data/questions';
import { auth, googleProvider, signInWithPopup, firebaseSignOut, db, doc, onSnapshot, setDoc, isConfigured } from './lib/firebase';
import { QuestionModal } from './components/QuestionModal';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import RoadmapNode from './components/RoadmapNode';
import ConnectionLines from './components/ConnectionLines';
import { User } from 'firebase/auth';

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

const App: React.FC = () => {
  // --- State: User & Data ---
  const [user, setUser] = useState<User | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // --- State: Canvas & Interaction ---
  const [viewState, setViewState] = useState({ x: window.innerWidth / 2 - 100, y: 100, scale: 1 });
  const [nodePositions, setNodePositions] = useState(INITIAL_LAYOUT);
  const [settings, setSettings] = useState({ allowPan: true, allowZoom: true, allowDrag: false });

  // --- Refs for Interaction Logic ---
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const isDraggingNode = useRef<string | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 }); // To distinguish click vs drag

  // --- Firebase Auth & Data Sync ---
  useEffect(() => {
    if (!isConfigured) return;
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        return onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) setSolvedIds(new Set(docSnap.data().solved || []));
          else setDoc(userRef, { solved: [] }, { merge: true });
        });
      }
      else {
        const local = localStorage.getItem('shreyans-arc-guest');
        if (local) setSolvedIds(new Set(JSON.parse(local)));
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

  // --- Interaction Handlers ---

  const handleWheel = (e: React.WheelEvent) => {
    if (!settings.allowZoom) return;
    e.preventDefault(); // Prevent browser zoom if possible (though passive listener might block this)

    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(viewState.scale * (1 + scaleAmount), 0.4), 2.5);

    // Zoom towards mouse pointer
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleRatio = newScale / viewState.scale;
    const newX = mouseX - (mouseX - viewState.x) * scaleRatio;
    const newY = mouseY - (mouseY - viewState.y) * scaleRatio;

    setViewState({ x: newX, y: newY, scale: newScale });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle mouse or Left mouse on background
    if (e.button === 1 || (e.button === 0 && settings.allowPan)) {
      isPanning.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    if (settings.allowDrag) {
      isDraggingNode.current = id;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      e.stopPropagation();
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setViewState(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
    else if (isDraggingNode.current) {
      const dx = (e.clientX - lastMousePos.current.x) / viewState.scale;
      const dy = (e.clientY - lastMousePos.current.y) / viewState.scale;

      setNodePositions(prev => ({
        ...prev,
        [isDraggingNode.current!]: {
          x: prev[isDraggingNode.current!].x + dx,
          y: prev[isDraggingNode.current!].y + dy
        }
      }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, [viewState.scale]);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
    isDraggingNode.current = null;
  }, []);

  // --- Touch Interaction Handlers (Mobile) ---
  const touchStartDist = useRef<number | null>(null);
  const lastTouchPos = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - Pan
      if (settings.allowPan) {
        isPanning.current = true;
        lastTouchPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }
    else if (e.touches.length === 2) {
      // Double touch - Zoom
      if (settings.allowZoom) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        touchStartDist.current = dist;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning.current && lastTouchPos.current) {
      const dx = e.touches[0].clientX - lastTouchPos.current.x;
      const dy = e.touches[0].clientY - lastTouchPos.current.y;
      setViewState(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastTouchPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    else if (e.touches.length === 2 && settings.allowZoom && touchStartDist.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );

      const scaleFactor = dist / touchStartDist.current;
      const newScale = Math.min(Math.max(viewState.scale * scaleFactor, 0.4), 2.5);

      // Center zoom (simplified for touch)
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      // Adjust position to zoom around center
      // This is a bit complex to get perfect without previous scale reference in this event, 
      // so we'll just update scale for now or use a simplified approach.
      // For smoother pinch, we'd need to track previous center and scale.
      // Simplified: Just scale.

      setViewState(prev => ({ ...prev, scale: newScale }));
      touchStartDist.current = dist;
    }
  };

  const handleTouchEnd = () => {
    isPanning.current = false;
    touchStartDist.current = null;
    lastTouchPos.current = null;
  };

  // Global event listeners for drag/pan
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);


  // --- Render Helpers ---
  const totalQuestions = roadmapData.reduce((acc, cat) => acc + cat.questions.length, 0);
  const totalSolved = solvedIds.size;
  const overallProgress = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

  if (!isConfigured) return <div className="text-white p-10">Config Required</div>;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-dark-bg text-dark-text font-sans selection:bg-brand-primary/30">

      {/* UI Layer */}
      <Sidebar
        totalSolved={totalSolved}
        totalQuestions={totalQuestions}
        overallProgress={overallProgress}
      />

      <SettingsPanel
        settings={settings}
        onToggle={(key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))}
      />

      {/* Auth Button (Floating Top Left) */}
      <div className="fixed top-6 left-6 z-50">
        {user ? (
          <div className="flex items-center gap-3 bg-dark-card border border-dark-border p-2 rounded-lg shadow-xl">
            <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-full" />
            <button onClick={() => firebaseSignOut(auth)} className="text-xs font-bold text-dark-muted hover:text-white uppercase tracking-wider px-2">
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-brand-primary/20 hover:bg-brand-primaryHover transition-all hover:scale-105 active:scale-95"
          >
            Login to Save Progress
          </button>
        )}
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Canvas World */}
        <div
          style={{
            transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})`,
            transformOrigin: '0 0',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            willChange: 'transform'
          }}
        >
          <ConnectionLines nodePositions={nodePositions} />

          {roadmapData.map(category => (
            <RoadmapNode
              key={category.id}
              category={category}
              solvedIds={solvedIds}
              onClick={setSelectedCategory}
              x={nodePositions[category.id]?.x || 0}
              y={nodePositions[category.id]?.y || 0}
              scale={viewState.scale}
              isDragging={!!isDraggingNode.current} // Pass drag state to prevent click
              onMouseDown={handleNodeMouseDown}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCategory && (
        <QuestionModal
          category={selectedCategory}
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          solvedIds={solvedIds}
          toggleQuestion={toggleQuestion}
        />
      )}
    </div>
  );
};

export default App;