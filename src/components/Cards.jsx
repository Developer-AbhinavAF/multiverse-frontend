import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Cards({ item, collection }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Map collections to display types
  const collectionTypeMap = {
    movies: "Movie",
    pakistaniDramas: "Pakistani Drama",
    japaneseDramas: "Japanese Drama",
    kDramas: "K-Drama",
    animeMovie: "Anime Movie",
    animeSeries: "Anime Series",
    webSeries: "Web Series",
    cDramas: "C-Drama",
    thaiDramas: "Thai Drama"
  };

  // Helpers
  const badgeStyles = {
    movies: "bg-blue-500 text-white",
    animeMovie: "bg-pink-500 text-white",
    animeSeries: "bg-purple-500 text-white",
    webSeries: "bg-indigo-500 text-white",
    kDramas: "bg-rose-500 text-white",
    cDramas: "bg-emerald-500 text-white",
    thaiDramas: "bg-orange-500 text-white",
    japaneseDramas: "bg-yellow-400 text-black",
    pakistaniDramas: "bg-teal-500 text-white",
  };

  const getQualities = () => {
    if (!item.qualities) return [];
    return Object.keys(item.qualities).filter((q) => item.qualities[q] !== null);
  };

  return (
    <Link to={`/media/${item.slug}?collection=${collection}`} className="h-full block">
      <motion.div
        className="relative group flex h-full flex-col rounded-xl overflow-hidden border border-white/10 bg-gray-900/50"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ height: '420px' }}
        initial={{ y: 0, boxShadow: '0 0 #0000' }}
        whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.35)' }}
        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
      >
        {/* Image section (90%) */}
        <div className="relative flex-[9] min-h-0 w-full overflow-hidden">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/5 to-black/20 flex items-center justify-center">
              <div className="text-5xl text-gray-400">🎬</div>
            </div>
          )}

          {/* Colored collection badge */}
          <motion.div
            className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[11px] font-semibold shadow-sm border border-white/20 ${badgeStyles[collection] || 'bg-slate-600 text-white'}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            {collectionTypeMap[collection] || collection}
          </motion.div>

          {/* Title tooltip on hover */}
          {showTooltip && (
            <motion.div
              className="absolute left-2 right-2 bottom-14 z-10 px-3 py-2 rounded-lg bg-black/80 text-gray-100 text-xs border border-white/10 backdrop-blur-sm shadow-lg"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
            >
              {item.title}
            </motion.div>
          )}
        </div>

        {/* Footer (10%) */}
        <div className="flex-[1] min-h-0 w-full bg-black/30 px-3 py-6 flex flex-col justify-center gap-2">
          <div className="flex-1 min-w-0 flex items-center">
            <h2 className="text-sm sm:text-base font-semibold truncate text-gray-100">
              {item.title}
            </h2>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1.5 text-sm">
              <svg
                className="w-4 h-4 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-200 text-xs sm:text-sm font-medium">{item.rating || 'N/A'}</span>
            </div>
            <div className="flex gap-2">
              {getQualities().slice(0, 2).map((quality) => (
                <span
                  key={quality}
                  className="px-2.5 py-0.5 text-[10px] sm:text-xs rounded-md border border-white/20 bg-white/10 text-gray-100"
                >
                  {quality}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default Cards;