// src/App.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [showScrollDown, setShowScrollDown] = useState(true);
  const isMobile = window.innerWidth < 768;
  const navigate = useNavigate();

  // Collections to search
  const collections = [
    "movies",
    "pcGames",
    "androidGames",
    "iosGames",
    "animeMovie",
    "animeSeries",
    "webSeries",
    "pcApps",
    "androidApps",
    "modApks",
  ];

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: isMobile ? 400 : 800,
      once: true,
      easing: "ease-out",
    });

    // Scroll event listener
    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        setShowScrollDown(window.scrollY < 100);
        timeoutId = null;
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch data from MongoDB
  const fetchFiltered = async () => {
    setLoading(true);
    setSearched(true);
    setError(null);

    try {
      // Search all collections in parallel
      const requests = collections.map((collection) =>
        axios.get(`https://multiverse-backend.onrender.com/api/${collection}`, {
          params: { search, limit: 5 },
        })
      );

      const responses = await Promise.all(requests);
      const combinedResults = responses
        .flatMap((response) => response.data?.results || [])
        .slice(0, 8); // Limit to 8 results

      setResults(combinedResults);
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

  const handleResultClick = (item, collection) => {
    navigate(`/media/${item.slug}?collection=${collection}`);
  };

  // Trending items data
  const trendingItems = [
    {
      title: "Elden Ring",
      size: "45.7 GB",
      status: "Gone",
      statusColor: "text-[#00E0FF]",
      icon: "🎮",
    },
    {
      title: "Movies",
      size: "2.5 GB",
      status: "Now",
      statusColor: "text-[#FF5E3A]",
      icon: "🎬",
    },
    {
      title: "Attack on Titan",
      size: "820 MB",
      status: "Arima",
      statusColor: "text-[#6C5DD3]",
      icon: "🧿",
    },
    {
      title: "Spider-Man: No Way Home",
      size: "2.1 GB",
      status: "Move",
      statusColor: "text-[#228DFF]",
      icon: "🕸️",
    },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const float = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="bg-[#0E0E1C] text-white overflow-hidden min-h-screen">
      {/* Animated background particles */}
      {!isMobile && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 30 + 10,
                height: Math.random() * 30 + 10,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background:
                  i % 3 === 0
                    ? "radial-gradient(circle, rgba(0,224,255,0.2) 0%, rgba(0,224,255,0) 70%)"
                    : i % 3 === 1
                    ? "radial-gradient(circle, rgba(108,93,211,0.2) 0%, rgba(108,93,211,0) 70%)"
                    : "radial-gradient(circle, rgba(255,94,58,0.2) 0%, rgba(255,94,58,0) 70%)",
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: isMobile ? 5 : Math.random() * 10 + 10,
                repeat: Infinity,
                delay: isMobile ? 0 : Math.random() * 5,
              }}
            />
          ))}
        </div>
      )}

      {/* HERO SECTION */}
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative z-10"
      >
        {/* Background Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#6C5DD3]/10 blur-3xl rounded-full pointer-events-none z-0"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        />

        <div className="max-w-7xl mx-auto z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-center mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            data-aos="fade-down"
          >
            Welcome to <span className="text-[#00E0FF]">Multiverse</span>
          </motion.h1>

          <motion.p
            className="text-center text-[#A0A0B2] max-w-2xl mx-auto text-lg mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Download your favorite{" "}
            <a href="/search" className="text-[#228DFF]">
              Games
            </a>
            ,{" "}
            <a href="/search" className="text-[#6C5DD3]">
              Anime
            </a>{" "}
            &{" "}
            <a href="/search" className="text-[#FF5E3A]">
              Movies
            </a>{" "}
            from a single futuristic hub.
          </motion.p>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                icon: "🎮",
                title: "Games",
                color: "text-[#228DFF]",
                desc: "Explore PC, Console & Mobile games in one click.",
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
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white/5 p-6 rounded-xl border border-white/10 hover:scale-105 transition backdrop-blur-sm shadow-md"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                data-aos="fade-up"
                data-aos-delay={200 + index * 100}
              >
                {!isMobile && (
                  <motion.div
                    className="text-4xl mb-2"
                    variants={float}
                    animate="float"
                  >
                    {item.icon}
                  </motion.div>
                )}
                {isMobile && <div className="text-4xl mb-2">{item.icon}</div>}
                <h2 className={`text-xl font-semibold mb-1 ${item.color}`}>
                  {item.title}
                </h2>
                <p className="text-[#A0A0B2] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <AnimatePresence>
          {showScrollDown && (
            <motion.div
              className="absolute bottom-10 flex flex-col items-center z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 1 },
              }}
              exit={{ opacity: 0, y: 20 }}
            >
              <span className="mb-2 text-sm text-[#A0A0B2]">Scroll Down</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-6 h-10 rounded-full border-2 border-[#A0A0B2] flex justify-center p-1"
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#00E0FF]"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* OPPENHEIMER SECTION */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Movie Info */}
            <motion.div
              className="bg-[#161626]/50 border border-[#2D2D42] rounded-xl p-6 backdrop-blur-sm"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              data-aos="fade-right"
            >
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
                  <motion.span
                    key={i}
                    className="bg-[#228DFF]/10 text-[#228DFF] px-3 py-1 rounded-full text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Download Box */}
            <motion.div
              className="bg-gradient-to-br from-[#161626] to-[#1a1a2e] border border-[#2D2D42] rounded-xl p-6 shadow-lg shadow-[#6C5DD3]/10"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 }}
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">Download</h3>
              <div className="space-y-4 mb-8">
                {[
                  { label: "Opens", value: "Instant" },
                  { label: "Source", value: "Amazonas" },
                  { label: "Size", value: "3.5 GB" },
                  { label: "Duration", value: "320 min" },
                  { label: "Quality", value: "4K HDR" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-between items-center border-b border-[#2D2D42] pb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-[#A0A0B2]">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="w-full bg-gradient-to-r from-[#00E0FF] to-[#228DFF] hover:from-[#00c8e0] hover:to-[#1a7cda] py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-[#00E0FF]/30"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 20px rgba(0, 224, 255, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Download Now
              </motion.button>

              <div className="mt-4 text-center text-[#A0A0B2] text-sm">
                Secure download • No ads • 100% safe
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Trending Section */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              data-aos="fade-right"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#00E0FF] flex items-center">
                <span className="mr-2">🔥</span> Trending
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trendingItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-[#161626] border border-[#2D2D42] rounded-xl p-5 hover:border-[#6C5DD3] transition-all duration-300 group"
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{item.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 group-hover:text-[#00E0FF] transition-colors">
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
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Search Section */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 }}
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#228DFF] flex items-center">
                <span className="mr-2">🔍</span> Search
              </h2>
              <form onSubmit={handleSearch}>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#161626] border border-[#2D2D42] rounded-xl py-3 px-4 text-white placeholder-[#5E5E7A] focus:outline-none focus:border-[#6C5DD3] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#228DFF] to-[#6C5DD3] hover:from-[#1a7cda] hover:to-[#5a4fc2] py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-[#228DFF]/20"
                >
                  Search
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/10 min-h-[50vh]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-2xl md:text-3xl font-bold mb-8 text-[#FF5E3A]"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            data-aos="fade-up"
          >
            {searched ? "Search Results" : ""}
          </motion.h2>

          {error && (
            <div
              className="text-center py-12 text-[#FF5E3A]"
              data-aos="fade-up"
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
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-aos="fade-up"
            >
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E0FF] mb-4"></div>
              <p className="text-xl">Searching database...</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.length > 0
                ? results.map((item, index) => {
                    // Determine collection for this item
                    const collectionMap = {
                      PCGame: "pcGames",
                      AndroidGame: "androidGames",
                      IOSGame: "iosGames",
                      AnimeMovie: "animeMovie",
                      AnimeSeries: "animeSeries",
                      WebSeries: "webSeries",
                      PCApp: "pcApps",
                      AndroidApp: "androidApps",
                      ModApk: "modApks",
                      Movie: "movies",
                    };

                    const collection = collectionMap[item.type] || "movies";

                    return (
                      <motion.div
                        key={item._id}
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: index * 0.1 }}
                        data-aos="zoom-in"
                        data-aos-delay={index * 50}
                        onClick={() => handleResultClick(item, collection)}
                      >
                        <div className="bg-[#161626] border border-[#2D2D42] rounded-xl p-5 transition-all hover:border-[#6C5DD3] hover:shadow-lg hover:shadow-[#6C5DD3]/20 cursor-pointer">
                          <div className="bg-gray-700 rounded-xl w-full h-48 mb-4 flex items-center justify-center">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <span className="text-6xl">📁</span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg mb-2">
                            {item.title}
                          </h3>
                          <div className="flex justify-between text-sm text-[#A0A0B2] mb-3">
                            <span>{collection}</span>
                            <span>
                              {item.fileSize || item.gameSize || "Unknown"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#00E0FF] text-sm">
                              {item.rating ? `⭐ ${item.rating}` : "No rating"}
                            </span>
                            <button className="bg-[#6C5DD3] hover:bg-[#5a4fc2] px-4 py-1 rounded-lg text-sm transition-colors">
                              View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                : searched &&
                  !loading && (
                    <motion.div
                      className="text-center col-span-full py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      data-aos="fade-up"
                    >
                      <p className="text-2xl text-[#FF5E3A] mb-2">
                        No results found
                      </p>
                      <p className="text-[#A0A0B2]">
                        Try different search terms
                      </p>
                    </motion.div>
                  )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Hero;
