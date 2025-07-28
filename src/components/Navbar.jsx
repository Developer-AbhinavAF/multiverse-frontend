import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/search");
    }
    setSearchQuery("");
  };

  const handleSearchClick = () => {
    if (window.innerWidth <= 768) {
      navigate("/search");
    }
  };

  const navItems = (
    <>
      <li>
        <a href="/" className="hover:text-[#00E0FF] duration-200">
          Home
        </a>
      </li>
      <li>
        <a href="#contact" className="hover:text-[#00E0FF] duration-200">
          Contact
        </a>
      </li>
      <li>
        <a href="/about-us" className="hover:text-[#00E0FF] duration-200">
          About
        </a>
      </li>
    </>
  );

  return (
    <div className="w-full fixed z-50 bg-[#0C081E] text-white shadow-lg">
      <div className="navbar max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between mb-0">
        {/* Left Logo */}
        <div className="text-2xl font-bold tracking-wide text-[#00E0FF] cursor-pointer">
          Multiverse
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-10">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search across all media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-indigo-500/30 text-white backdrop-blur-sm focus:outline-none focus:border-[#00E0FF] transition-colors"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-6">{navItems}</ul>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex items-center gap-4">
          {/* Mobile Search Icon */}
          <button
            onClick={() => navigate("/search")}
            className="p-2 text-cyan-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Mobile Menu Button */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-lg bg-[#121026] rounded-box w-52"
            >
              {navItems}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;