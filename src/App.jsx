import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./home/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import LatestUpdates from "./components/LatestUpdates";
import Courses from "./components/Course";
import Mediator from "./components/Mediator";
import Stream from "./components/Stream";

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
    <div className="min-h-screen text-neutral-200 relative">
      <Navbar />
      <main className="pt-16 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Courses />} />
          <Route path="/updates" element={<LatestUpdates />} />
          <Route path="/media/:slug" element={<Mediator />} />
          <Route path="/stream/:slug" element={<Stream />} />
        </Routes>
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