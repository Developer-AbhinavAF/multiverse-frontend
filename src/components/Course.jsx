import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cards from "./Cards";

const Courses = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageBlock, setPageBlock] = useState(0);
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortOption, setSortOption] = useState("rating");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [yearFilter, setYearFilter] = useState("");
  const searchInputRef = useRef(null);
  const limit = 20;

  // Updated endpoints with Render.com URL
  const endpoints = [
    "https://backend-0nxk.onrender.com/api/movies",
    "https://backend-0nxk.onrender.com/api/animeMovie",
    "https://backend-0nxk.onrender.com/api/animeSeries",
    "https://backend-0nxk.onrender.com/api/webSeries",
    "https://backend-0nxk.onrender.com/api/kDramas",
    "https://backend-0nxk.onrender.com/api/cDramas",
    "https://backend-0nxk.onrender.com/api/thaiDramas",
    "https://backend-0nxk.onrender.com/api/japaneseDramas",

  ];

  // Map each endpoint to its collection type (same order as endpoints)
  const endpointTypes = [
    "movies",
    "animeMovie",
    "animeSeries",
    "webSeries",
    "kDramas",
    "cDramas",
    "thaiDramas",
    "japaneseDramas",

  ];

  // Helpers for cache keys
  const getEndpointKey = (type, query) => `courses:${type}:${query || 'all'}`;
  const getCombinedKey = (query) => `courses:all:${query || 'all'}`;

  const clearCoursesCache = () => {
    try {
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('courses:')) toRemove.push(k);
      }
      toRemove.forEach(k => localStorage.removeItem(k));
    } catch (_) {}
  };

  const fetchAllMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // localStorage cache with TTL
      const ttlMinutes = 10; // adjust as needed
      const combinedKey = getCombinedKey(submittedSearch);
      const cachedRawCombined = localStorage.getItem(combinedKey);
      let usedAnyCache = false;
      // Try fast path via combined key first
      if (cachedRawCombined) {
        try {
          const cached = JSON.parse(cachedRawCombined);
          if (cached?.expiry && cached.expiry > Date.now() && Array.isArray(cached.data)) {
            setMedia(cached.data);
            setLoading(false);
            usedAnyCache = true;
          }
        } catch (_) {}
      }
      // If combined cache not present/valid, try per-endpoint caches and combine
      if (!usedAnyCache) {
        const perCache = [];
        endpointTypes.forEach((type) => {
          const key = getEndpointKey(type, submittedSearch);
          const raw = localStorage.getItem(key);
          if (!raw) return;
          try {
            const parsed = JSON.parse(raw);
            if (parsed?.expiry && parsed.expiry > Date.now() && Array.isArray(parsed.data)) {
              perCache.push(...parsed.data.map(it => ({ ...it, type: it.type || type })));
            }
          } catch (_) {}
        });
        if (perCache.length > 0) {
          setMedia(perCache);
          setLoading(false);
          usedAnyCache = true;
        }
      }

      // Fetch from all endpoints, tolerate partial failures
      const responses = await Promise.allSettled(
        endpoints.map((endpoint) =>
          axios.get(endpoint, {
            params: {
              search: submittedSearch,
              page: 1, // Always request first page from each endpoint
              limit: 100,
            },
          })
        )
      );

      // Combine successful results and ensure each item has a proper type based on its endpoint
      const allResults = responses.flatMap((res, idx) => {
        if (res.status !== "fulfilled") return [];
        const type = endpointTypes[idx];
        const items = res.value?.data?.results || [];
        return items.map((item) => ({
          ...item,
          type: item.type || type,
        }));
      });
      
      setMedia(allResults);
      // Write combined cache and per-endpoint caches with TTL
      const expiry = Date.now() + ttlMinutes * 60 * 1000;
      try {
        localStorage.setItem(combinedKey, JSON.stringify({ data: allResults, expiry }));
      } catch (_) {}
      // Group by type
      const grouped = endpointTypes.reduce((acc, t) => { acc[t] = []; return acc; }, {});
      allResults.forEach(it => { grouped[it.type]?.push(it); });
      try {
        Object.entries(grouped).forEach(([type, items]) => {
          const key = getEndpointKey(type, submittedSearch);
          localStorage.setItem(key, JSON.stringify({ data: items, expiry }));
        });
      } catch (_) {}
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch media. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [submittedSearch]);

  useEffect(() => {
    fetchAllMedia();
  }, [fetchAllMedia]);

  // Restore filters/sort from localStorage on first mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('courses:filters'));
      if (saved && typeof saved === 'object') {
        if (saved.activeFilter) setActiveFilter(saved.activeFilter);
        if (saved.qualityFilter) setQualityFilter(saved.qualityFilter);
        if (typeof saved.ratingFilter === 'number') setRatingFilter(saved.ratingFilter);
        if (saved.yearFilter !== undefined) setYearFilter(saved.yearFilter);
        if (saved.sortOption) setSortOption(saved.sortOption);
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist filters/sort whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        'courses:filters',
        JSON.stringify({ activeFilter, qualityFilter, ratingFilter: Number(ratingFilter), yearFilter, sortOption })
      );
    } catch (_) {}
  }, [activeFilter, qualityFilter, ratingFilter, yearFilter, sortOption]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
    setPageBlock(0);
  }, [activeFilter, qualityFilter, ratingFilter, yearFilter, sortOption]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === submittedSearch) return;
    setSubmittedSearch(searchQuery);
    setPage(1);
    setPageBlock(0);
  };

  const handleCardClick = (item) => {
    navigate(`/media/${item.slug}?collection=${item.type}`);
  };

  // Apply filters and sorting
  const filteredMedia = [...media]
    // Filter by category
    .filter(item => {
      if (activeFilter === "all") return true;
      if (activeFilter === "movie") {
        const movieLike = [
          "movie",
          "animeMovie",
          // "kDramas",
          // "cDramas",
          // "thaiDramas",
          // "japaneseDramas",
        ];
        return movieLike.includes(item.type);
      }

      if (activeFilter === "anime") return item.type.includes("anime");
      if (activeFilter === "movie") return item.type.includes("movie");
      if (activeFilter === "drama") return item.type === "cDrama" || item.type === "kDrama" || item.type === "thaiDrama" || item.type === "japaneseDrama";
      if (activeFilter === "series") return item.type === "webSeries" || item.type === "animeSeries";
      return true;
    })
    // Filter by quality
    .filter(item => {
      if (qualityFilter === "all") return true;
      return item.qualities && item.qualities[qualityFilter];
    })
    // Filter by rating
    .filter(item => (item.rating || 0) >= Number(ratingFilter))
    // Filter by year
    .filter(item => {
      if (!yearFilter) return true;
      const year = new Date(item.releaseDate).getFullYear();
      return year === parseInt(yearFilter);
    })
    // Sorting
    .sort((a, b) => {
      // Extract comparable values with sensible fallbacks
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      const ratingA = typeof a.rating === 'number' ? a.rating : parseFloat(a.rating) || 0;
      const ratingB = typeof b.rating === 'number' ? b.rating : parseFloat(b.rating) || 0;
      const titleA = (a.title || '').toString();
      const titleB = (b.title || '').toString();

      if (sortOption === "newest") {
        if (dateB !== dateA) return dateB - dateA;
        if (ratingB !== ratingA) return ratingB - ratingA;
        return titleA.localeCompare(titleB);
      } else if (sortOption === "oldest") {
        if (dateA !== dateB) return dateA - dateB;
        if (ratingB !== ratingA) return ratingB - ratingA;
        return titleA.localeCompare(titleB);
      } else if (sortOption === "rating") {
        if (ratingB !== ratingA) return ratingB - ratingA;
        if (dateB !== dateA) return dateB - dateA;
        return titleA.localeCompare(titleB);
      } else if (sortOption === "title") {
        const tComp = titleA.localeCompare(titleB);
        if (tComp !== 0) return tComp;
        if (ratingB !== ratingA) return ratingB - ratingA;
        return dateB - dateA;
      }
      return 0;
    });

  const paginatedMedia = filteredMedia.slice((page - 1) * limit, page * limit);

  // Keep total pages in sync with current filtered results
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredMedia.length / limit)));
    // Clamp page into valid range if current page exceeds new total pages
    setPage((prev) => Math.min(prev, Math.max(1, Math.ceil(filteredMedia.length / limit))));
  }, [filteredMedia]);

  const filters = [
    { id: "all", label: "All Media" },
    { id: "movie", label: "Movies" },
    { id: "drama", label: "Drama" },
    { id: "anime", label: "Anime" },
    { id: "series", label: "Series" },
  ];

  const qualityOptions = [
    { id: "all", label: "All Qualities" },
    { id: "480p", label: "480p" },
    { id: "720p", label: "720p" },
    { id: "1080p", label: "1080p" },
  ];

  const sortOptions = [
    { id: "newest", label: "Newest" },
    { id: "oldest", label: "Oldest" },
    { id: "rating", label: "Highest Rated" },
    { id: "title", label: "Title (A-Z)" },
  ];

  // Get unique years
  const years = [...new Set(media.map(item => 
    new Date(item.releaseDate).getFullYear()
  ).filter(year => !isNaN(year)))].sort((a, b) => b - a);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.6 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.3 },
    },
  };

  // Pagination
  const pagesPerBlock = 5;
  const startPage = pageBlock * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 130, behavior: "smooth" });
  };

  const goToNextBlock = () => {
    if ((pageBlock + 1) * pagesPerBlock < totalPages) {
      setPageBlock((prev) => prev + 1);
      setPage((prev) =>
        prev + pagesPerBlock > totalPages ? totalPages : prev + pagesPerBlock
      );
    }
  };

  const goToPrevBlock = () => {
    if (pageBlock > 0) {
      setPageBlock((prev) => prev - 1);
      setPage((prev) => prev - pagesPerBlock);
    }
  };

  // Skeleton Loading
  const SkeletonCard = () => (
    <motion.div variants={itemVariants} className="flex flex-col h-full w-full">
      <div className="relative overflow-hidden rounded-xl bg-white/10 h-80 border border-white/10">
        <div className="absolute inset-0 transform -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-6 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
    </motion.div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-200">
        <div className="text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="text-amber-400 text-5xl mb-4">⚠️</div>
          <h3 className="text-white text-xl font-semibold mb-2">{error}</h3>
          <button
            onClick={fetchAllMedia}
            className="mt-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-2 rounded-xl shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-neutral-200 pt-[130px] pb-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8"
        >
          <div className="relative w-full md:w-1/2">
            <motion.input
              ref={searchInputRef}
              type="text"
              placeholder="Search across all media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-200 backdrop-blur-sm placeholder:text-neutral-400 focus:outline-none"
              animate={{
                borderColor: isSearchFocused
                  ? "rgba(34, 211, 238, 0.7)"
                  : "rgba(255, 255, 255, 0.12)",
                boxShadow: isSearchFocused
                  ? "0 0 0 3px rgba(34, 211, 238, 0.25)"
                  : "0 4px 20px rgba(0, 0, 0, 0.2)",
              }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute right-3 top-3 text-cyan-300">
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
            </div>
          </div>

          <motion.button
            type="submit"
            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
            Search
          </motion.button>
        </form>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    setPage(1);
                    setPageBlock(0);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    activeFilter === filter.id
                      ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                      : "bg-white/10 text-cyan-200 hover:bg-white/15 border border-white/10"
                  }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quality Filter */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">
              Quality
            </label>
            <div className="flex flex-wrap gap-2">
              {qualityOptions.map((quality) => (
                <motion.button
                  key={quality.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQualityFilter(quality.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    qualityFilter === quality.id
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                      : "bg-white/10 text-cyan-200 hover:bg-white/15 border border-white/10"
                  }`}
                >
                  {quality.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">
              Minimum Rating
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="10"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full accent-cyan-500"
              />
              <div className="bg-white/10 px-3 py-1 rounded-lg text-sm text-cyan-300 border border-white/10">
                {ratingFilter}⭐
              </div>
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">
              Release Year
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full bg-white/10 border border-white/10 text-neutral-200 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-cyan-200 text-sm">
            Showing {filteredMedia.length} items
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-200 text-sm">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white/10 border border-white/10 text-neutral-200 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
          >
            {Array.from({ length: limit }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </motion.div>
        ) : (
          <>
            {paginatedMedia.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-block p-6 bg-white/5 rounded-2xl backdrop-blur-lg border border-white/10">
                  <div className="text-cyan-300 text-5xl mb-4">🎬</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    No Media Found
                  </h3>
                  <p className="text-cyan-200 max-w-md mx-auto">
                    Try adjusting your search or filters.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
                >
                  <AnimatePresence>
                    {paginatedMedia.map((item) => (
                      <motion.div
                        key={item._id}
                        variants={itemVariants}
                        whileHover="hover"
                        className="flex flex-col h-full w-full cursor-pointer group"
                        onClick={() => handleCardClick(item)}
                      >
                        <Cards
                          item={item}
                          collection={item.type}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {totalPages > 1 && (
                  <motion.div
                    className="mt-10 flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm p-2 rounded-xl border border-white/10">
                      {pageBlock > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={goToPrevBlock}
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7m0 0l7-7m-7 7h18"
                            />
                          </svg>
                          Prev
                        </motion.button>
                      )}

                      {Array.from(
                        { length: endPage - startPage + 1 },
                        (_, i) => startPage + i
                      ).map((pageNum) => (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                            page === pageNum
                              ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                              : "bg-white/10 text-cyan-200 hover:bg-white/15 border border-white/10"
                          }`}
                        >
                          {pageNum}
                        </motion.button>
                      ))}

                      {(pageBlock + 1) * pagesPerBlock < totalPages && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={goToNextBlock}
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white flex items-center"
                        >
                          Next
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );

};

export default Courses;