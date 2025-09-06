import React, { useEffect, useState, useCallback } from "react";

const ScrollControls = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    const y = window.scrollY || window.pageYOffset;
    const doc = document.documentElement;
    const total = (doc.scrollHeight - doc.clientHeight);
    setShowTop(y > 180);
    setShowBottom(y < total - 180);
    const pct = total > 0 ? Math.min(100, Math.max(0, (y / total) * 100)) : 0;
    setProgress(pct);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // Keyboard shortcuts: Shift+T => top, Shift+B => bottom
  useEffect(() => {
    const onKey = (e) => {
      if (!e.shiftKey) return;
      if (e.code === 'KeyT') {
        e.preventDefault();
        scrollToTop();
      } else if (e.code === 'KeyB') {
        e.preventDefault();
        scrollToBottom();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  return (
    <>
      {/* Top scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-white/5 border-b border-white/10">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      </div>

      {/* Floating controls */}
      <div className="fixed right-3 sm:right-4 bottom-3 sm:bottom-4 z-50 flex flex-col gap-2 sm:gap-3">
      {showTop && (
        <button
          onClick={scrollToTop}
          className="group px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10 border border-white/15 text-cyan-200 hover:bg-white/15 shadow-lg backdrop-blur-md flex items-center gap-1.5 sm:gap-2"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          <span className="text-xs sm:text-sm hidden sm:inline">Top</span>
        </button>
      )}
      {showBottom && (
        <button
          onClick={scrollToBottom}
          className="group px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10 border border-white/15 text-cyan-200 hover:bg-white/15 shadow-lg backdrop-blur-md flex items-center gap-1.5 sm:gap-2"
          aria-label="Scroll to bottom"
        >
          <span className="text-xs sm:text-sm hidden sm:inline">Bottom</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      </div>
    </>
  );
};

export default ScrollControls;
