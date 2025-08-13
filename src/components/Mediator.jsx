import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Mediator = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const collection = queryParams.get('collection') || 'movies';
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadOptions, setDownloadOptions] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  // Review/Feedback state
  const [reviewData, setReviewData] = useState({
    userName: "",
    userEmail: "",
    rating: 5,
    comment: ""
  });
  
  // Request state
  const [requestData, setRequestData] = useState({
    name: "",
    email: "",
    requestType: "movie",
    message: ""
  });
  
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fixed collection endpoints
  const endpoints = {
    movies: "https://backend-0nxk.onrender.com/api/movies",
    animeMovie: "https://backend-0nxk.onrender.com/api/animeMovie",
    animeSeries: "https://backend-0nxk.onrender.com/api/animeSeries",
    webSeries: "https://backend-0nxk.onrender.com/api/webSeries",
    kDramas: "https://backend-0nxk.onrender.com/api/kDramas",
    cDramas: "https://backend-0nxk.onrender.com/api/cDramas",
    thaiDramas: "https://backend-0nxk.onrender.com/api/thaiDramas",
    japaneseDramas: "https://backend-0nxk.onrender.com/api/japaneseDramas",
    pakistaniDramas: "https://backend-0nxk.onrender.com/api/pakistaniDramas",
  };

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = endpoints[collection];
      if (!endpoint) {
        setError("Invalid collection type");
        return;
      }
      
      try {
        const response = await axios.get(`${endpoint}/${slug}`);
        if (response.data) {
          setMedia({...response.data, collection});
          
          let options = [];
          // Game download options
          if (['pcGames', 'androidGames', 'iosGames', 'pcApps', 'androidApps', 'modApks'].includes(collection)) {
            if (response.data.downloadLinks) {
              Object.entries(response.data.downloadLinks).forEach(([provider, link]) => {
                options.push({ quality: provider, link });
              });
            }
            if (response.data.torrent) {
              options.push({ quality: "Torrent", link: response.data.torrent });
            }
          } 
          // Movie download options
          else if (['movies', 'animeMovie', 'kDramas', 'cDramas', 'thaiDramas', 'japaneseDramas', 'pakistaniDramas'].includes(collection)) {
            if (response.data.qualities) {
              Object.entries(response.data.qualities).forEach(([quality, details]) => {
                if (details && details.downloadUrl) {
                  options.push({ 
                    quality, 
                    link: details.downloadUrl,
                    fileSize: details.fileSize
                  });
                }
              });
            }
          }
          // Series download options
          else if (['animeSeries', 'webSeries'].includes(collection)) {
            response.data.seasons?.forEach(season => {
              season.episodes?.forEach(episode => {
                if (episode.downloadQualities) {
                  Object.entries(episode.downloadQualities).forEach(([quality, details]) => {
                    if (details && details.downloadUrl) {
                      options.push({
                        quality: `${quality} - S${season.seasonNumber}E${episode.episodeNumber}`,
                        link: details.downloadUrl,
                        fileSize: details.fileSize
                      });
                    }
                  });
                }
              });
            });
          }
          
          setDownloadOptions(options);
          if (options.length > 0) setSelectedQuality(options[0].quality);
          
          // Set initial like count
          setLikeCount(response.data.likes || 0);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Media not found in the specified collection.");
      }
      
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load media. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [slug, collection]);
  
  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleLike = async () => {
    try {
      const newLikeState = !isLiked;
      setIsLiked(newLikeState);
      setLikeCount(prev => newLikeState ? prev + 1 : prev - 1);
      
      await axios.post("https://backend-0nxk.onrender.com/api/likes", {
        slug,
        mediaId: media?._id,
        type: media?.type,
        liked: newLikeState
      });
      
    } catch (err) {
      console.error("Like failed:", err);
      setIsLiked(!isLiked);
      setLikeCount(prev => prev + (newLikeState ? -1 : 1));
    }
  };

  const handleShare = () => {
    const shareData = {
      title: media?.title || "Media on Multiverse",
      text: `Check out this media on Multiverse: ${media?.title}`,
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
  
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const submitReview = async () => {
    try {
      setSubmitStatus({ type: 'loading', message: 'Submitting review...' });
      
      await axios.post(`https://backend-0nxk.onrender.com/api/${collection}/${slug}/review`, reviewData);
      
      setSubmitStatus({ type: 'success', message: 'Review submitted successfully!' });
      setReviewData({
        userName: "",
        userEmail: "",
        rating: 5,
        comment: ""
      });
      
      // Refresh media to show new review
      fetchMedia();
      
    } catch (err) {
      console.error("Review submission failed:", err);
      setSubmitStatus({ type: 'error', message: 'Failed to submit review. Please try again.' });
    }
  };
  
  const submitRequest = async () => {
    try {
      setSubmitStatus({ type: 'loading', message: 'Submitting request...' });
      
      await axios.post(`https://backend-0nxk.onrender.com/api/${collection}/request`, requestData);
      
      setSubmitStatus({ type: 'success', message: 'Request submitted successfully!' });
      setRequestData({
        name: "",
        email: "",
        requestType: "movie",
        message: ""
      });
      
    } catch (err) {
      console.error("Request submission failed:", err);
      setSubmitStatus({ type: 'error', message: 'Failed to submit request. Please try again.' });
    }
  };
  
  const trackDownload = async (quality) => {
    try {
      await axios.post(`https://backend-0nxk.onrender.com/api/${collection}/${slug}/download`, {
        quality
      });
    } catch (err) {
      console.error("Download tracking failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-8 bg-gradient-to-br from-stone-600 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading media details...</p>
        </div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-8 bg-gradient-to-br from-[#0f0c29] via-[#1e1b52] to-[#2d2a80] flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-gradient-to-br from-gray-900/50 to-indigo-900/30 backdrop-blur-lg rounded-2xl">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Media Unavailable</h2>
          <p className="text-amber-200 mb-6">{error || "The media you are looking for does not exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isDownloadable = downloadOptions.length > 0 || 
    (['animeSeries', 'webSeries'].includes(media.type) && media.downloadable);
  const isSeries = media.type === 'animeSeries' || media.type === 'webSeries';
  const selectedDownload = downloadOptions.find(opt => opt.quality === selectedQuality);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-8 bg-gradient-to-br from-stone-600 via-gray-900 to-black text-white">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cyan-300 hover:text-white mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Library
        </button>

        <div 
          className="flex flex-col md:flex-row gap-8 mb-8"
        >
          <div className="flex-shrink-0 mx-auto md:mx-0">
            {media.thumbnail ? (
              <img 
                src={media.thumbnail} 
                alt={media.title} 
                className="w-56 h-80 object-cover rounded-2xl shadow-lg border-2 border-indigo-500/30"
              />
            ) : (
              <div className="bg-gradient-to-r from-cyan-800/30 to-blue-800/30 w-56 h-80 rounded-2xl flex items-center justify-center border-2 border-indigo-500/30">
                <div className="text-5xl text-teal-300">{media.title.charAt(0)}</div>
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  {media.title}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  {media.releaseDate && (
                    <span className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-cyan-300 px-3 py-1 rounded-full text-sm">
                      {new Date(media.releaseDate).getFullYear()}
                    </span>
                  )}
                  {media.rating && (
                    <span className="flex items-center gap-1 bg-gradient-to-r from-amber-600/30 to-yellow-600/30 text-amber-300 px-3 py-1 rounded-full text-sm">
                      <span>⭐</span> {media.rating}/10
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`bg-gradient-to-r from-indigo-900/30 to-purple-900/30 hover:from-indigo-800/50 hover:to-purple-800/50 p-2 rounded-full ${isLiked ? 'text-red-500' : 'text-cyan-300'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 hover:from-indigo-800/50 hover:to-purple-800/50 p-2 rounded-full text-cyan-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.8 12.9 9 12.482 9 12c0-.482-.114-.9-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </motion.button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {media.tags?.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-cyan-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <p className="text-cyan-200 line-clamp-3 mb-6">
                {media.description || "No description available."}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {isDownloadable && (
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href={selectedDownload?.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackDownload(selectedQuality)}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 px-4 py-2 rounded-xl text-white font-medium transition flex items-center gap-2 text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </motion.a>
              )}

              {/* STREAMING BUTTON FOR ALL MEDIA TYPES */}
              {(['movies', 'animeMovie', 'animeSeries', 'webSeries'].includes(collection)) && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/stream/${media.slug}?collection=${collection}`)}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-4 py-2 rounded-xl text-white font-medium transition flex items-center gap-2 text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Stream Online
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile-friendly tabs with horizontal scrolling */}
        <div className="flex overflow-x-auto pb-2 mb-6 hide-scrollbar">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "info"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-indigo-300 hover:text-white"
            }`}
          >
            Information
          </motion.button>
          {downloadOptions.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("downloads")}
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === "downloads"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-indigo-300 hover:text-white"
            }`}
            >
              Download Options
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "reviews"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-indigo-300 hover:text-white"
            }`}
          >
            Reviews
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("request")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "request"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-indigo-300 hover:text-white"
            }`}
          >
            Request Content
          </motion.button>
        </div>
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        <div>
          {activeTab === "info" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm p-5 rounded-2xl">
                <h2 className="text-xl font-bold mb-4 text-cyan-300">Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-indigo-300 text-sm uppercase mb-1">Type</h3>
                    <p className="text-white">{media.type || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-indigo-300 text-sm uppercase mb-1">Release Date</h3>
                    <p className="text-white">
                      {media.releaseDate ? new Date(media.releaseDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-indigo-300 text-sm uppercase mb-1">Languages</h3>
                    <p className="text-white">
                      {media.language || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-indigo-300 text-sm uppercase mb-1">Size</h3>
                    <p className="text-white">{media.fileSize || media.gameSize || "N/A"}</p>
                  </div>
                  {['animeSeries', 'webSeries'].includes(media.type) && (
                    <div>
                      <h3 className="text-indigo-300 text-sm uppercase mb-1">Downloadable</h3>
                      <p className="text-white">{media.downloadable ? "Yes" : "No"}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm p-5 rounded-2xl">
                <h2 className="text-xl font-bold mb-4 text-cyan-300">Description</h2>
                <p className="text-cyan-200 leading-relaxed">
                  {media.description || "No description available."}
                </p>
              </div>
            </div>
          )}
          
          {activeTab === "downloads" && downloadOptions.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm p-5 rounded-2xl">
              <h2 className="text-xl font-bold mb-4 text-cyan-300">Download Options</h2>
              
              {/* Movie/Game downloads */}
              {media.type !== 'animeSeries' && media.type !== 'webSeries' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {downloadOptions.map((option) => (
                    <div 
                      key={option.quality}
                      className={`border rounded-xl p-4 transition-all cursor-pointer bg-gradient-to-br from-indigo-900/20 to-purple-900/20 ${
                        selectedQuality === option.quality
                          ? "border-cyan-500 bg-cyan-900/20"
                          : "border-indigo-700 hover:border-cyan-500"
                      }`}
                      onClick={() => setSelectedQuality(option.quality)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">{option.quality}</span>
                        {selectedQuality === option.quality && (
                          <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">Selected</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <a
                          href={option.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackDownload(option.quality)}
                          className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
                        >
                          Download Now
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                        <span className="text-xs text-cyan-300">{option.fileSize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Series episode downloads */}
              {(media.type === 'animeSeries' || media.type === 'webSeries') && (
                <div className="space-y-6">
                  {media.seasons?.map((season, seasonIndex) => (
                    <div key={seasonIndex} className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-4 rounded-xl">
                      <h3 className="text-lg font-bold mb-3 text-cyan-300">Season {season.seasonNumber}</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {season.episodes?.map((episode, episodeIndex) => (
                          <div 
                            key={episodeIndex}
                            className="border border-indigo-700 rounded-lg p-4 bg-gradient-to-br from-indigo-900/10 to-purple-900/10"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">
                                Episode {episode.episodeNumber}: {episode.title}
                              </h4>
                              <span className="text-sm text-amber-300">
                                {episode.duration || '24 min'}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              {Object.entries(episode.downloadQualities || {}).map(([quality, details]) => (
                                details && details.downloadUrl && (
                                  <a
                                    key={quality}
                                    href={details.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex justify-between items-center bg-gradient-to-br from-indigo-900/20 to-purple-900/20 hover:from-indigo-800/30 hover:to-purple-800/30 p-2 rounded text-sm"
                                  >
                                    <span>{quality}</span>
                                    <span className="text-cyan-400">
                                      {details.fileSize || 'Download'}
                                    </span>
                                  </a>
                                )
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === "reviews" && (
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm p-5 rounded-2xl">
              <h2 className="text-xl font-bold mb-4 text-cyan-300">Reviews & Feedback</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-amber-300">Submit Your Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-200 mb-2">Your Name</label>
                    <input
                      type="text"
                      name="userName"
                      value={reviewData.userName}
                      onChange={handleReviewChange}
                      className="w-full bg-indigo-900/30 border border-indigo-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 mb-2">Your Email</label>
                    <input
                      type="email"
                      name="userEmail"
                      value={reviewData.userEmail}
                      onChange={handleReviewChange}
                      className="w-full bg-indigo-900/30 border border-indigo-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 mb-2">Rating</label>
                    <select
                      name="rating"
                      value={reviewData.rating}
                      onChange={handleReviewChange}
                      className="w-full bg-indigo-900/30 border border-indigo-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {[5, 4, 3, 2, 1].map(rating => (
                        <option key={rating} value={rating}>
                          {rating} ★
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-cyan-200 mb-2">Your Review</label>
                    <textarea
                      name="comment"
                      value={reviewData.comment}
                      onChange={handleReviewChange}
                      className="w-full bg-indigo-900/30 border border-indigo-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Share your experience..."
                      rows="3"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="mt-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={submitReview}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-xl text-white font-medium"
                  >
                    Submit Review
                  </motion.button>
                </div>
                
                {submitStatus && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    submitStatus.type === 'success' ? 'bg-green-900/30 text-green-300' : 
                    submitStatus.type === 'error' ? 'bg-red-900/30 text-red-300' : 
                    'bg-amber-900/30 text-amber-300'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-amber-300">User Reviews</h3>
                {media.reviews && media.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {media.reviews.map((review, index) => (
                      <div key={index} className="border border-indigo-700 rounded-xl p-4 bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-cyan-300">{review.userName}</h4>
                            <p className="text-sm text-indigo-300">{review.userEmail}</p>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? 'text-amber-400' : 'text-gray-500'}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-cyan-200 mt-2">{review.comment}</p>
                        <p className="text-sm text-indigo-400 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-cyan-300 text-center py-6">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === "request" && (
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm p-5 rounded-2xl">
              <h2 className="text-xl font-bold mb-4 text-cyan-300">Request Content</h2>
              <p className="text-cyan-200 mb-6">
                Can't find what you're looking for? Request it here and we'll add it to our collection!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-cyan-200 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={requestData.name}
                    onChange={handleRequestChange}
                    className="w-full bg-indigo-900/30 border border-indigo-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-cyan-200 mb-2">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={requestData.email}
                    onChange={handleRequestChange}
                    className="w-full bg-indigo-900/30 border border-indigo-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-cyan-200 mb-2">Content Type</label>
                  <select
                    name="requestType"
                    value={requestData.requestType}
                    onChange={handleRequestChange}
                    className="w-full bg-indigo-900/30 border border-indigo-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="movie">Movie</option>
                    <option value="game">Game</option>
                    <option value="series">TV Series</option>
                    <option value="anime">Anime</option>
                    <option value="app">Application</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-cyan-200 mb-2">Your Request</label>
                  <textarea
                    name="message"
                    value={requestData.message}
                    onChange={handleRequestChange}
                    className="w-full bg-indigo-900/30 border border-indigo-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="What content would you like us to add?"
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="mt-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={submitRequest}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-6 py-3 rounded-xl text-white font-medium"
                >
                  Submit Request
                </motion.button>
              </div>
              
              {submitStatus && (
                <div className={`mt-4 p-3 rounded-lg ${
                  submitStatus.type === 'success' ? 'bg-green-900/30 text-green-300' : 
                  submitStatus.type === 'error' ? 'bg-red-900/30 text-red-300' : 
                  'bg-amber-900/30 text-amber-300'
                }`}>
                  {submitStatus.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mediator;