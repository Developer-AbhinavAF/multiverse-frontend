import React, { useEffect } from "react";

// Fixed overlay that renders a radial shine following the mouse
// Works across all pages when included once (e.g., in App)
const MouseGlow = ({ colorA = "rgba(34,211,238,0.18)", colorB = "rgba(168,85,247,0.12)" }) => {
  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      document.documentElement.style.setProperty("--mx", `${x}px`);
      document.documentElement.style.setProperty("--my", `${y}px`);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  const bg = {
    background: `radial-gradient(200px 200px at var(--mx, 50vw) var(--my, 50vh), ${colorA}, transparent 60%), radial-gradient(400px 400px at calc(var(--mx, 50vw) + 120px) calc(var(--my, 50vh) + 120px), ${colorB}, transparent 65%)`,
  };

  return (
    <div
      aria-hidden
      style={bg}
      className="pointer-events-none fixed inset-0 z-0 opacity-80 transition-[background] duration-100 ease-linear"
    />
  );
};

export default MouseGlow;
