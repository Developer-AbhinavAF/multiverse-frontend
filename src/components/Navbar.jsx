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
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleSearchClick = () => {
    setOpen(false);
    navigate('/search');
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
              <span>SkyVeil</span>
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
              {/* Search Button (desktop) */}
              <button
                onClick={handleSearchClick}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 border border-emerald-400/30 hover:border-emerald-400/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm font-medium">Search</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setOpen((o) => !o)}
                className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/30 text-cyan-300 hover:from-cyan-500/30 hover:to-fuchsia-500/30 hover:text-cyan-200 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
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

              {/* Mobile Search Button (always visible) */}
              <button
                onClick={handleSearchClick}
                className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 text-emerald-300 hover:from-emerald-500/30 hover:to-cyan-500/30 hover:text-emerald-200 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 animate-pulse"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {open && (
            <div className="sm:hidden border-t border-white/10 px-3 py-2">
              <nav className="flex flex-col gap-1 py-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isActive(item.to)
                        ? "bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                        : "text-cyan-200 hover:text-white hover:bg-cyan-500/20 border border-transparent hover:border-cyan-400/40"
                    }`}
                  >
                    {item.label}
                  </NavLink>
                ))}
                {/* Search button for mobile dropdown */}
                <button
                  onClick={handleSearchClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-cyan-200 hover:text-white hover:bg-cyan-500/20 border border-transparent hover:border-cyan-400/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;