import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Use correct API endpoints and fix useEffect logic
const BASE_URL = "https://multiverse-backend.onrender.com/api";

const sources = [
  { url: `${BASE_URL}/movies`, type: "movie" },
  { url: `${BASE_URL}/webseries`, type: "webSeries" }, // fixed endpoint name
  { url: `${BASE_URL}/anime/movies`, type: "animeMovie" }, // fixed endpoint name
  { url: `${BASE_URL}/anime/series`, type: "animeSeries" }, // fixed endpoint name
];

const LatestUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        const res = await Promise.allSettled(
          sources.map(s => axios.get(s.url, { params: { page: 1, limit: 20 } }))
        );
        const items = res.flatMap((r, i) =>
          r.status === "fulfilled"
            ? (r.value.data.items || r.value.data.results || []).map(it => ({
                ...it,
                type: it.type || sources[i].type,
                slug: it.slug || it._id || it.title?.replace(/\s+/g, '-').toLowerCase(),
                thumbnail: it.thumbnail || it.posterUrl || it.poster,
              }))
            : []
        ).sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt || 0) -
            new Date(a.updatedAt || a.createdAt || 0)
        );
        setUpdates([
          {
            _id: "auto-latest",
            title: "Latest content",
            date: new Date().toISOString(),
            description: "Auto feed from Movies/Series/Anime.",
            mediaItems: items.slice(0, 12),
          },
        ]);
      } catch (err) {
        setError("Failed to fetch updates. Please try again later.");
        console.error("Error fetching updates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-8 bg-gradient-to-br from-stone-600 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading updates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-8 bg-gradient-to-br from-stone-600 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-gradient-to-br from-gray-900/70 to-indigo-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/30">
          <div className="text-amber-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Update Error</h2>
          <p className="text-rose-200 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-600 via-gray-900 to-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Latest Updates
          </h1>
          <p className="text-lg text-cyan-200 max-w-2xl mx-auto">
            Stay informed about the newest additions and platform improvements
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {updates.map((update, index) => (
            <motion.div
              key={update._id}
              className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-purple-500/30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">{update.title}</h2>
                <span className="text-sm text-cyan-200 bg-gradient-to-r from-purple-700/50 to-indigo-700/50 px-3 py-1 rounded-full">
                  {new Date(update.date).toLocaleDateString()}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-cyan-200 mb-4">{update.description}</p>
                {update.link && (
                  <a
                    href={update.link}
                    className="text-cyan-400 hover:text-cyan-300 inline-flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )}
              </div>

              {update.mediaItems && update.mediaItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-amber-300">Featured Content:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {update.mediaItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={`/media/${item.slug}?collection=${item.type}`}
                        className="group"
                      >
                        <motion.div
                          className="bg-gradient-to-br from-indigo-800/30 to-purple-800/30 p-3 rounded-lg border border-indigo-700/50"
                          whileHover={{ scale: 1.03 }}
                        >
                          <div className="aspect-video bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/30 rounded-lg mb-2 flex items-center justify-center">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="text-3xl">🎬</div>
                            )}
                          </div>
                          <h4 className="font-medium text-cyan-200 group-hover:text-cyan-300 truncate">{item.title}</h4>
                          <p className="text-sm text-cyan-400">{item.type}</p>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <motion.button
            className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-8 py-3 rounded-xl font-medium shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Updates
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default LatestUpdates;