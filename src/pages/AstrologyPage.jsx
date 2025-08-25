import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Moon, Sun, Sparkles, Edit, Leaf, Calendar, Clock, MapPin, ShoppingCart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getUser, getAstrologyContent, purchasePremiumReport } from '@/lib/supabaseData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


// --- CHILD COMPONENTS (Refactored for Dynamic Data) ---

const DailyInsights = ({ insights }) => (
    // This component displays the user's daily cosmic insights.
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="mb-8">
        <Card className="glass-card border-white/20">
            <CardHeader>
                <CardTitle className="text-white playfair flex items-center"><Star className="w-6 h-6 mr-2 text-yellow-400" />Today's Cosmic Insights</CardTitle>
                <CardDescription className="text-white/70">Personalized guidance for your beauty journey today, based on your Zodiac sign.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Responsive Grid: Stacks to 1 column on mobile, 3 on medium screens and up. */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
);

const Readings = ({ user, reading }) => {
    // This component shows personalized birth details and a real-time beauty tip card.
    const { toast } = useToast();

    const beautyReadings = [
        { advice: "The stars highlight your eyes today. A touch of shimmering eyeshadow will capture their cosmic light.", cosmic: "Mercury's position favors subtle details. Let your eyes do the talking.", luckyNumbers: [7, 12, 25] },
        { advice: "Your skin is craving harmony. A gentle, hydrating face mist will align you with Venus's loving energy.", cosmic: "Venus promotes self-care. Nurture your skin, and your inner glow will follow.", luckyNumbers: [3, 9, 18] },
        { advice: "A bold lip color is your power move today. Channel the Sun's confidence with a vibrant shade.", cosmic: "The Sun's energy is strong. Don't be afraid to stand out and be seen.", luckyNumbers: [1, 10, 21] },
        { advice: "Earthy tones in your makeup or clothing will ground you. Think warm browns, deep greens, or terracotta.", cosmic: "Saturn's influence suggests stability. A classic, grounded look will feel most authentic.", luckyNumbers: [4, 8, 16] },
        { advice: "The cosmos favors a 'less is more' approach for you right now. Focus on a flawless, natural-looking base.", cosmic: "The Moon's phase encourages authenticity. Let your true self shine through.", luckyNumbers: [2, 11, 22] },
    ];

    const [realTimeReading, setRealTimeReading] = useState(beautyReadings[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date();
            const index = (date.getHours() + date.getMinutes()) % beautyReadings.length;
            setRealTimeReading(beautyReadings[index]);
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const drawAnotherCard = () => {
        const currentIndex = beautyReadings.findIndex(item => item.advice === realTimeReading.advice);
        const newIndex = (currentIndex + 1) % beautyReadings.length;
        setRealTimeReading(beautyReadings[newIndex]);
        toast({
            title: "New Cosmic Insight! ✨",
            description: "A fresh piece of beauty advice from the stars awaits you.",
        });
    };

    return (
        // Responsive Grid: Stacks to 1 column on mobile/tablet, 2 columns on large screens.
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-white/20">
                <CardHeader>
                    <CardTitle className="text-white playfair">Your Cosmic Essence</CardTitle>
                    <CardDescription className="text-white/70">The core of your cosmic beauty, based on your birth details.</CardDescription>
                </CardHeader>
                <CardContent>
                    {user.profile?.birth_date ? (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <Avatar className="w-24 h-24 mx-auto rounded-full mb-4 object-cover">
                                    <AvatarImage src={user.avatarUrl} alt="Zodiac wheel" />
                                    <AvatarFallback>{(user?.fullName?.charAt(0) || 'S').toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center text-white/80"><Calendar className="w-4 h-4 mr-3 text-purple-400" /><span>Birth Date: {new Date(user.profile?.birth_date).toLocaleDateString()}</span></div>
                                {user.profile?.birth_time && <div className="flex items-center text-white/80"><Clock className="w-4 h-4 mr-3 text-blue-400" /><span>Birth Time: {user.profile?.birth_time}</span></div>}
                                {user.profile?.birth_place && <div className="flex items-center text-white/80"><MapPin className="w-4 h-4 mr-3 text-green-400" /><span>Birth Place: {user.profile?.birth_place}</span></div>}
                            </div>
                            <div className="p-4 rounded-lg bg-black/20 border border-white/10 mt-6">
                                <h4 className="text-white font-semibold mb-2">Your Beauty Reading</h4>
                                <p className="text-white/70 text-sm">{reading || "Your unique cosmic energy radiates through a confident and authentic presence. Embrace what makes you, you."}</p>
                            </div>
                            <Button onClick={() => toast({
                                title: "Detailed Reading ✨",
                                description: `${reading || "Embrace your unique cosmic energy today!"}`,
                            })} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                                <Star className="w-4 h-4 mr-2" /> Get Detailed Reading
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Star className="w-16 h-16 text-white/30 mx-auto mb-4" />
                            <h3 className="text-white font-semibold mb-2">Complete Your Profile</h3>
                            <p className="text-white/70 mb-4">Add your birth details to unlock personalized readings.</p>
                            <Link to="/profile"><Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"><Edit className="w-4 h-4 mr-2" /> Go to Profile</Button></Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Card className="glass-card border-white/20 h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-white playfair">Real-Time Cosmic Beauty Tip</CardTitle>
                        <CardDescription className="text-white/70">Unisex advice, updated by the minute</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                                <h4 className="text-white font-semibold mb-2">Today's Beauty Focus</h4>
                                <p className="text-white/80 text-sm">"{realTimeReading.advice}"</p>
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                                <h4 className="text-white font-semibold mb-2">Cosmic Context</h4>
                                <p className="text-white/80 text-sm">{realTimeReading.cosmic}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                                <h4 className="text-white font-semibold mb-2">Today's Lucky Numbers</h4>
                                <div className="flex items-center space-x-4">
                                    {realTimeReading.luckyNumbers.map(num => (
                                        <span key={num} className="text-lg font-bold text-yellow-300">{num}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Button onClick={drawAnotherCard} className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                            <Sparkles className="w-4 h-4 mr-2" /> Get Another Insight
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

const PremiumReports = ({ user, onPurchase }) => {
    // This component displays premium reports available for purchase with points.
    const { toast } = useToast();
    const handlePurchase = (reportName, cost) => {
        if (!user) {
            toast({ variant: "destructive", title: "Please log in to purchase." });
            return;
        }
        onPurchase(cost, reportName);
    };

    return (
        <Card className="glass-card border-white/20">
            <CardHeader>
                <CardTitle className="text-white playfair flex items-center"><Star className="w-6 h-6 mr-2 text-yellow-400" /> Premium Astrology Reports</CardTitle>
                <CardDescription className="text-white/70">Unlock deeper insights into your cosmic beauty.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Responsive Grid: Stacks to 1 column on mobile, 2 columns on medium screens and up. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                        <h3 className="text-white font-semibold text-xl mb-3">Complete Beauty Chart</h3>
                        <p className="text-white/80 mb-4">A comprehensive analysis of your birth chart with a focus on beauty, style, and personal enhancement.</p>
                        <ul className="text-white/70 text-sm space-y-2 mb-6 list-disc list-inside">
                            <li>Detailed planetary influences on appearance</li>
                            <li>Best colors and styles for your chart</li>
                            <li>Optimal timing for beauty treatments</li>
                        </ul>
                        <Button onClick={() => handlePurchase('Complete Beauty Chart', 500)} className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black">Purchase - 500 Points</Button>
                    </div>
                    <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                        <h3 className="text-white font-semibold text-xl mb-3">Monthly Beauty Forecast</h3>
                        <p className="text-white/80 mb-4">Monthly predictions for your beauty journey, including best days for treatments and style changes.</p>
                        <ul className="text-white/70 text-sm space-y-2 mb-6 list-disc list-inside">
                            <li>Daily beauty guidance for the month</li>
                            <li>Lucky colors and styles for you</li>
                            <li>Best dates for hair cuts & treatments</li>
                        </ul>
                        <Button onClick={() => handlePurchase('Monthly Beauty Forecast', 800)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">Purchase - 800 Points</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const BeautyTips = ({ user, beautyTips }) => {
    // This component shows a personalized beauty tip and tips for other zodiac signs.
    const userSign = user?.profile?.zodiac_sign;
    const personalTip = beautyTips.find(tip => tip.sign === userSign);
    const otherTips = beautyTips.filter(tip => tip.sign !== userSign);

    return (
        <div className="space-y-6">
            {personalTip && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="glass-card border-white/20 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                        <CardHeader>
                            <CardTitle className="text-white playfair">Your Personal Beauty Tip</CardTitle>
                            <CardDescription className="text-white/70">A special tip just for {userSign}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/90 text-lg">{personalTip.description}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
            {/* Responsive Grid: Stacks to 1 column on mobile, 2 on medium screens and up. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherTips.map((tip, index) => (
                    <motion.div key={tip.sign} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                        <Card className="glass-card border-white/20 h-full">
                            <CardHeader>
                                <CardTitle className="text-white playfair">{tip.sign}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white/80">{tip.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const MoonPhases = () => {
    // This component provides a guide to beauty routines based on moon phases.
    const phases = [
        { phase: "New Moon", activity: "Fresh starts, new routines", icon: "🌑" },
        { phase: "Waxing Moon", activity: "Building treatments, growth", icon: "🌓" },
        { phase: "Full Moon", activity: "Intensive care, masks", icon: "🌕" },
        { phase: "Waning Moon", activity: "Cleansing, detox", icon: "🌗" }
    ];

    return (
        <Card className="glass-card border-white/20">
            <CardHeader>
                <CardTitle className="text-white playfair flex items-center">
                    <Moon className="w-6 h-6 mr-2 text-blue-400" /> Moon Phase Beauty Guide
                </CardTitle>
                <CardDescription className="text-white/70">Align your beauty routine with lunar cycles</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center mb-8">
                    <img className="w-48 h-48 mx-auto rounded-full mb-4 object-cover" alt="Moon phases diagram" src="https://images.unsplash.com/photo-1595639546396-99140afe3a0d?q=80&w=2070&auto=format&fit=crop" />
                    <h3 className="text-xl font-semibold text-white mb-2">Current Phase: Waxing Gibbous</h3>
                    <p className="text-white/70">Perfect time for building and enhancing treatments</p>
                </div>
                {/* Responsive Grid: 1 col on mobile, 2 on small screens, 4 on large screens. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {phases.map((phase, index) => (
                        <div key={index} className="p-4 rounded-lg bg-black/20 border border-white/10 text-center">
                            <div className="text-3xl mb-2">{phase.icon}</div>
                            <h4 className="text-white font-semibold mb-2">{phase.phase}</h4>
                            <p className="text-white/70 text-sm">{phase.activity}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const ProductRecommendations = () => {
    // This component displays recommended products.
    const { toast } = useToast();
    const productRecommendations = [
        { name: 'Celestial Glow Serum', description: 'A lightweight serum infused with meteorite dust for ultimate radiance.', price: '$45', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1932&auto=format&fit=crop' },
        { name: 'Lunar Dream Cream', description: 'A rich night cream that works with the lunar cycle to rejuvenate your skin.', price: '$55', image: 'https://images.unsplash.com/photo-1628087942993-e40e3478955b?q=80&w=1964&auto=format&fit=crop' },
        { name: 'Solar Flare Sunscreen', description: 'Broad-spectrum SPF 50 that protects and gives a sun-kissed look.', price: '$35', image: 'https://images.unsplash.com/photo-1621643211339-add968798935?q=80&w=1964&auto=format&fit=crop' }
    ];

    const handleAddToCart = (productName) => {
        toast({
            title: "🚧 Feature in Development",
            description: `Adding ${productName} to cart isn't implemented yet—but you can request it! �`,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8" // Added margin top for spacing
        >
            <Card className="glass-card border-white/20">
                <CardHeader>
                    <CardTitle className="text-white playfair text-2xl">Essential Product Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Responsive Grid: 1 col on mobile, 2 on small screens, 3 on medium screens. */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {productRecommendations.map((product, index) => (
                            <Card key={index} className="bg-white/5 border-white/10 flex flex-col">
                                <CardHeader>
                                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4" />
                                    <CardTitle className="text-white">{product.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col flex-grow">
                                    <p className="text-white/80 text-sm mb-4 flex-grow">{product.description}</p>
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                        <span className="text-xl font-bold text-yellow-400">{product.price}</span>
                                        <Button onClick={() => handleAddToCart(product.name)} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                            <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};


// --- MAIN ASTROLOGY PAGE ---

const AstrologyPage = ({ setIsLoading }) => {
    const [user, setUser] = useState(null);
    const [astrologyContent, setAstrologyContent] = useState({});
    const [allBeautyTips, setAllBeautyTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchData = useCallback(async () => {
        setLoading(true);

        const currentUser = await getUser();
        setUser(currentUser);



        const { data: contentData, success } = await getAstrologyContent();

        if (success) {
            // Set all beauty tips for the BeautyTips component
            setAllBeautyTips(contentData.filter(item => item.content_type === 'beauty_tip'));

            // Filter content for the current user's sign for other components
            if (currentUser?.profile?.zodiac_sign) {
                const userSign = currentUser.profile.zodiac_sign;
                const filteredContent = contentData.filter(item => item.sign === userSign);

                const contentMap = {
                    beauty_tip: filteredContent.find(c => c.content_type === 'beauty_tip')?.description,
                    daily_insight: filteredContent.find(c => c.content_type === 'daily_insight')?.description,
                    reading: filteredContent.find(c => c.content_type === 'reading')?.description,
                    compatibility: filteredContent.find(c => c.content_type === 'daily_insight')?.compatibility,
                };
                setAstrologyContent(contentMap);
            }
        }

        setLoading(false);
    }, [setIsLoading]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePurchase = async (cost, reportName) => {
        const { success, error } = await purchasePremiumReport(user.id, user.points, cost);
        if (success) {
            toast({
                title: "Purchase Successful! ✨",
                description: `You've unlocked the ${reportName}.`,
            });
            fetchData(); // Refresh user data to show updated points
        } else {
            toast({
                variant: "destructive",
                title: "Purchase Failed",
                description: error || "You may not have enough points.",
            });
        }
    };

    if (loading) {
        return <LoadingSpinner text="Consulting the Cosmos..." />;
    }

    return (
        <>
            <Helmet>
                <title>Astrology - Skycial</title>
            </Helmet>
            <div className="min-h-screen cosmic-bg">
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-8 md:mb-12">
                        {/* Responsive Typography: Adjusted font sizes for different breakpoints. */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold playfair gold-gradient-text mb-4">Cosmic Beauty Guidance</h1>
                        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto">Let the stars guide your beauty journey with personalized insights.</p>
                    </motion.div>

                    {user ? (
                        <>
                            <DailyInsights insights={astrologyContent} />
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                                <Tabs defaultValue="readings" className="w-full">
                                    {/* Responsive Tabs: 2 columns on mobile, 4 on small screens and up. */}
                                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 glass-card border-white/20 h-auto p-1">
                                        <TabsTrigger value="readings" className="text-white data-[state=active]:bg-white/20">Reading</TabsTrigger>
                                        <TabsTrigger value="beauty-tips" className="text-white data-[state=active]:bg-white/20">Beauty Tips</TabsTrigger>
                                        <TabsTrigger value="moon-phases" className="text-white data-[state=active]:bg-white/20">Moon Phases</TabsTrigger>
                                        <TabsTrigger value="premium" className="text-white data-[state=active]:bg-white/20">Premium</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="readings" className="mt-6"><Readings user={user} reading={astrologyContent.reading} /></TabsContent>
                                    <TabsContent value="beauty-tips" className="mt-6"><BeautyTips user={user} beautyTips={allBeautyTips} /></TabsContent>
                                    <TabsContent value="moon-phases" className="mt-6"><MoonPhases /></TabsContent>
                                    <TabsContent value="premium" className="mt-6"><PremiumReports user={user} onPurchase={handlePurchase} /></TabsContent>
                                </Tabs>
                            </motion.div>
                            <ProductRecommendations />
                        </>
                    ) : (
                        <Card className="glass-card border-white/20 text-center py-12">
                            <CardHeader><CardTitle className="text-white text-2xl">Log In to See Your Cosmic Path</CardTitle></CardHeader>
                            <CardContent><Link to="/login"><Button>Log In</Button></Link></CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </>
    );
};

export default AstrologyPage;
