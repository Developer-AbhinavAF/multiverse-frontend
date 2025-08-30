import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeProvider";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/updates", label: "Latest Updates" },
  { to: "/about-us", label: "About us" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const submitSearch = (e) => {
    e?.preventDefault();
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-0 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-900/40 via-fuchsia-900/20 to-indigo-900/40 backdrop-blur-md shadow-lg shadow-cyan-500/20">
          <div className="flex items-center justify-between h-14 px-6">

            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-semibold tracking-wide"
              onClick={() => setOpen(false)}
            >
              <span>GameVerse</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isActive(item.to)
                      ? "bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-indigo-500 text-white shadow-md shadow-cyan-500/20"
                      : "text-cyan-200 hover:text-white hover:bg-cyan-500/10 border border-transparent hover:border-cyan-400/30"
                  }`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Expandable Search (desktop) */}
              <form onSubmit={submitSearch} className="hidden sm:flex items-center">
                <div className={`flex items-center border border-white/10 rounded-full overflow-hidden transition-all duration-200 ${searchOpen ? "bg-white/10 w-64" : "bg-white/5 w-10"}`}>
                  <button
                    type="button"
                    onClick={() => setSearchOpen((v) => !v)}
                    className="flex items-center justify-center w-10 h-10 text-cyan-200 hover:text-white"
                    title="Search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  {searchOpen && (
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search..."
                      className="bg-transparent placeholder:text-neutral-400 text-white px-2 py-2 w-full focus:outline-none"
                    />
                  )}
                  {searchOpen && (
                    <button type="submit" className="px-3 py-2 text-sm bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white">Go</button>
                  )}
                </div>
              </form>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setOpen((o) => !o)}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                {open ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {open && (
            <div className="md:hidden border-t border-white/10 px-3 py-2">
              <nav className="flex flex-col gap-1 py-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      isActive(item.to)
                        ? "bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-indigo-600 text-white"
                        : "text-cyan-200 hover:text-white hover:bg-cyan-500/20 border border-transparent hover:border-cyan-400/40"
                    }`}
                  >
                    {item.label}
                  </NavLink>
                ))}
                {/* Inline search for mobile */}
                <form onSubmit={submitSearch} className="mt-2">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search..."
                      className="bg-transparent flex-1 text-white placeholder:text-neutral-400 focus:outline-none"
                    />
                    <button type="submit" className="px-3 py-1.5 text-sm rounded-md bg-gradient-to-r from-emerald-400 to-cyan-500 text-white">Go</button>
                  </div>
                </form>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;