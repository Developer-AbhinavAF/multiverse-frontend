import React from "react";
import { Link } from "react-router-dom";

function Cards({ item, collection }) {
  // Map collections to display types
  const collectionTypeMap = {
    movies: "Movie"
  };

  // Map collections to colors
  const getTypeColor = (collection) => {
    const colorMap = {
      movies: "bg-red-600"
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
      <div className="w-full bg-[#161626] text-white p-4 rounded-xl border border-[#2D2D42] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
        <div className="relative">
          {item.thumbnail ? (
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-lg flex items-center justify-center">
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

        <h2 className="text-xl font-bold mt-3 line-clamp-1">{item.title}</h2>
        
        <div className="flex gap-2 mt-2 flex-wrap">
          {item.genres?.slice(0, 3).map((genre, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-300 rounded-full text-xs"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1 text-yellow-400">
            <span>⭐</span>
            <span>{item.rating || "N/A"}</span>
          </div>
          
          <div className="flex gap-1">
            {getQualities().map(quality => (
              <span 
                key={quality} 
                className="px-2 py-1 bg-gray-800/50 text-xs rounded"
              >
                {quality}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Cards;