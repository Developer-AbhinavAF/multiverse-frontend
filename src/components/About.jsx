import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaAws, FaDatabase, FaFigma, FaGitAlt, FaDownload, FaHeart, FaStar } from 'react-icons/fa';
import { SiJavascript, SiTypescript, SiMongodb, SiFirebase, SiRedux, SiNextdotjs, SiTailwindcss } from 'react-icons/si';

const AboutUs = () => {
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [review, setReview] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [request, setRequest] = useState({ name: '', email: '', type: 'movie', message: '' });
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(127);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Skill data with icons and colors
  const skills = [
    { id: 1, name: "React", icon: <FaReact />, color: "from-cyan-400 to-blue-600" },
    { id: 2, name: "JavaScript", icon: <SiJavascript />, color: "from-yellow-400 to-amber-600" },
    { id: 3, name: "TypeScript", icon: <SiTypescript />, color: "from-blue-500 to-indigo-700" },
    { id: 4, name: "Node.js", icon: <FaNodeJs />, color: "from-green-500 to-emerald-700" },
    { id: 5, name: "Python", icon: <FaPython />, color: "from-blue-400 to-sky-600" },
    { id: 6, name: "Java", icon: <FaJava />, color: "from-red-500 to-orange-600" },
    { id: 7, name: "MongoDB", icon: <SiMongodb />, color: "from-green-400 to-lime-600" },
    { id: 8, name: "Firebase", icon: <SiFirebase />, color: "from-amber-500 to-yellow-600" },
    { id: 9, name: "Docker", icon: <FaDocker />, color: "from-blue-400 to-cyan-600" },
    { id: 10, name: "AWS", icon: <FaAws />, color: "from-orange-500 to-amber-600" },
    { id: 11, name: "SQL", icon: <FaDatabase />, color: "from-blue-300 to-indigo-500" },
    { id: 12, name: "Redux", icon: <SiRedux />, color: "from-purple-500 to-violet-700" },
    { id: 13, name: "Next.js", icon: <SiNextdotjs />, color: "from-gray-700 to-black" },
    { id: 14, name: "Tailwind CSS", icon: <SiTailwindcss />, color: "from-teal-400 to-cyan-600" },
    { id: 15, name: "Figma", icon: <FaFigma />, color: "from-purple-400 to-fuchsia-600" },
    { id: 16, name: "Git", icon: <FaGitAlt />, color: "from-orange-600 to-red-700" },
  ];

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Tech visionary with 10+ years in software development. Passionate about creating solutions that make a difference.",
      color: "from-blue-400 to-indigo-600"
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "Lead Designer",
      bio: "Creative designer specializing in UI/UX with a focus on user-centered design principles.",
      color: "from-pink-500 to-rose-600"
    },
    {
      id: 3,
      name: "David Chen",
      role: "CTO",
      bio: "Full-stack developer and systems architect with expertise in scalable cloud solutions.",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 4,
      name: "Sarah Williams",
      role: "Marketing Director",
      bio: "Digital marketing expert with a track record of building engaged communities around tech products.",
      color: "from-yellow-400 to-amber-600"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.17, 0.67, 0.83, 0.67] 
      }
    }
  };

  const skillVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.15,
      rotate: [0, 15, -15, 0],
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 300
      }
    }
  };

  // Handle review submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus({ type: 'success', message: 'Review submitted successfully!' });
      setReview({ name: '', email: '', rating: 5, comment: '' });
      
      // Clear status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  };

  // Handle request submission
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus({ type: 'success', message: 'Request submitted successfully!' });
      setRequest({ name: '', email: '', type: 'movie', message: '' });
      
      // Clear status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  };

  // Handle like button
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // Floating particles effect
  useEffect(() => {
    const particles = [];
    const container = document.querySelector('.particles-container');
    
    if (container) {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full';
        particle.style.width = `${Math.random() * 30 + 10}px`;
        particle.style.height = `${Math.random() * 30 + 10}px`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.background = i % 3 === 0 
          ? "radial-gradient(circle, rgba(0,224,255,0.2) 0%, rgba(0,224,255,0) 70%)" 
          : i % 3 === 1 
          ? "radial-gradient(circle, rgba(108,93,211,0.2) 0%, rgba(108,93,211,0) 70%)" 
          : "radial-gradient(circle, rgba(255,94,58,0.2) 0%, rgba(255,94,58,0) 70%)";
        
        container.appendChild(particle);
        particles.push(particle);
      }
    }
    
    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
      {/* Floating particles container */}
      <div className="particles-container fixed inset-0 overflow-hidden pointer-events-none z-0" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Navigation Tabs */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 backdrop-blur-lg rounded-full p-1 flex">
            {['about', 'team', 'skills', 'contact'].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'text-cyan-200 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            About <span className="text-white">Multiverse</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto text-cyan-100 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            We're a passionate team creating digital experiences that transcend boundaries and redefine possibilities.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            <div className="inline-block h-2 w-40 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
          </motion.div>
        </motion.div>

        {/* About Section */}
        {activeTab === 'about' && (
          <motion.div 
            className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 my-16 border border-purple-500/30"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-6 text-cyan-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  Our Journey
                </motion.h2>
                
                <motion.p 
                  className="text-lg mb-6 text-cyan-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  Founded in 2020, Multiverse began as a small team of developers and designers united by a shared vision: to create digital experiences that push boundaries and redefine what's possible.
                </motion.p>
                
                <motion.p 
                  className="text-lg mb-6 text-cyan-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                >
                  Today, we've grown into a diverse collective of creators, thinkers, and innovators who believe technology should be as beautiful as it is functional.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.7 }}
                  className="flex flex-wrap gap-4"
                >
                  <div className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-full text-white font-medium">
                    50+ Projects
                  </div>
                  <div className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-700 rounded-full text-white font-medium">
                    15 Team Members
                  </div>
                  <div className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-700 rounded-full text-white font-medium">
                    1M+ Users
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    className="bg-gradient-to-br from-indigo-800/30 to-purple-800/30 backdrop-blur-sm aspect-square rounded-2xl overflow-hidden border border-purple-500/30"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                      <div className="text-5xl">🌟</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Team Section */}
        {activeTab === 'team' && (
          <motion.div 
            className="my-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-300">Meet Our Team</h2>
              <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                The creative minds behind our innovative solutions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
                  whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                  transition={{ duration: 0.4 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`w-24 h-24 mx-auto rounded-full mb-6 bg-gradient-to-br ${member.color} flex items-center justify-center`}>
                    <div className="text-3xl">👤</div>
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">{member.name}</h3>
                  <p className="text-cyan-300 text-center mb-4">{member.role}</p>
                  <p className="text-cyan-100 text-center">{member.bio}</p>
                  
                  <div className="flex justify-center mt-4">
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full text-sm">
                      Contact
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skills Section */}
        {activeTab === 'skills' && (
          <motion.div 
            className="my-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-300">Our Expertise</h2>
              <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                Technologies we use to build amazing experiences
              </p>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-6">
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  className="flex flex-col items-center"
                  variants={skillVariants}
                  initial="initial"
                  whileHover="hover"
                  onHoverStart={() => setActiveSkill(skill.id)}
                  onHoverEnd={() => setActiveSkill(null)}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${skill.color} shadow-lg text-white`}>
                    <motion.div
                      animate={{ 
                        scale: activeSkill === skill.id ? 1.2 : 1,
                        rotate: activeSkill === skill.id ? [0, 15, -15, 0] : 0
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {skill.icon}
                    </motion.div>
                  </div>
                  <motion.div 
                    className="mt-3 text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: activeSkill === skill.id ? 1 : 0, 
                      height: activeSkill === skill.id ? "auto" : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-medium text-cyan-200 text-sm">{skill.name}</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 bg-gradient-to-r from-cyan-700/30 to-blue-800/30 backdrop-blur-lg rounded-3xl p-8 border border-cyan-500/30">
              <h3 className="text-2xl font-bold mb-6 text-cyan-300 text-center">Our Development Process</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Research", desc: "Deep dive into user needs and market trends" },
                  { title: "Design", desc: "Create intuitive and beautiful interfaces" },
                  { title: "Development", desc: "Build robust and scalable solutions" },
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    className="bg-gradient-to-br from-indigo-800/30 to-purple-800/30 p-6 rounded-2xl border border-purple-500/30"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index }}
                  >
                    <div className="text-cyan-300 text-lg font-bold mb-2">{step.title}</div>
                    <p className="text-cyan-100">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <motion.div 
            className="my-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-300">Get In Touch</h2>
              <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                Have questions or feedback? We'd love to hear from you!
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Review Form */}
              <motion.div 
                className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-cyan-300">Leave a Review</h3>
                
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-cyan-200 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={review.name}
                      onChange={(e) => setReview({...review, name: e.target.value})}
                      className="w-full bg-indigo-900/30 border border-indigo-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-cyan-200 mb-2">Your Email</label>
                    <input
                      type="email"
                      value={review.email}
                      onChange={(e) => setReview({...review, email: e.target.value})}
                      className="w-full bg-indigo-900/30 border border-indigo-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-cyan-200 mb-2">Rating</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReview({...review, rating: star})}
                          className="text-amber-400 mr-1"
                        >
                          <FaStar 
                            size={24} 
                            className={star <= review.rating ? 'text-amber-400' : 'text-gray-500'} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-cyan-200 mb-2">Your Review</label>
                    <textarea
                      value={review.comment}
                      onChange={(e) => setReview({...review, comment: e.target.value})}
                      className="w-full bg-indigo-900/30 border border-indigo-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Share your experience..."
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-xl font-bold shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </motion.button>
                </form>
                
                {submitStatus && (
                  <div className={`mt-4 p-3 rounded-lg text-center ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-900/30 text-green-300' 
                      : 'bg-red-900/30 text-red-300'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}
              </motion.div>
              
              {/* Request Form */}
              <motion.div 
                className="bg-gradient-to-br from-pink-900/50 to-rose-900/50 backdrop-blur-lg rounded-2xl p-8 border border-pink-500/30"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-cyan-300">Request Content</h3>
                
                <form onSubmit={handleRequestSubmit}>
                  <div className="mb-4">
                    <label className="block text-cyan-200 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={request.name}
                      onChange={(e) => setRequest({...request, name: e.target.value})}
                      className="w-full bg-pink-900/30 border border-pink-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-cyan-200 mb-2">Your Email</label>
                    <input
                      type="email"
                      value={request.email}
                      onChange={(e) => setRequest({...request, email: e.target.value})}
                      className="w-full bg-pink-900/30 border border-pink-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-cyan-200 mb-2">Content Type</label>
                    <select
                      value={request.type}
                      onChange={(e) => setRequest({...request, type: e.target.value})}
                      className="w-full bg-pink-900/30 border border-pink-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="movie">Movie</option>
                      <option value="game">Game</option>
                      <option value="series">TV Series</option>
                      <option value="anime">Anime</option>
                      <option value="app">Application</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-cyan-200 mb-2">Your Request</label>
                    <textarea
                      value={request.message}
                      onChange={(e) => setRequest({...request, message: e.target.value})}
                      className="w-full bg-pink-900/30 border border-pink-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="What content would you like us to add?"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white py-3 rounded-xl font-bold shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </motion.button>
                </form>
                
                {/* Download Demo Section */}
                <div className="mt-8 pt-6 border-t border-pink-700/30">
                  <h4 className="text-lg font-bold mb-4 text-cyan-300">Download Demo</h4>
                  <p className="text-cyan-100 mb-4">Try our sample download experience:</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {['480p', '720p', '1080p', '4K'].map((quality, index) => (
                      <motion.button
                        key={index}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700/50 to-indigo-700/50 p-3 rounded-lg border border-purple-500/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <FaDownload className="text-cyan-300" />
                        <span className="text-cyan-200">{quality}</span>
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Like Button with Fix */}
                  <div className="mt-6 flex items-center justify-center">
                    <motion.button
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        isLiked 
                          ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white" 
                          : "bg-gradient-to-r from-purple-700/50 to-indigo-700/50 text-cyan-200"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleLike}
                    >
                      <FaHeart className={isLiked ? "text-red-400" : "text-gray-400"} />
                      <span>{likeCount} Likes</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Mission Statement */}
        <motion.div 
          className="bg-gradient-to-br from-cyan-700/30 to-blue-800/30 backdrop-blur-lg rounded-3xl p-8 md:p-12 my-16 border border-cyan-500/30"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6 text-cyan-300">❝</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Our mission is to create digital experiences that inspire, empower, and transform
            </h2>
            <p className="text-xl text-cyan-100">
              We believe in the power of technology to solve complex problems and create meaningful connections. 
              Every line of code we write and every design we create is driven by our passion for innovation 
              and our commitment to excellence.
            </p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center my-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to start your journey?</h2>
          <motion.button
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-cyan-500/30"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 224, 255, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Join Us Today
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;