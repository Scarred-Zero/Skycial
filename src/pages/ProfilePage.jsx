import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Camera, Edit, Gift, Calendar, MapPin, Clock, Save, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getUser, updateUser, redeemReward, getPosts } from '@/lib/supabaseData';
import Compressor from 'compressorjs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// --- HELPER FUNCTIONS ---

// Helper function to determine the zodiac sign based on the birth date
const getZodiacSign = (date) => {
  if (!date) return '';

  const dateObj = new Date(date);
  // Adjust for timezone offset to prevent off-by-one day errors
  const day = dateObj.getUTCDate();
  const month = dateObj.getUTCMonth() + 1;

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius ♒';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces ♓';
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries ♈';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus ♉';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini ♊';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer ♋';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo ♌';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo ♍';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra ♎';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio ♏';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius ♐';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn ♑';

  return '';
};

const zodiacSigns = [
  'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋', 'Leo ♌', 'Virgo ♍',
  'Libra ♎', 'Scorpio ♏', 'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
];


const ProfilePage = () => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const profile = await getUser();
      setUser(profile);

      const allPostsData = await getPosts();
      if (profile && Array.isArray(allPostsData)) {
        setUserPosts(allPostsData.filter(p => p.user_email === profile.email));
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const openEditModal = () => {
    if (!user) return;
    // Initialize form with current user data using camelCase
    setEditFormData({
      fullName: user.fullName || '',
      zodiacSign: user.profile?.zodiac_sign || '',
      birthDate: user.profile?.birth_date || '',
      birthTime: user.profile?.birth_time || '',
      birthPlace: user.profile?.birth_place || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const uploadFile = async (fileToUpload) => {
    toast({ title: "Uploading your cosmic photo... 🚀" });
    const apiKey = import.meta.env.VITE_IMGBB_KEY;
    if (!apiKey) {
      return toast({ variant: "destructive", title: "API Key Missing!" });
    }
    const formData = new FormData();
    formData.append('image', fileToUpload);
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        const imageUrl = result.data.url;
        // After getting the URL, call updateUser to save it to the database
        const { data: updateResult, error } = await updateUser({ avatarUrl: imageUrl });
        if (error) throw new Error(error);

        // Update the local user state with the fresh data from the server
        setUser(updateResult.data);
        toast({ title: "Profile picture updated! ✨" });
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      async success(compressedResult) {
        await uploadFile(compressedResult);
      },
      error(err) {
        toast({ variant: "destructive", title: "Compression Failed", description: err.message });
      },
    });
  };


  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      // If the birthDate is changed, automatically update the zodiac sign
      if (name === 'birthDate' && value) {
        newFormData.zodiacSign = getZodiacSign(value);
      }
      return newFormData;
    });
  };

  const handleSelectChange = (name, value) => {
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    const { data: result, error } = await updateUser(editFormData);
    if (error) {
      return toast({ variant: "destructive", title: "Update Failed", description: error });
    }
    setUser(result.data);
    setIsEditModalOpen(false);
    toast({ title: "Profile Updated! ✨" });
  };

  const handleRedeem = (cost, rewardName) => {
    // This function needs to be implemented in supabaseData.js
    console.log(`Redeeming ${rewardName} for ${cost} points.`);
    toast({ title: "Feature Coming Soon!", description: "Reward redemption is under development." });
  };

  if (loading) {
    return <LoadingSpinner text="Loading your profile..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen cosmic-bg flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your profile.</h1>
        <Link to="/login"><Button>Go to Login</Button></Link>
      </div>
    );
  }

  const achievements = [
    { title: 'Welcome Star', description: 'Joined Skycial', earned: true },
    { title: 'First Photo', description: 'Shared your first photo', earned: userPosts.length > 0 },
    { title: 'Community Helper', description: 'Helped 5 community members', earned: (user.profile?.total_advice_upvotes || 0) >= 5 },
    { title: 'Cosmic Connector', description: 'Referred 3 friends', earned: false },
  ];

  return (
    <>
      <Helmet>
        <title>Profile - Skycial</title>
      </Helmet>

      <div className="min-h-screen cosmic-bg">
        <Navigation />

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="glass-card border-white/20">
            <DialogHeader>
              <DialogTitle className="gold-gradient-text playfair text-2xl">Edit Your Cosmic Profile</DialogTitle>
              <DialogDescription className="text-white/70">Update your personal and astrological details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditFormSubmit} className="space-y-4 py-4">
              <div><Label htmlFor="fullName" className="text-white/90">Full Name</Label><Input id="fullName" name="fullName" value={editFormData.fullName || ''} onChange={handleEditFormChange} className="bg-black/20 border-white/20 text-white" /></div>
              <div><Label htmlFor="birthDate" className="text-white/90">Birth Date</Label><Input id="birthDate" name="birthDate" type="date" value={editFormData.birthDate || ''} onChange={handleEditFormChange} className="bg-black/20 border-white/20 text-white" /></div>
              <div>
                <Label htmlFor="zodiacSign" className="text-white/90">Zodiac Sign</Label>
                <Select name="zodiacSign" value={editFormData.zodiacSign || ''} onValueChange={(value) => handleSelectChange('zodiacSign', value)}>
                  <SelectTrigger className="w-full bg-black/20 border-white/20 text-white">
                    <SelectValue placeholder="Select your sign" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20 text-white">
                    <SelectGroup>
                      {zodiacSigns.map(sign => (
                        <SelectItem key={sign} value={sign} className="focus:bg-white/10">{sign}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="birthTime" className="text-white/90">Birth Time</Label><Input id="birthTime" name="birthTime" type="time" value={editFormData.birthTime || ''} onChange={handleEditFormChange} className="bg-black/20 border-white/20 text-white" /></div>
              <div><Label htmlFor="birthPlace" className="text-white/90">Birth Place</Label><Input id="birthPlace" name="birthPlace" value={editFormData.birthPlace || ''} onChange={handleEditFormChange} className="bg-black/20 border-white/20 text-white" /></div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-8">
            <Card className="glass-card border-white/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-lg">
                      <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                      <AvatarFallback>{user.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
                    <Button size="sm" onClick={handleUploadClick} className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"><Camera className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white playfair mb-2">{user.fullName}</h1>
                        <p className="text-white/70 mb-4">Cosmic beauty enthusiast ✨ | {user.profile?.zodiac_sign}</p>
                      </div>
                      <div className="flex items-center justify-center md:justify-start space-x-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1"><ThumbsUp className="w-5 h-5 text-teal-400" /><span className="text-2xl font-bold text-white">{user.profile?.total_advice_upvotes || 0}</span></div>
                          <p className="text-sm text-white/70">Upvotes</p>
                        </div>
                        <Link to="/rewards">
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1"><Star className="w-5 h-5 text-yellow-400" /><span className="text-2xl font-bold text-white">{user.points}</span></div>
                            <p className="text-sm text-white/70">Points</p>
                          </div>
                        </Link>
                        <Button onClick={openEditModal} variant="outline" className="border-white/30 text-white hover:bg-white/10"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                      </div>
                    </div>
                    {(user.profile?.birth_date || user.profile?.birth_time || user.profile?.birth_place) && (
                      <div className="glass-card p-4 rounded-lg">
                        <h3 className="text-white font-semibold mb-3 flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-400" /> Cosmic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {user.profile.birth_date && <div className="flex items-center text-white/80"><Calendar className="w-4 h-4 mr-2 text-purple-400" />{new Date(user.profile.birth_date).toLocaleDateString()}</div>}
                          {user.profile.birth_time && <div className="flex items-center text-white/80"><Clock className="w-4 h-4 mr-2 text-blue-400" />{user.profile.birth_time}</div>}
                          {user.profile.birth_place && <div className="flex items-center text-white/80"><MapPin className="w-4 h-4 mr-2 text-green-400" />{user.profile.birth_place}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 glass-card border-white/20">
                <TabsTrigger value="photos" className="text-white data-[state=active]:bg-white/20">My Posts</TabsTrigger>
                <TabsTrigger value="achievements" className="text-white data-[state=active]:bg-white/20">Achievements</TabsTrigger>
                <TabsTrigger value="rewards" className="text-white data-[state=active]:bg-white/20">Rewards</TabsTrigger>
                <TabsTrigger value="astrology" className="text-white data-[state=active]:bg-white/20">Astrology</TabsTrigger>
              </TabsList>

              <TabsContent value="photos" className="mt-6">
                <Card className="glass-card border-white/20">
                  <CardHeader><CardTitle className="text-white playfair">My Beauty Journey</CardTitle><CardDescription className="text-white/70">Posts you've shared</CardDescription></CardHeader>
                  <CardContent>
                    {userPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <Camera className="w-16 h-16 text-white/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                        <p className="text-white/70 mb-6">Start sharing your beauty journey!</p>
                        <Link to="/submit-advice"><Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"><Camera className="w-4 h-4 mr-2" /> Create First Post</Button></Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userPosts.map(post => (
                          <div key={post.id} className="glass-card p-4 rounded-lg">
                            {post.image_url && <img className="w-full h-40 object-cover rounded-md mb-2" alt="User post" src={post.image_url} />}
                            <p className="text-white/80 text-sm truncate">{post.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <Card className="glass-card border-white/20">
                  <CardHeader><CardTitle className="text-white playfair">Achievements</CardTitle><CardDescription className="text-white/70">Your cosmic milestones</CardDescription></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} className={`p-4 rounded-lg border ${achievement.earned ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' : 'bg-white/5 border-white/10'}`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-white/10'}`}><Star className={`w-6 h-6 ${achievement.earned ? 'text-white' : 'text-white/50'}`} /></div>
                            <div><h3 className={`font-semibold ${achievement.earned ? 'text-white' : 'text-white/60'}`}>{achievement.title}</h3><p className={`text-sm ${achievement.earned ? 'text-white/80' : 'text-white/50'}`}>{achievement.description}</p></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards" className="mt-6">
                <Card className="glass-card border-white/20">
                  <CardHeader><CardTitle className="text-white playfair">Cosmic Rewards</CardTitle><CardDescription className="text-white/70">Redeem your points. You can also view more rewards on the <Link to="/rewards" className="text-yellow-400 underline">Rewards Page</Link>.</CardDescription></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex justify-between items-start mb-3"><div><h3 className="text-white font-semibold">Free Astrology Reading</h3><p className="text-white/70 text-sm">Personalized insights from the stars</p></div><span className="text-yellow-400 font-bold">500 pts</span></div>
                        <Button onClick={() => handleRedeem(500, 'Free Astrology Reading')} disabled={user.points < 500} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"><Gift className="w-4 h-4 mr-2" />{user.points >= 500 ? 'Redeem Now' : 'Need More Points'}</Button>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex justify-between items-start mb-3"><div><h3 className="text-white font-semibold">Beauty Makeover Consultation</h3><p className="text-white/70 text-sm">Professional beauty consultation</p></div><span className="text-yellow-400 font-bold">1000 pts</span></div>
                        <Button onClick={() => handleRedeem(1000, 'Beauty Makeover Consultation')} disabled={user.points < 1000} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"><Gift className="w-4 h-4 mr-2" />{user.points >= 1000 ? 'Redeem Now' : 'Need More Points'}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="astrology" className="mt-6">
                <Card className="glass-card border-white/20">
                  <CardHeader><CardTitle className="text-white playfair">Your Cosmic Profile</CardTitle><CardDescription className="text-white/70">Personalized astrology for your beauty. For more details, visit the <Link to="/astrology" className="text-yellow-400 underline">Astrology Hub</Link>.</CardDescription></CardHeader>
                  <CardContent>
                    {user.profile.birth_date ? (
                      <div className="space-y-6">
                        <div className="text-center"><img class="w-32 h-32 mx-auto rounded-full mb-4" alt="Zodiac constellation and stars representing user's astrological sign" src="https://images.unsplash.com/photo-1554215317-5ff20528f977" /><h3 className="text-xl font-semibold text-white mb-2">Your Cosmic Beauty Profile</h3><p className="text-white/70">Based on your birth details</p></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10"><h4 className="text-white font-semibold mb-2">Beauty Strengths</h4><p className="text-white/70 text-sm">Your natural radiance shines through. Focus on enhancing your natural glow with products that complement your cosmic energy.</p></div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10"><h4 className="text-white font-semibold mb-2">Recommended Care</h4><p className="text-white/70 text-sm">Your skin responds well to gentle, natural ingredients. Consider lunar cycles in your skincare routine for optimal results.</p></div>
                        </div>
                        <div className="text-center"><Link to="/astrology"><Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black"><Star className="w-4 h-4 mr-2" />Get Detailed Reading</Button></Link></div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Star className="w-16 h-16 text-white/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Complete Your Cosmic Profile</h3>
                        <p className="text-white/70 mb-6">Add birth details to unlock personalized astrology insights.</p>
                        <Button onClick={() => setIsEditModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"><Edit className="w-4 h-4 mr-2" />Add Birth Details</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
