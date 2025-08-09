import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Cards({ item, collection }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Map collections to display types
  const collectionTypeMap = {
    movies: "Movie",
    animeMovie: "Anime Movie",
    animeSeries: "Anime Series",
    webSeries: "Web Series",
    kDramas: "K-Drama",
    cDramas: "C-Drama",
    thaiDramas: "Thai Drama",
    japaneseDramas: "Japanese Drama"
  };

  // Map collections to colors
  const getTypeColor = (collection) => {
    const colorMap = {
      movies: "bg-red-600",
      animeMovie: "bg-pink-600",
      animeSeries: "bg-indigo-600",
      webSeries: "bg-teal-600",
      kDramas: "bg-rose-600",
      cDramas: "bg-amber-600",
      thaiDramas: "bg-emerald-600",
      japaneseDramas: "bg-violet-600"
    };
    return colorMap[collection] || "bg-gray-600";
  };

  // Get available qualities
  const getQualities = () => {
    if (!item.qualities) return [];
    return Object.keys(item.qualities).filter(quality => 
      item.qualities[quality] !== null
    );
  };

  return (
    <Link to={`/media/${item.slug}?collection=${collection}`}>
      <motion.div 
        className="w-full bg-[#161626] text-white p-3 rounded-xl border border-[#2D2D42] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
        whileHover={{ scale: 1.03 }}
      >
        <div className="relative aspect-[2/3]">
          {item.thumbnail ? (
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-lg flex items-center justify-center">
              <div className="text-5xl text-gray-500">🎬</div>
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-2">
            <span
              className={`px-2 py-1 text-white text-xs rounded-md ${getTypeColor(collection)}`}
            >
              {collectionTypeMap[collection] || collection}
            </span>
          </div>
        </div>

        <div 
          className="relative mt-3"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <h2 className="text-sm sm:text-base font-bold line-clamp-1">
            {item.title}
          </h2>
          
          {showTooltip && item.title.length > 20 && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-black/80 text-white text-xs rounded-md z-10">
              {item.title}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-2 flex-wrap">
          {item.genres?.slice(0, 2).map((genre, index) => (
            <span 
              key={index} 
              className="px-1 py-0.5 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-300 rounded-full text-xs"
            >
              {genre.substring(0, 12)}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1 text-yellow-400 text-xs sm:text-sm">
            <span>⭐</span>
            <span>{item.rating || "N/A"}</span>
          </div>
          
          <div className="flex gap-1">
            {getQualities().slice(0, 2).map(quality => (
              <span 
                key={quality} 
                className="px-1 py-0.5 bg-gray-800/50 text-[10px] sm:text-xs rounded"
              >
                {quality}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default Cards;