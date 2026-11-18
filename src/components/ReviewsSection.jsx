import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Star, 
  CheckCircle, 
  ShieldCheck, 
  ThumbsUp, 
  Filter, 
  PlusCircle, 
  Sparkles, 
  Trophy, 
  Zap, 
  GraduationCap, 
  Coins, 
  X, 
  Flame,
  Check,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CUSTOMER_REVIEWS } from '../data/mockData';
import { getAssetUrl } from '../utils/assets';

export default function ReviewsSection() {
  const { showToast } = useApp();
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Review background video autoplay prevented:', err);
        });
      }
    }
  }, []);

  // Reviews state with initial mock data plus interactive upvotes & verification tags
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      author: 'Marcus K.',
      rating: 5,
      platform: 'PS5',
      category: 'champions',
      service: 'UT Champions Rank 1',
      verified: true,
      date: '2 hours ago',
      comment: 'Unbelievable skill. Booster went 20-0 with my 87-rated squad without changing my tactics. Stream was 1080p and super polite. Received Mbappe in rewards!',
      booster: 'Kaiser_EA (Top 64 Global)',
      upvotes: 24,
      isLiked: false,
      proofTags: ['100% Residential VPN', '1080p Streamed', '15-0 Undefeated'],
    },
    {
      id: 'rev-2',
      author: 'Liam D.',
      rating: 5,
      platform: 'PC',
      category: 'rivals',
      service: 'Division Rivals Elite Promotion',
      verified: true,
      date: 'Yesterday',
      comment: 'Pushed me from Div 3 all the way to Elite in under 4 hours. Used regional VPN in Germany matching my location. Completely safe!',
      booster: 'Vortex_FUT',
      upvotes: 18,
      isLiked: false,
      proofTags: ['German VPN Match', '2.5hr Speed Run', 'Elite Division'],
    },
    {
      id: 'rev-3',
      author: 'Stefan B.',
      rating: 5,
      platform: 'Xbox',
      category: 'champions',
      service: 'Weekend Warrior Master Bundle',
      verified: true,
      date: '3 days ago',
      comment: 'Best boosting platform by a mile. Got Rank 2 in Champions and weekly 7 wins completed on Friday evening. 24/7 live support was instant.',
      booster: 'Apex_Shooter',
      upvotes: 31,
      isLiked: false,
      proofTags: ['Express Delivery', 'Live WhatsApp Updates', 'Rank 2 Claimed'],
    },
    {
      id: 'rev-4',
      author: 'Julien M.',
      rating: 5,
      platform: 'PS5',
      category: 'coins',
      service: '1,500,000 FC Coins Comfort Trade',
      verified: true,
      date: '4 days ago',
      comment: 'Coins transferred safely within 25 minutes. 5% EA tax was fully covered as promised. Customer service answered on WhatsApp in 30 seconds.',
      booster: 'Finance_FUT',
      upvotes: 14,
      isLiked: false,
      proofTags: ['5% EA Tax Covered', 'Instant Player Auction', 'Zero Ban Risk'],
    },
    {
      id: 'rev-5',
      author: 'Harvey R.',
      rating: 5,
      platform: 'PC',
      category: 'coaching',
      service: '1-on-1 Pro Coaching (2 Hours)',
      verified: true,
      date: '1 week ago',
      comment: 'Coaching changed how I defend completely. Learned right-stick switching and controlled sprint properly. Went from 9 wins to 14 wins this weekend!',
      booster: 'Coach_Maestro',
      upvotes: 42,
      isLiked: false,
      proofTags: ['Discord Screen Share', 'Meta 4-3-2-1 Tactics', '+5 Wins Upgrade'],
    },
  ]);

  // Filter state: 'all' | 'champions' | 'rivals' | 'coaching' | 'coins'
  const [activeCategory, setActiveCategory] = useState('all');

  // New Review Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newPlatform, setNewPlatform] = useState('PS5');
  const [newCategory, setNewCategory] = useState('champions');
  const [newComment, setNewComment] = useState('');

  // Handle upvote toggle
  const handleUpvote = (id) => {
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updatedLiked = !r.isLiked;
          if (updatedLiked) {
            showToast('Thanks for marking this review helpful! 👍', 'success');
          }
          return {
            ...r,
            isLiked: updatedLiked,
            upvotes: updatedLiked ? r.upvotes + 1 : r.upvotes - 1,
          };
        }
        return r;
      })
    );
  };

  // Handle submit review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) {
      showToast('Please provide your name and review feedback.', 'info');
      return;
    }

    const categoryNames = {
      champions: 'UT Champions Finals Boost',
      rivals: 'Division Rivals Promotion',
      coaching: '1-on-1 Pro Coaching',
      coins: 'FC Coins Transfer',
    };

    const newRev = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      rating: newRating,
      platform: newPlatform,
      category: newCategory,
      service: categoryNames[newCategory] || 'Custom Boost Order',
      verified: true,
      date: 'Just now',
      comment: newComment.trim(),
      booster: 'Pro Roster Team',
      upvotes: 1,
      isLiked: true,
      proofTags: ['Customer Verified', 'Active Order Match', '100% Safe VPN'],
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsModalOpen(false);
    setNewAuthor('');
    setNewComment('');
    setNewRating(5);
    showToast('Your verified review was published successfully! ⭐', 'success');
  };

  // Filtered reviews
  const filteredReviews = activeCategory === 'all'
    ? reviewsList
    : reviewsList.filter((r) => r.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Reviews', icon: Sparkles, count: reviewsList.length },
    { id: 'champions', label: 'UT Champions', icon: Trophy, count: reviewsList.filter(r => r.category === 'champions').length },
    { id: 'rivals', label: 'Division Rivals', icon: Zap, count: reviewsList.filter(r => r.category === 'rivals').length },
    { id: 'coaching', label: 'Pro Coaching', icon: GraduationCap, count: reviewsList.filter(r => r.category === 'coaching').length },
    { id: 'coins', label: 'FC Coins', icon: Coins, count: reviewsList.filter(r => r.category === 'coins').length },
  ];

  return (
    <section id="reviews" className="relative w-full py-18 sm:py-24 bg-[#0B0D13] select-none font-sans overflow-hidden" ref={sectionRef}>
      
      {/* Dynamic Animated Football Stadium Video & Atmosphere Behind the Cards */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center scale-105 filter blur-[1px] opacity-65 brightness-95 contrast-110 transition-all duration-700"
        >
          <source src={getAssetUrl('videos/verified-football-action.mp4')} type="video/mp4" />
          <source src={getAssetUrl('videos/real-soccer-pitch.mp4')} type="video/mp4" />
          <source src={getAssetUrl('videos/football-match.mp4')} type="video/mp4" />
        </video>

        {/* Dual-Tone Vignette: Allows vibrant stadium movement to shine through translucent cards */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D13] via-[#0B0D13]/45 to-[#0B0D13]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D13]/50 via-transparent to-[#0B0D13]/50" />

        {/* Stadium Floodlight Glows */}
        <motion.div
          animate={{
            x: [-40, 40, -40],
            y: [-20, 30, -20],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 left-1/4 w-[500px] h-[380px] bg-[#00F59B]/15 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            x: [30, -30, 30],
            y: [20, -20, 20],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-20 right-1/4 w-[550px] h-[400px] bg-[#FFB800]/15 rounded-full blur-[150px]"
        />

        {/* Floating Confetti / Stadium Victory Sparks Drifting Behind Cards */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 2 === 0 ? '4px' : '5px',
              height: i % 2 === 0 ? '4px' : '5px',
              left: `${8 + i * 9.5}%`,
              top: `${15 + (i % 5) * 18}%`,
              background: i % 3 === 0 ? '#00F59B' : i % 3 === 1 ? '#FFB800' : '#00D6FF',
              boxShadow: `0 0 10px ${i % 3 === 0 ? '#00F59B' : '#FFB800'}`,
            }}
            animate={{
              y: [-15, -130],
              x: [0, (i % 2 === 0 ? 25 : -25)],
              opacity: [0, 0.9, 0],
              scale: [0.5, 1.3, 0.3],
            }}
            transition={{
              duration: 5 + (i % 4) * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8 sm:space-y-10">
        
        {/* Header with Trust Summary & "Write a Review" Action */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-6 border-b border-[#262B3D]/80 gap-6">
          <motion.div
            className="space-y-2.5"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#141824] border border-[#00F59B]/40 text-[#00F59B] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
              <span>REAL-TIME COMMUNITY FEEDBACK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Verified Customer Reviews
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
              Thousands of competitive Ultimate Team players trust us every weekend. Browse verified match reports, rewards, and feedback below.
            </p>
          </motion.div>

          {/* Action Row: Trust Score + Write A Review Button */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Trust Score Badge */}
            <motion.div
              className="flex items-center space-x-3.5 bg-[#141824]/90 backdrop-blur-xl border border-[#262B3D] px-4 py-2.5 rounded-2xl shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#00F59B] text-[#00F59B]" />
                ))}
              </div>
              <div className="border-l border-[#262B3D] pl-3 text-left leading-tight">
                <div className="text-xs sm:text-sm font-black text-white">4.9 / 5.0 Rating</div>
                <div className="text-[10px] text-gray-400">2,450+ verified boosts</div>
              </div>
            </motion.div>

            {/* Leave Review Button */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 rounded-2xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all shadow-lg shadow-[#00F59B]/20 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Leave A Review</span>
            </motion.button>
          </div>
        </div>

        {/* Unique Feature: Live Trust & Verification Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#141824]/60 backdrop-blur-md border border-[#262B3D] p-3.5 rounded-2xl text-center"
        >
          <div className="border-r border-[#262B3D]/80 last:border-none p-1">
            <span className="text-base sm:text-lg font-black text-[#00F59B] block">99.8%</span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold">5-Star Satisfaction</span>
          </div>
          <div className="border-r border-[#262B3D]/80 last:border-none p-1">
            <span className="text-base sm:text-lg font-black text-white block">15-30m</span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Average Queue Match</span>
          </div>
          <div className="border-r border-[#262B3D]/80 last:border-none p-1">
            <span className="text-base sm:text-lg font-black text-[#FFB800] block">0 Bans</span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold">100% Residential VPN</span>
          </div>
          <div className="p-1">
            <span className="text-base sm:text-lg font-black text-[#00D6FF] block">Top 200</span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Verified Pro Boosters</span>
          </div>
        </motion.div>

        {/* Unique Feature: Interactive Category Filter Tabs */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#00F59B] text-[#0B0D13] shadow-md shadow-[#00F59B]/20 scale-[1.02]'
                      : 'bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0B0D13]' : 'text-[#00F59B]'}`} />
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-[#0B0D13]/20 text-[#0B0D13]' : 'bg-[#0B0D13] text-gray-400'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-1.5 text-xs text-gray-400 shrink-0">
            <CheckCircle className="w-3.5 h-3.5 text-[#00F59B]" />
            <span>Showing verified buyer receipts</span>
          </div>
        </div>

        {/* Reviews Grid with Interactive Helpful Upvotes & Proof Tags */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {filteredReviews.map((review) => (
              <motion.div
                layout
                key={review.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[#141824]/75 backdrop-blur-xl border border-[#262B3D]/90 hover:border-[#00F59B]/60 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-all shadow-2xl group hover:shadow-2xl hover:shadow-[#00F59B]/15 hover:scale-[1.01]"
              >
                <div className="space-y-3.5">
                  
                  {/* Top Row: Stars + Platform Pill + Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#00F59B] text-[#00F59B]" />
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#0B0D13] border border-[#262B3D] text-[#00F59B] px-2 py-0.5 rounded-lg shadow-sm">
                        {review.platform}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">{review.date}</span>
                    </div>
                  </div>

                  {/* Service Headline */}
                  <div className="text-sm font-black text-white group-hover:text-[#00F59B] transition-colors leading-snug">
                    {review.service}
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    "{review.comment}"
                  </p>

                  {/* Unique Feature: Verified Match Proof Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {review.proofTags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 text-[9px] font-bold text-gray-300 bg-[#0B0D13]/80 border border-[#262B3D] px-2 py-0.5 rounded-md"
                      >
                        <Check className="w-2.5 h-2.5 text-[#00F59B]" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                </div>

                {/* Bottom: Author, Booster Attribution & Interactive Helpful Button */}
                <div className="pt-3.5 border-t border-[#262B3D] flex items-center justify-between text-[11px] gap-2">
                  <div>
                    <div className="flex items-center space-x-1.5 font-bold text-white">
                      <span>{review.author}</span>
                      {review.verified && (
                        <span className="inline-flex items-center text-[10px] text-[#00F59B]" title="Verified Purchase">
                          <CheckCircle className="w-3.5 h-3.5 ml-0.5 inline fill-[#00F59B]/20" />
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 text-[10px] mt-0.5">
                      Booster: <span className="text-gray-200 font-semibold">{review.booster}</span>
                    </div>
                  </div>

                  {/* Interactive Helpful Upvote Button */}
                  <button
                    onClick={() => handleUpvote(review.id)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      review.isLiked
                        ? 'bg-[#00F59B]/20 text-[#00F59B] border border-[#00F59B]/50'
                        : 'bg-[#0B0D13] hover:bg-[#1C2234] border border-[#262B3D] text-gray-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${review.isLiked ? 'fill-[#00F59B]' : ''}`} />
                    <span className="text-[11px]">{review.upvotes}</span>
                  </button>
                </div>

              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Unique Interactive Feature: "Write a Review" Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-[#0B0D13] text-gray-400 hover:text-white border border-[#262B3D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00F59B]">
                  COMMUNITY REVIEWS
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Leave Your Verified Feedback
                </h3>
                <p className="text-xs text-gray-400">
                  Share your boosting experience with the community. Reviews help us maintain Top 200 booster quality.
                </p>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                
                {/* Star Rating Selector */}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5 uppercase">
                    Your Rating:
                  </label>
                  <div className="flex space-x-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            (hoverRating || newRating) >= star
                              ? 'fill-[#00F59B] text-[#00F59B]'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service Category & Platform Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1 uppercase">
                      Service Type:
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-[#0B0D13] border border-[#262B3D] text-white text-xs font-semibold rounded-xl p-2.5 focus:border-[#00F59B] outline-none"
                    >
                      <option value="champions">UT Champions Finals</option>
                      <option value="rivals">Division Rivals</option>
                      <option value="coaching">1-on-1 Coaching</option>
                      <option value="coins">FC 25 Coins</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1 uppercase">
                      Platform:
                    </label>
                    <select
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value)}
                      className="w-full bg-[#0B0D13] border border-[#262B3D] text-white text-xs font-semibold rounded-xl p-2.5 focus:border-[#00F59B] outline-none"
                    >
                      <option value="PS5">PlayStation 5</option>
                      <option value="PS4">PlayStation 4</option>
                      <option value="Xbox">Xbox Series / One</option>
                      <option value="PC">PC (EA App / Steam)</option>
                    </select>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1 uppercase">
                    Your Name or Gamer Tag:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Marcus K. or Alex_FUT"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-[#0B0D13] border border-[#262B3D] text-white text-xs rounded-xl p-2.5 focus:border-[#00F59B] outline-none"
                    required
                  />
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1 uppercase">
                    Review Details:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share match outcome, delivery speed, booster communication, or rewards..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-[#0B0D13] border border-[#262B3D] text-white text-xs rounded-xl p-2.5 focus:border-[#00F59B] outline-none resize-none"
                    required
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#00F59B]/20"
                  >
                    Submit Verified Review
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
