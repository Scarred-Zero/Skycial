import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Gift, Users, Trophy, LogIn, Image as ImageIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import ReferralDialog from '@/components/ReferralDialog';
import { getUser, redeemReward, handleDailyLogin } from '@/lib/supabaseData';
import { Link } from 'react-router-dom';

const RewardsPage = ({ setIsLoading }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
        const userData = getUser();
        if (userData) {
          setUser(userData);
        }
        setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  useEffect(() => {
    const script = document.createElement("script");
    script.id = "tawk-to-script";
    script.async = true;
    script.src = 'https://embed.tawk.to/689afad77d35221922f4b7f0/1j2em7mv1';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    return () => {
      const tawkScript = document.getElementById('tawk-to-script');
      if (tawkScript) {
        document.body.removeChild(tawkScript);
      }
      // Clean up Tawk.to widget elements and globals
      const tawkWidget = document.querySelector('div[data-tawk-id]');
      if (tawkWidget) {
        tawkWidget.parentElement.removeChild(tawkWidget);
      }
      delete window.Tawk_API;
      delete window.Tawk_LoadStart;
    };
  }, []);
  
  const handleRedeem = (cost, rewardName) => {
    const updatedUser = redeemReward(user.email, cost);
    if (updatedUser) {
      setUser(updatedUser);
      toast({
        title: "Reward Redeemed! 🎁",
        description: `You've successfully redeemed the ${rewardName}!`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Redemption Failed",
        description: "Not enough points for this reward.",
      });
    }
  };

  const triggerDailyLogin = () => {
    const updatedUser = handleDailyLogin(user.email);
    if (updatedUser) {
      setUser(updatedUser);
      toast({ title: "Daily Login Bonus! ✨", description: "You've earned 10 points for logging in today." });
    } else {
      toast({ title: "Already Claimed!", description: "You've already received your daily login bonus. Come back tomorrow!" });
    }
  };
  
  if (!user) {
    return null; // The main loading spinner will be shown
  }

  const waysToEarn = [
    { title: "Refer a Friend", points: "+150", icon: Users, action: () => setIsReferralDialogOpen(true), isButton: true },
    { title: "Daily Login", points: "+10", icon: LogIn, action: triggerDailyLogin, isButton: true },
    { title: "Post a Photo", points: "+25", icon: ImageIcon, action: null, isButton: false, link: "/submit-advice" },
    { title: "Give Helpful Advice", points: "+50", icon: Trophy, action: null, isButton: false, link: "/community" }
  ];

  const redeemableRewards = [
    { title: "Exclusive Content Access", icon: Eye, cost: 750, description: "Unlock a library of premium beauty tutorials and articles for a week." },
    { title: "Free Astrology Reading", icon: Star, cost: 500, description: "Get personalized insights from the stars." },
    { title: "Profile Feature for 24h", icon: Trophy, cost: 2000, description: "Get your profile featured on the community page." }
  ];

  const nextMilestone = {
    title: "Cosmic Connoisseur",
    pointsNeeded: 1000,
    currentProgress: (user.points / 1000) * 100
  };

  return (
    <>
      <Helmet>
        <title>Rewards - Skycial</title>
        <meta name="description" content="Earn and redeem Cosmic Points on Skycial. Get rewards like free astrology readings, makeovers, and more." />
      </Helmet>

      <div className="min-h-screen cosmic-bg">
        <Navigation />
        
        <ReferralDialog open={isReferralDialogOpen} onOpenChange={setIsReferralDialogOpen} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold playfair gold-gradient-text mb-4">Cosmic Rewards</h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">Earn points for your engagement and unlock stellar rewards.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
              <Card className="glass-card border-white/20 h-full">
                <CardHeader><CardTitle className="text-white playfair">Your Balance</CardTitle></CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center space-x-4 mb-4"><Star className="w-12 h-12 text-yellow-400" /><span className="text-6xl font-bold text-white">{user.points}</span></div>
                  <p className="text-white/80 text-lg">Cosmic Points</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="md:col-span-2">
              <Card className="glass-card border-white/20 h-full">
                <CardHeader><CardTitle className="text-white playfair">Next Milestone</CardTitle><CardDescription className="text-white/70">Reach new levels to unlock exclusive badges!</CardDescription></CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2"><span className="text-white font-semibold">{nextMilestone.title}</span><span className="text-yellow-400 font-bold">{user.points} / {nextMilestone.pointsNeeded} pts</span></div>
                  <Progress value={nextMilestone.currentProgress} className="w-full bg-black/30" indicatorClassName="bg-gradient-to-r from-yellow-400 to-amber-500" />
                  <p className="text-sm text-white/60 mt-2">You're on your way to becoming a Cosmic Connoisseur!</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <Card className="glass-card border-white/20 h-full">
                <CardHeader><CardTitle className="text-white playfair">How to Earn Points</CardTitle><CardDescription className="text-white/70">Get rewarded for being an active part of the cosmos.</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {waysToEarn.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center"><item.icon className="w-5 h-5 mr-3 text-purple-400" /><span className="text-white/90">{item.title}</span></div>
                        {item.isButton ? (
                          <Button onClick={item.action} variant="ghost" className="text-green-400 hover:text-green-300 hover:bg-green-500/10 font-bold">{item.points}</Button>
                        ) : (
                          <Link to={item.link}><Button variant="ghost" className="text-green-400 hover:text-green-300 hover:bg-green-500/10 font-bold">{item.points}</Button></Link>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              <Card className="glass-card border-white/20 h-full">
                <CardHeader><CardTitle className="text-white playfair">Available Rewards</CardTitle><CardDescription className="text-white/70">Trendy and desirable rewards for our user base.</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {redeemableRewards.map((reward, index) => (
                      <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-white font-semibold flex items-center">
                              <reward.icon className="w-5 h-5 mr-3 text-purple-400" />
                              {reward.title}
                            </h3>
                            <p className="text-white/70 text-sm ml-8">{reward.description}</p>
                          </div>
                          <span className="text-yellow-400 font-bold whitespace-nowrap ml-4">{reward.cost} pts</span>
                        </div>
                        <Button onClick={() => handleRedeem(reward.cost, reward.title)} disabled={user.points < reward.cost} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50">
                          <Gift className="w-4 h-4 mr-2" />
                          {user.points >= reward.cost ? 'Redeem Now' : 'Need More Points'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RewardsPage;