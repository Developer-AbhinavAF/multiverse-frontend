import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Stream = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const collection = queryParams.get('collection') || 'movies';
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [episodePage, setEpisodePage] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const isMobile = window.innerWidth <= 768;
  const episodesPerPage = isMobile ? 10 : 20;

  const endpoints = {
    movies: "https://multiverse-backend.onrender.com/api/movies",
    pcGames: "https://multiverse-backend.onrender.com/api/pcGames",
    androidGames: "https://multiverse-backend.onrender.com/api/androidGames",
    iosGames: "https://multiverse-backend.onrender.com/api/iosGames",
    animeMovie: "https://multiverse-backend.onrender.com/api/animeMovie",
    animeSeries: "https://multiverse-backend.onrender.com/api/animeSeries",
    webSeries: "https://multiverse-backend.onrender.com/api/webSeries",
    pcApps: "https://multiverse-backend.onrender.com/api/pcApps",
    androidApps: "https://multiverse-backend.onrender.com/api/androidApps",
    modApks: "https://multiverse-backend.onrender.com/api/modApks",
    kDramas: "https://multiverse-backend.onrender.com/api/kDramas",
    cDramas: "https://multiverse-backend.onrender.com/api/cDramas",
    thaiDramas: "https://multiverse-backend.onrender.com/api/thaiDramas",
    japaneseDramas: "https://multiverse-backend.onrender.com/api/japaneseDramas",
    pakistaniDramas: "https://multiverse-backend.onrender.com/api/pakistaniDramas",
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = endpoints[collection];
      if (!endpoint) {
        setError("Invalid collection type");
        return;
      }
      
      const response = await axios.get(`${endpoint}/${slug}`);
      if (response.data) {
        setMedia({...response.data, collection, type: response.data.type || collection});
        setLikeCount(response.data.likes || 0);
        
        // Set first episode as default if series
        if (['animeSeries', 'webSeries'].includes(response.data.type)) {
          const firstSeason = response.data.seasons?.[0];
          if (firstSeason && firstSeason.episodes?.[0]) {
            setSelectedEpisode({
              ...firstSeason.episodes[0],
              seasonNumber: firstSeason.seasonNumber
            });
          }
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load media. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const newLikeState = !isLiked;
      setIsLiked(newLikeState);
      setLikeCount(newLikeState ? likeCount + 1 : likeCount - 1);
      
      await axios.post("https://multiverse-backend.onrender.com/api/likes", {
        mediaId: media._id,
        slug: media.slug,
        type: media.type,
        liked: newLikeState
      });
      
    } catch (err) {
      console.error("Like Error:", err);
      setIsLiked(!isLiked);
      setLikeCount(likeCount);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [slug]);

  const handleShare = () => {
    const shareData = {
      title: media.title,
      text: `Watch ${media.title} on Multiverse`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData)
        .catch(err => {
          console.error('Share failed:', err);
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const tempInput = document.createElement('input');
    tempInput.value = window.location.href;
    document.body.appendChild(tempInput);
    tempInput.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('Link copied to clipboard!');
      } else {
        throw new Error('Clipboard copy failed');
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      tempInput.focus();
      tempInput.setSelectionRange(0, tempInput.value.length);
      alert('Select the link and copy manually: ' + window.location.href);
    } finally {
      document.body.removeChild(tempInput);
    }
  };

  const totalEpisodes = media?.seasons?.reduce((total, season) => total + (season.episodes?.length || 0), 0) || 0;
  const totalPages = Math.ceil(totalEpisodes / episodesPerPage);
  const startIndex = (episodePage - 1) * episodesPerPage;
  const endIndex = Math.min(startIndex + episodesPerPage, totalEpisodes);

  const allEpisodes = [];
  media?.seasons?.forEach(season => {
    season.episodes?.forEach(episode => {
      allEpisodes.push({ ...episode, seasonNumber: season.seasonNumber });
    });
  });
  const currentEpisodes = allEpisodes.slice(startIndex, endIndex);

  const getEmbedSource = () => {
    let url = "";
    
    if (selectedEpisode) {
      const quality = selectedEpisode.streamQualities?.[selectedQuality];
      if (quality) {
        url = selectedLanguage === "Hindi" 
          ? quality.hindiUrl || quality.embedUrl
          : quality.englishUrl || quality.embedUrl;
      }
    } else if (media?.qualities) {
      const quality = media.qualities[selectedQuality];
      if (quality) {
        url = selectedLanguage === "Hindi" 
          ? quality.hindiUrl || quality.embedUrl
          : quality.englishUrl || quality.embedUrl;
      }
    }
    
    return url;
  };

  const embedSource = getEmbedSource();

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-8 bg-gradient-to-br from-stone-600 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading streaming details...</p>
        </div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-gradient-to-br from-gray-900/70 to-indigo-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/30">
          <div className="text-amber-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Stream Unavailable</h2>
          <p className="text-rose-200 mb-6">{error || "The media you are looking for does not exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-teal-200 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Details
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-center flex-1 px-4 truncate bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            {media.title}
          </h1>
          <div className="w-10"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {["480p", "720p", "1080p"].map(quality => (
            <button
              key={quality}
              className={`px-4 py-2 rounded-xl shadow-lg ${
                selectedQuality === quality
                  ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white"
                  : "bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-cyan-200 hover:from-purple-800/70 hover:to-pink-800/70"
              }`}
              onClick={() => setSelectedQuality(quality)}
            >
              {quality}
            </button>
          ))}

          {["English", "Hindi"].map(lang => (
            <button
              key={lang}
              className={`px-4 py-2 rounded-xl shadow-lg ${
                selectedLanguage === lang
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                  : "bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-cyan-200 hover:from-purple-800/70 hover:to-pink-800/70"
              }`}
              onClick={() => setSelectedLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>

        <div 
          className="mb-8 bg-black rounded-xl overflow-hidden relative border-2 border-purple-500/30"
        >
          <div className="relative aspect-video">
            {embedSource ? (
              <iframe
                src={embedSource}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
                <div className="text-center p-8">
                  <div className="text-5xl mb-4 text-amber-400">📺</div>
                  <h2 className="text-2xl font-bold mb-4 text-teal-300">Stream Unavailable</h2>
                  <p className="text-rose-200 mb-6">No embed URL configured for this media.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg transition ${
                isLiked 
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700" 
                  : "bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-800/70 hover:to-pink-800/70"
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill={isLiked ? "currentColor" : "none"} 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likeCount}</span>
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-800/70 hover:to-pink-800/70 rounded-xl shadow-lg transition text-cyan-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.8126 12.9126 9 12.482 9 12c0-.482-.114-.9126-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>

            {/* Download Series Button */}
            {['animeSeries', 'webSeries'].includes(media.type) && media.downloadable && (
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl shadow-lg transition text-white"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/media/${media.slug}?collection=${collection}`, {
                    state: { activeTab: "downloads" }
                  });
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Series
              </a>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {media.tags?.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gradient-to-r from-indigo-700/50 to-purple-700/50 text-teal-200 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <h2 className="text-xl font-bold mb-4 text-teal-300">About</h2>
              <p className="text-cyan-100">{media.description || 'No description available.'}</p>
            </div>
          </div>
          
          <div>
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <h2 className="text-xl font-bold mb-4 text-teal-300">Details</h2>
              <div className="space-y-3 text-cyan-100">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="text-white">{media.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Released:</span>
                  <span className="text-white">
                    {media.releaseDate ? new Date(media.releaseDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="text-white">{media.duration || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="text-white">⭐ {media.rating || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Language:</span>
                  <span className="text-white">{selectedLanguage}</span>
                </div>
                {['animeSeries', 'webSeries'].includes(media.type) && (
                  <div className="flex justify-between">
                    <span>Downloadable:</span>
                    <span className="text-white">{media.downloadable ? "Yes" : "No"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {media.seasons && totalEpisodes > 0 && (
          <div
            className="mt-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-teal-300">Episodes</h2>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEpisodePage(prev => Math.max(prev - 1, 1))}
                    disabled={episodePage === 1}
                    className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-800/70 hover:to-pink-800/70 p-2 rounded-full shadow-lg disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  
                  <span className="text-sm text-cyan-200">Page {episodePage} of {totalPages}</span>
                  
                  <button 
                    onClick={() => setEpisodePage(prev => Math.min(prev + 1, totalPages))}
                    disabled={episodePage === totalPages}
                    className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-800/70 hover:to-pink-800/70 p-2 rounded-full shadow-lg disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentEpisodes.map((episode, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-3 hover:from-indigo-800/60 hover:to-purple-800/60 cursor-pointer transition group border border-purple-500/30 ${
                    selectedEpisode?.episodeNumber === episode.episodeNumber && selectedEpisode?.seasonNumber === episode.seasonNumber
                      ? "border-2 border-teal-500 shadow-lg"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedEpisode(episode);
                    setSelectedLanguage("English");
                  }}
                >
                  <div className="aspect-video bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/30 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden border border-purple-500/30">
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-cyan-200">S{episode.seasonNumber}E{episode.episodeNumber}</span>
                  </div>
                  <h3 className="font-medium text-cyan-200 truncate">{episode.title || `Episode ${episode.episodeNumber}`}</h3>
                  <p className="text-rose-200 text-sm truncate">{episode.duration || '24 min'}</p>
                  
                  {/* Download buttons per quality */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(episode.downloadQualities || {}).map(([quality, details]) => (
                      details?.downloadUrl && (
                        <a
                          key={quality}
                          href={details.downloadUrl}
                          className="text-xs bg-gradient-to-r from-teal-700/70 to-emerald-800/70 hover:from-teal-600 hover:to-emerald-700 px-2 py-1 rounded text-cyan-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {quality}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stream;