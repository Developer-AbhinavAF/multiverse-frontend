import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Cards from "./Cards";
import { SkeletonCard } from "./Skeletons";

const Hero = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const isMobile = window.innerWidth < 768;
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const searchSectionRef = useRef(null);

  // Collections to search (must match backend routes)
  const collections = [
    "movies",
    "animeMovie",
    "animeSeries",
    "webSeries",
    "kDramas",
    "cDramas",
    "thaiDramas",
    "japaneseDramas",

  ];

  // Sync with /search route and ?q= param
  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      const q = params.get("q") || "";
      if (q) {
        setSearch(q);
        fetchFiltered(q);
      } else {
        setSearched(false);
        setResults([]);
      }
      // Scroll to search section and focus input
      setTimeout(() => {
        searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [location.pathname, location.search]);

  // Fetch data from API
  const fetchFiltered = async (term = search) => {
    setLoading(true);
    setSearched(true);
    setError(null);

    try {
      // Search all collections in parallel and allow partial failures
      const requests = collections.map((collection) => ({ collection, url: `https://backend-0nxk.onrender.com/api/${collection}` }));
      const settled = await Promise.allSettled(
        requests.map(({ url }) =>
          axios.get(url, { params: { search: term, limit: 5 } })
        )
      );

      // Attach originating collection to each result for correct linking
      const combinedResults = settled.flatMap((res, idx) => {
        if (res.status !== "fulfilled") return [];
        const items = res.value?.data?.results || [];
        const collection = requests[idx].collection;
        return items.map((it) => ({
          ...it,
          collection,
          slug: it.slug || it._id || (it.title ? it.title.replace(/\s+/g, "-").toLowerCase() : undefined),
          thumbnail: it.thumbnail || it.posterUrl || it.poster || it.image,
        }));
      });

      setResults(combinedResults.slice(0, 8)); // Limit to 8 results
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch data. Please try again later.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      fetchFiltered();
    }
  };

  const handleResultClick = (item) => {
    const col = item.collection || "movies";
    navigate(`/media/${item.slug}?collection=${col}`);
  };

  // Trending items data
  const trendingItems = [
    { title: "Elden Ring", size: "45.7 GB", status: "Gone", statusColor: "text-[#00E0FF]", icon: "🎮" },
    { title: "Movies", size: "2.5 GB", status: "Now", statusColor: "text-[#FF5E3A]", icon: "🎬" },
    { title: "Attack on Titan", size: "820 MB", status: "Arima", statusColor: "text-[#6C5DD3]", icon: "🧿" },
    { title: "Spider-Man: No Way Home", size: "2.1 GB", status: "Move", statusColor: "text-[#228DFF]", icon: "🕸️" },
  ];

  // No animation variants

  return (
    <div className="text-white overflow-hidden min-h-screen">

      {/* HERO SECTION */}
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative z-10"
      >
        {/* Removed background glow */}

        <div className="max-w-7xl mx-auto z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 leading-tight">
            Welcome to <span className="text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text">SkyVeil</span>
          </h1>

          <p className="text-center text-[#A0A0B2] max-w-2xl mx-auto text-lg mb-10">
            Download your favorite <a href="/search" className="text-[#228DFF]">WebSeries</a>
            , <a href="/search" className="text-[#6C5DD3]">Anime</a>
            , <a href="/search" className="text-[#009e30]">Drama's</a> &{" "}
            <a href="/search" className="text-[#FF5E3A]">Movies</a> from a single
            futuristic hub.
          </p>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
            {[
              {
                icon: "📼",
                title: "Web Series",
                color: "text-[#228DFF]",
                desc: "Stream & Download Latest web series in HD qualities.",
              },
              {
                icon: "🎬",
                title: "Movies",
                color: "text-[#FF5E3A]",
                desc: "Latest HD, 4K & classic movies across genres.",
              },
              {
                icon: "🧿",
                title: "Anime",
                color: "text-[#6C5DD3]",
                desc: "From Naruto to JJK, stream or download top anime.",
              },
              {
                icon: "🧿",
                title: "Drama's",
                color: "text-[#C92A9D]",
                desc: "Stream & Download Latest Drama's in HD quality.",
              },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => navigate('/search')}
                className="p-6 rounded-xl bg-white/5 border border-white/10 text-left cursor-pointer hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-label={`Go to search: ${item.title}`}
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <h2 className={`text-xl font-semibold mb-1 ${item.color}`}>
                  {item.title}
                </h2>
                <p className="text-[#A0A0B2] text-sm">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Down Indicator removed */}
      </section>

      {/* OPPENHEIMER SECTION */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Movie Info */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Oppenheimer
              </h2>
              <p className="text-[#A0A0B2] mb-3">Biography, Drama, History</p>
              <div className="flex space-x-1 text-2xl text-yellow-400 mb-6">
                {"★".repeat(5)}
              </div>
              <p className="text-[#C0C0D0] mb-4">
                The story of American scientist J. Robert Oppenheimer and his
                role in the development of the atomic bomb.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {[
                  "Christopher Nolan",
                  "Cillian Murphy",
                  "Emily Blunt",
                  "Matt Damon",
                  "Rated R",
                ].map((tag, i) => (
                  <span key={i} className="bg-[#228DFF]/10 text-[#228DFF] px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Download Box */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-2xl font-bold mb-6 text-center">Download</h3>
              <div className="space-y-4 mb-8">
                {[
                  { label: "Opens", value: "Instant" },
                  { label: "Source", value: "Amazonas" },
                  { label: "Size", value: "3.5 GB" },
                  { label: "Duration", value: "320 min" },
                  { label: "Quality", value: "4K HDR" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-[#A0A0B2]">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-white/5 border border-white/10 py-4 rounded-xl font-bold text-lg">
                Download Now
              </button>

              <div className="mt-4 text-center text-[#A0A0B2] text-sm">
                Secure download • No ads • 100% safe
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Trending Section */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-neutral-100 flex items-center">
                <span className="mr-2">🔥</span> Trending
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trendingItems.map((item, index) => (
                  <div key={index} className="rounded-xl p-5 bg-white/5 border border-white/10 group">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{item.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 group-hover:text-white transition-colors">
                          {item.title}
                        </h3>

                        <div className="flex justify-between items-end">
                          <span className="text-[#A0A0B2] text-sm">
                            {item.size}
                          </span>
                          <span className={`${item.statusColor} font-medium`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Section */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-neutral-100 flex items-center">
                <span className="mr-2">🔍</span> Search
              </h2>
              <form onSubmit={handleSearch}>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    ref={searchInputRef}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-neutral-400 focus:outline-none focus:border-white/30"
                  />

                </div>

                <button
                  type="submit"
                  className="w-full bg-white/5 border border-white/10 py-3 rounded-xl font-bold"
                >
                  Search
                </button>

              </form>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section ref={searchSectionRef} className="py-16 px-4 sm:px-6 border-t border-white/10 min-h-[50vh]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[#FF5E3A]">
            {searched ? "Search Results" : ""}
          </h2>

          {error && (
            <div
              className="text-center py-12 text-[#FF5E3A]"
            >
              <p className="text-xl mb-2">{error}</p>
              <button
                onClick={fetchFiltered}
                className="mt-4 bg-[#6C5DD3] hover:bg-[#5a4fc2] px-6 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.length > 0
                ? results.map((item) => (
                    <Cards key={`${item.collection}-${item.slug || item._id}`} item={item} collection={item.collection} />
                  ))
                : searched && !loading && (
                    <div className="text-center col-span-full py-12">
                      <p className="text-2xl text-[#FF5E3A] mb-2">
                        No results found
                      </p>
                      <p className="text-[#A0A0B2]">
                        Try different search terms
                      </p>
                    </div>
                  )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Hero;