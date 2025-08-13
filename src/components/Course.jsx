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
  const [sortOption, setSortOption] = useState("newest");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [yearFilter, setYearFilter] = useState("");
  const searchInputRef = useRef(null);
  const limit = 20;

  // Hardcoded Base URL
  const BASE_URL = "https://multiverse-backend.onrender.com/api";

  // Endpoints list
  const endpoints = [ 
    `${BASE_URL}/movies`,
    `${BASE_URL}/animeMovie`,
    `${BASE_URL}/animeSeries`,
    `${BASE_URL}/webSeries`, 
    `${BASE_URL}/pcGames`,
    `${BASE_URL}/pcApps`,
    `${BASE_URL}/androidGames`,
    `${BASE_URL}/androidApps`,
    `${BASE_URL}/iosGames`,
    `${BASE_URL}/modApks`,
  ];

  const fetchAllMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const responses = await Promise.allSettled(
        endpoints.map((url) =>
          axios.get(url, {
            params: { search: submittedSearch, page: 1, limit: 100 },
            timeout: 20000, // 20s timeout for Render cold start
          })
        )
      );

      responses.forEach((res, index) => {
        if (res.status === "rejected") {
          console.error(`Error fetching ${endpoints[index]}:`, res.reason?.message);
        }
      });

      const allResults = responses.flatMap((res) =>
        res.status === "fulfilled" ? res.value.data.results || [] : []
      );

      setMedia(allResults);
      setTotalPages(Math.ceil(allResults.length / limit));
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

  const filteredMedia = [...media]
    .filter((item) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "movie")
        return item.type === "movie" || item.type === "animeMovie";
      if (activeFilter === "anime") return item.type.includes("anime");
      if (activeFilter === "series")
        return item.type === "webSeries" || item.type === "animeSeries";
      if (activeFilter === "drama") return item.type.includes("Drama");
      return true;
    })
    .filter((item) => {
      if (qualityFilter === "all") return true;
      return item.qualities && item.qualities[qualityFilter];
    })
    .filter((item) => item.rating >= ratingFilter)
    .filter((item) => {
      if (!yearFilter) return true;
      const year = new Date(item.releaseDate).getFullYear();
      return year === parseInt(yearFilter);
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      } else if (sortOption === "oldest") {
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      } else if (sortOption === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const paginatedMedia = filteredMedia.slice((page - 1) * limit, page * limit);

  const filters = [
    { id: "all", label: "All Media" },
    { id: "movie", label: "Movies" },
    { id: "anime", label: "Anime" },
    { id: "series", label: "Series" },
    { id: "drama", label: "Dramas" },
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

  const years = [
    ...new Set(
      media
        .map((item) => new Date(item.releaseDate).getFullYear())
        .filter((year) => !isNaN(year))
    ),
  ].sort((a, b) => b - a);

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

  const SkeletonCard = () => (
    <motion.div variants={itemVariants} className="flex flex-col h-full w-full">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-900 to-pink-800 h-80">
        <div className="absolute inset-0 transform -translate-x-full bg-gradient-to-r from-transparent via-purple-700/50 to-transparent animate-shimmer" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-6 bg-purple-900/50 rounded w-3/4"></div>
        <div className="h-4 bg-purple-900/50 rounded w-1/2"></div>
      </div>
    </motion.div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="text-center p-8 bg-gradient-to-br from-gray-900/70 to-indigo-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/30">
          <div className="text-amber-400 text-5xl mb-4">⚠️</div>
          <h3 className="text-amber-400 text-xl font-semibold mb-2">{error}</h3>
          <button
            onClick={fetchAllMedia}
            className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-600 via-gray-900 to-black pt-[130px] pb-12 px-4 sm:px-6 lg:px-8">
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
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-1/2">
            <motion.input
              ref={searchInputRef}
              type="text"
              placeholder="Search across all media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-indigo-500/30 text-white backdrop-blur-sm"
            />
            <div className="absolute right-3 top-3 text-purple-400">
              🔍
            </div>
          </div>
          <motion.button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg"
          >
            Search
          </motion.button>
        </form>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-4 rounded-xl border border-purple-500/30">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  onClick={() => { setActiveFilter(filter.id); setPage(1); setPageBlock(0); }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${activeFilter === filter.id ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white" : "bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-cyan-200"}`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quality Filter */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">Quality</label>
            <div className="flex flex-wrap gap-2">
              {qualityOptions.map((quality) => (
                <motion.button
                  key={quality.id}
                  onClick={() => setQualityFilter(quality.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${qualityFilter === quality.id ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white" : "bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-cyan-200"}`}
                >
                  {quality.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">Minimum Rating</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="10"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full accent-amber-500"
              />
              <div className="px-3 py-1 rounded-lg text-sm text-amber-300">{ratingFilter}⭐</div>
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">Release Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700 text-white py-2 px-3 rounded-lg"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-cyan-200 text-sm">Showing {filteredMedia.length} items</div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-200 text-sm">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700 text-white py-2 px-3 rounded-lg"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: limit }).map((_, i) => <SkeletonCard key={i} />)}
          </motion.div>
        ) : (
          <>
            {paginatedMedia.length === 0 ? (
              <div className="text-center py-20 text-cyan-200">No Media Found</div>
            ) : (
              <>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  <AnimatePresence>
                    {paginatedMedia.map((item) => (
                      <motion.div key={item._id} variants={itemVariants} whileHover="hover" className="flex flex-col h-full w-full cursor-pointer" onClick={() => handleCardClick(item)}>
                        <Cards item={item} collection={item.type} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div className="mt-10 flex justify-center">
                    <div className="flex items-center space-x-2 p-2 rounded-xl border border-purple-500/30">
                      {pageBlock > 0 && <button onClick={goToPrevBlock} className="px-4 py-2 rounded-lg bg-purple-800 text-white">Prev</button>}
                      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
                        <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-10 h-10 rounded-lg ${page === pageNum ? "bg-amber-500 text-white" : "bg-purple-900 text-cyan-200"}`}>
                          {pageNum}
                        </button>
                      ))}
                      {(pageBlock + 1) * pagesPerBlock < totalPages && <button onClick={goToNextBlock} className="px-4 py-2 rounded-lg bg-purple-800 text-white">Next</button>}
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
