import React, { useState, useEffect } from 'react';
import { roadmapData, Category } from './data/questions';
import { auth, googleProvider, signInWithPopup, firebaseSignOut, db, doc, onSnapshot, setDoc, isConfigured } from './lib/firebase';
import { QuestionModal } from './components/QuestionModal';
import clsx from 'clsx';
import { User } from 'firebase/auth';

/**
 * App.tsx
 * Phase 4: NeetCode UI Overhaul
 */
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Configuration check
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-dark-bg text-dark-text font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-card border border-brand-primary/30 rounded-2xl p-8 shadow-2xl text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Configuration Required</h1>
          <p className="text-dark-muted">Please configure your firebase.ts file.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        return onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setSolvedIds(new Set(docSnap.data().solved || []));
          } else {
            setDoc(userRef, { solved: [] }, { merge: true });
          }
        });
      } else {
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
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { solved: idsArray }, { merge: true });
    } else {
      localStorage.setItem('shreyans-arc-guest', JSON.stringify(idsArray));
    }
  };

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); }
    catch (error) { console.error(error); alert("Login failed."); }
  };

  const totalQuestions = roadmapData.reduce((acc, cat) => acc + cat.questions.length, 0);
  const totalSolved = solvedIds.size;
  const overallProgress = Math.round((totalSolved / totalQuestions) * 100);

  // Helper to find category by ID
  const getCat = (id: string) => roadmapData.find(c => c.id === id);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text font-sans pb-32">
      {/* Navbar / Top Bar */}
      <nav className="sticky top-0 z-40 w-full bg-dark-bg/90 backdrop-blur-md border-b border-dark-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary/10 p-1.5 rounded-lg border border-brand-primary/20">
              <span className="font-bold text-brand-primary">SA</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white hidden sm:block">Shreyan's Arc</span>
          </div>

          {/* Central Progress Bar - Prominent */}
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <div className="flex justify-between text-xs font-mono text-dark-muted mb-1.5">
              <span>Total Mastery</span>
              <span>{totalSolved} / {totalQuestions}</span>
            </div>
            <div className="w-full h-2.5 bg-dark-card border border-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary transition-all duration-700 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          <div>
            {isAuthLoading ? (
              <div className="w-8 h-8 rounded-full bg-dark-highlight animate-pulse" />
            ) : user ? (
              <button onClick={() => firebaseSignOut(auth)} className="text-sm font-medium text-dark-muted hover:text-white transition-colors">
                Sign Out
              </button>
            ) : (
              <button onClick={handleLogin} className="text-sm font-semibold bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primaryHover transition-all shadow-lg shadow-brand-primary/20">
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Roadmap Tree Layout */}
      <div className="max-w-5xl mx-auto px-4 mt-12 relative">

        {/* SVG Connector Overlay - Behind the nodes */}
        {/* We use a static SVG for the lines since the layout is fixed grid-like rows */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 text-dark-highlight hidden md:block" style={{ top: '30px' }}>
          <svg width="100%" height="100%" viewBox="0 0 1000 1200" preserveAspectRatio="none">
            {/* Arrays -> Two Pointers & Stack */}
            <path d="M500 40 C 500 80, 350 80, 350 130" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M500 40 C 500 80, 650 80, 650 130" stroke="currentColor" strokeWidth="2" fill="none" />

            {/* Two Pointers -> Binary Search & Sliding Window */}
            <path d="M350 200 C 350 240, 200 240, 200 290" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M350 200 C 350 240, 350 240, 350 290" stroke="currentColor" strokeWidth="2" fill="none" />

            {/* Stack -> Linked List */}
            <path d="M650 200 C 650 240, 500 240, 500 290" stroke="currentColor" strokeWidth="2" fill="none" />

            {/* Binary Search + Sliding Window + Linked List -> Trees */}
            <path d="M200 360 C 200 400, 500 400, 500 450" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M350 360 C 350 400, 500 400, 500 450" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M500 360 C 500 400, 500 400, 500 450" stroke="currentColor" strokeWidth="2" fill="none" />

            {/* Trees -> Tries & Backtracking */}
            <path d="M500 520 C 500 560, 275 560, 275 610" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M500 520 C 500 560, 725 560, 725 610" stroke="currentColor" strokeWidth="2" fill="none" />

            {/* Trees -> Heap */}
            <path d="M500 520 C 500 680, 500 680, 500 770" stroke="currentColor" strokeWidth="2" fill="none" />

            {/* Backtracking -> Graphs */}
            <path d="M725 680 C 725 720, 725 720, 725 770" stroke="currentColor" strokeWidth="2" fill="none" />

            {/* Heap -> Intervals & Greedy */}
            <path d="M500 840 C 500 880, 350 880, 350 930" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M500 840 C 500 880, 650 880, 650 930" stroke="currentColor" strokeWidth="2" fill="none" />

            {/* Graphs -> Advanced Graphs & 1D DP */}
            <path d="M725 840 C 725 880, 850 880, 850 930" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M725 840 C 725 880, 950 880, 950 770" stroke="currentColor" strokeWidth="2" fill="none" /> {/* Backtrack to 1D DP? Layout tweak */}

            {/* Misc Links */}
            <path d="M950 840 C 950 880, 800 1000, 800 1090" stroke="currentColor" strokeWidth="2" fill="none" /> {/* 1D DP -> 2D DP */}
            <path d="M850 1000 C 850 1040, 800 1040, 800 1090" stroke="currentColor" strokeWidth="2" fill="none" /> {/* Adv Graph -> 2D DP */}
            <path d="M800 1160 C 800 1200, 800 1200, 800 1250" stroke="currentColor" strokeWidth="2" fill="none" /> {/* 2D DP -> Math */}
          </svg>
        </div>

        {/* Tree Nodes Container */}
        <div className="relative z-10 flex flex-col items-center gap-12 md:gap-16 pb-20">

          {/* ROW 1 */}
          <div className="flex justify-center w-full">
            <RoadmapNode category={getCat('arrays')} solvedIds={solvedIds} onClick={setSelectedCategory} />
          </div>

          {/* ROW 2 */}
          <div className="flex justify-center gap-12 md:gap-40 w-full">
            <RoadmapNode category={getCat('two_pointers')} solvedIds={solvedIds} onClick={setSelectedCategory} />
            <RoadmapNode category={getCat('stack')} solvedIds={solvedIds} onClick={setSelectedCategory} />
          </div>

          {/* ROW 3 */}
          <div className="flex justify-center gap-6 md:gap-12 w-full">
            <RoadmapNode category={getCat('binary_search')} solvedIds={solvedIds} onClick={setSelectedCategory} />
            <RoadmapNode category={getCat('sliding_window')} solvedIds={solvedIds} onClick={setSelectedCategory} />
            <RoadmapNode category={getCat('linked_list')} solvedIds={solvedIds} onClick={setSelectedCategory} />
          </div>

          {/* ROW 4 */}
          <div className="flex justify-center w-full">
            <RoadmapNode category={getCat('trees')} solvedIds={solvedIds} onClick={setSelectedCategory} />
          </div>

          {/* ROW 5 */}
          <div className="flex justify-center gap-12 md:gap-64 w-full">
            <RoadmapNode category={getCat('trie')} solvedIds={solvedIds} onClick={setSelectedCategory} />
            <RoadmapNode category={getCat('backtracking')} solvedIds={solvedIds} onClick={setSelectedCategory} />
          </div>

          {/* ROW 6 */}
          <div className="flex justify-center gap-8 md:gap-32 w-full relative">
            <RoadmapNode category={getCat('heap')} solvedIds={solvedIds} onClick={setSelectedCategory} />
            <RoadmapNode category={getCat('graphs')} solvedIds={solvedIds} onClick={setSelectedCategory} />
            <div className="absolute right-0 md:right-10 top-0">
              <RoadmapNode category={getCat('dp1')} solvedIds={solvedIds} onClick={setSelectedCategory} />
            </div>
          </div>

          {/* ROW 7 */}
          <div className="flex justify-center gap-6 md:gap-16 w-full">
            <RoadmapNode category={getCat('intervals')} solvedIds={solvedIds} onClick={setSelectedCategory} />
            <RoadmapNode category={getCat('greedy')} solvedIds={solvedIds} onClick={setSelectedCategory} />
            <RoadmapNode category={getCat('advanced_graphs')} solvedIds={solvedIds} onClick={setSelectedCategory} />
          </div>

          {/* ROW 8 */}
          <div className="flex justify-center gap-6 md:gap-16 w-full relative">
            <RoadmapNode category={getCat('dp2')} solvedIds={solvedIds} onClick={setSelectedCategory} />
            <div className="absolute right-0 md:right-20 top-0">
              <RoadmapNode category={getCat('bit_manipulation')} solvedIds={solvedIds} onClick={setSelectedCategory} />
            </div>
          </div>

          {/* ROW 9 */}
          <div className="flex justify-center w-full">
            <RoadmapNode category={getCat('math')} solvedIds={solvedIds} onClick={setSelectedCategory} />
          </div>

        </div>
      </div>

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

const RoadmapNode: React.FC<{
  category?: Category;
  solvedIds: Set<string>;
  onClick: (c: Category) => void;
}> = ({ category, solvedIds, onClick }) => {
  if (!category) return <div className="w-40 h-16 opacity-0" />; // Placeholder

  const total = category.questions.length;
  const solved = category.questions.filter(q => solvedIds.has(q.id)).length;
  const isComplete = solved === total && total > 0;
  const progress = Math.round((solved / total) * 100);

  return (
    <div
      onClick={() => onClick(category)}
      className={clsx(
        "relative w-36 md:w-48 p-0 rounded-lg cursor-pointer transition-all duration-300 group hover:scale-105 shadow-xl z-20",
        "bg-dark-card border border-dark-border hover:border-dark-highlight"
      )}
    >
      {/* Progress Background Fill */}
      <div
        className={clsx(
          "absolute top-0 bottom-0 left-0 rounded-lg opacity-20 transition-all duration-500",
          isComplete ? "bg-brand-accent" : "bg-brand-primary"
        )}
        style={{ width: `${progress}%` }}
      />

      <div className="relative p-3 text-center">
        <h3 className="text-sm font-semibold text-white group-hover:text-white truncate px-1">
          {category.title}
        </h3>

        {/* Status Pills */}
        <div className="mt-2 flex justify-center">
          {isComplete ? (
            <span className="text-[10px] font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-full border border-brand-accent/20">
              COMPLETED
            </span>
          ) : (
            <div className="text-[10px] font-mono text-dark-muted bg-black/20 px-2 py-0.5 rounded-full">
              {solved} / {total}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;