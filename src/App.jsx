import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import MouseGlow from "./components/MouseGlow";
import ScrollControls from "./components/ScrollControls";

const Home = lazy(() => import("./home/Home"));
const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const LatestUpdates = lazy(() => import("./components/LatestUpdates"));
const Courses = lazy(() => import("./components/Course"));
const Mediator = lazy(() => import("./components/Mediator"));
const Stream = lazy(() => import("./components/Stream"));
const NotFound = lazy(() => import("./components/NotFound"));
const Broken = lazy(() => import("./components/PageBroken"));

function App() {
  // Temporary: Global hotkey Ctrl+Shift+F to trigger a toast
  useEffect(() => {
    const onKeyDown = (e) => {
      // Avoid triggering while typing in inputs/textareas or contentEditable
      const ae = document.activeElement;
      const tag = ae?.tagName?.toLowerCase();
      const isEditable = ae?.isContentEditable || tag === "input" || tag === "textarea";

      if (isEditable) return;

      const isCtrlShiftF = e.ctrlKey && e.shiftKey && (e.key === "F" || e.key === "f");
      if (isCtrlShiftF) {
        e.preventDefault();
        toast.success("Test toast via Ctrl+Shift+F");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  return (
    <div className="min-h-screen text-neutral-200 relative bg-black">
      {/* Global mouse-follow shine background */}
      <MouseGlow />
      <ScrollControls />
      <main className="pt-16 relative z-10">
        <Navbar />
        <Suspense fallback={<Loader label="Loading page..." />}> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<Courses />} />
            <Route path="/updates" element={<LatestUpdates />} />
            <Route path="/media/:slug" element={<Mediator />} />
            <Route path="/stream/:slug" element={<Stream />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/broken" element={<Broken />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
            color: '#e5e7eb',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(14px)',
            borderRadius: '12px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.28), 0 0 18px rgba(6,182,212,0.2)',
          },
        }}
      />
    </div>
  );
}

export default App;