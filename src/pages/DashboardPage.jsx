import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Moon, Sun, Sparkles, UserPlus, Send, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import ReferralDialog from '@/components/ReferralDialog';
import { getUser, getPosts } from '@/lib/supabaseData';
import { timeAgo } from '@/lib/timeUtils';

const DashboardPage = ({ setIsLoading }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [dailyInsights, setDailyInsights] = useState({ focus: '', energy: '', moon: '' });

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    (async () => {
      try {
        const userData = await getUser();
        if (!active) return;

        if (userData) {
          setUser(userData);

          // ✅ Await posts fetch
          const posts = await getPosts();
          if (!active) return;

          // ✅ Defensive: ensure posts is an array before slicing
          const safePosts = Array.isArray(posts) ? posts : [];
          setRecentPosts(safePosts.slice(0, 2));

          updateDailyInsights();
        }
      } catch (err) {
        console.error('Dashboard init error:', err);
      } finally {
        if (active) {
          setLoading(false);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [setIsLoading]);

  const DailyInsights = ({ insights }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="mb-8">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white playfair flex items-center"><Star className="w-6 h-6 mr-2 text-yellow-400" />Today's Cosmic Insights</CardTitle>
              <CardDescription className="text-white/70">Personalized guidance for your beauty journey today, based on your Zodiac sign.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-1 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-center p-4 rounded-lg bg-black/20 border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3"><Sun className="w-6 h-6 text-white" /></div>
                  <h3 className="text-white font-semibold mb-2">Daily Insight</h3>
                  <p className="text-white/70 text-sm">{insights?.daily_insight || "Embrace your unique cosmic energy today!"}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-center p-4 rounded-lg bg-black/20 border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3"><Sparkles className="w-6 h-6 text-white" /></div>
                  <h3 className="text-white font-semibold mb-2">Beauty Tip</h3>
                  <p className="text-white/70 text-sm">{insights?.beauty_tip || "A touch of shimmer will make you sparkle."}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center p-4 rounded-lg bg-black/20 border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-3"><Leaf className="w-6 h-6 text-white" /></div>
                  <h3 className="text-white font-semibold mb-2">Compatibility</h3>
                  <p className="text-white/70 text-sm">Connect with {insights?.compatibility?.join(' & ') || 'all signs'} for positive energy.</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );

  const updateDailyInsights = () => {
    const focuses = ["Hydration and Glow", "Bold Lip Colors", "Natural, Earthy Tones", "Shimmer and Shine", "Deep Cleansing and Detox"];
    const energies = ["Productive and Grounded", "Creative and Expressive", "Social and Communicative", "Introspective and Calm", "Energetic and Bold"];
    const moonPhases = ["New Moon: Set intentions for your beauty goals.", "Waxing Crescent: Start new routines.", "First Quarter: Take action on your goals.", "Waxing Gibbous: Refine and perfect your look.", "Full Moon: Celebrate your beauty and radiance.", "Waning Gibbous: Share your wisdom and tips.", "Last Quarter: Release what no longer serves you.", "Waning Crescent: Rest and rejuvenate."];

    const date = new Date();
    setDailyInsights({
      focus: focuses[date.getDate() % focuses.length],
      energy: energies[date.getDate() % energies.length],
      moon: moonPhases[Math.floor(date.getDate() / 3.6) % moonPhases.length]
    });
  };


  const handleInsightClick = (insightType) => {
    toast({
      title: `Your ${insightType} Insight`,
      description: "Clicking this will take you to a detailed astrology page. Feature coming soon!",
    })
  }

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen cosmic-bg flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Session expired or user not found.</h1>
        <p className="mb-4">Please log in to continue.</p>
        <Link to="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Skycial</title>
        <meta name="description" content="Your personal Skycial dashboard. Share photos, connect with the community, and track your cosmic beauty journey." />
      </Helmet>

      <div className="min-h-screen cosmic-bg">
        <Navigation />
        <ReferralDialog open={isReferralDialogOpen} onOpenChange={setIsReferralDialogOpen} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 rounded-lg">
                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl">
                      {user && user.fullName
                        ? user.fullName
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-white playfair">
                      Welcome back! ✨
                    </h1>
                    <p className="text-white/70">Your cosmic beauty journey continues</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link to="/friends">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      <UserPlus className="w-4 h-4 mr-2" /> Find a Friend
                    </Button>
                  </Link>
                  <Button onClick={() => setIsReferralDialogOpen(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <Send className="w-4 h-4 mr-2" /> Invite
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white playfair">Community Feed</CardTitle>
                    <CardDescription className="text-white/70">What your stellar community is sharing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentPosts.map((post) => (
                      <Link to="/community" key={post.id} className="block p-4 rounded-lg bg-white/5 border border-transparent hover:border-white/20 transition-all duration-300">
                        <div className="flex items-start space-x-3">
                          <Avatar className="rounded-lg">
                            <AvatarImage src={post.avatar_url} alt={post.user} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl">
                              {user && user.fullName
                                ? user.fullName
                                  .split(' ')
                                  .map(n => n[0])
                                  .join('')
                                  .toUpperCase()
                                : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-white">{post.user}</span>
                              <span className="text-sm text-white/60">{timeAgo(post.created_at)}</span>
                            </div>
                            <p className="text-white/80 line-clamp-2">{post.content}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link to="/community">
                      <Button variant="link" className="text-purple-400 w-full">View Full Community Feed &rarr;</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

                      
            <DailyInsights insights={dailyInsights} />

          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;