import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FloatingShapes } from "./ParticleSystem";

const PageBroken = () => {
  const location = useLocation();
  const reason = location.state?.reason || "Something went bonkers on our side.";
  return (
    <div className="min-h-screen pt-24 pb-8 px-4 sm:px-8 bg-gradient-to-br from-black via-zinc-950 to-black text-neutral-200 flex items-start justify-center relative overflow-hidden">
      <FloatingShapes />
      <div className="text-center max-w-xl w-full mt-10 relative z-10">
        <div className="relative mx-auto w-40 h-40 mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/25 to-amber-500/25 blur-2xl" />
          <div className="absolute inset-2 rounded-3xl border border-white/10 bg-white/5" />
          <div className="absolute inset-0 flex items-center justify-center text-5xl">🛠️</div>
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent mb-3">
          Oops! Page took a coffee break
        </h1>
        <p className="text-neutral-400 mb-6">{reason} Try refreshing or head back.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => window.location.reload()} className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
            Refresh
          </button>
          <Link to="/" className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageBroken;
