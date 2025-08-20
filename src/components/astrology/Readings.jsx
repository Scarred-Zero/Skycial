import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Sparkles, Calendar, Clock, MapPin, Dice5 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const beautyReadings = [
  { advice: "The stars highlight your eyes today. A touch of shimmering eyeshadow will capture their cosmic light.", cosmic: "Mercury's position favors subtle details. Let your eyes do the talking.", luckyNumbers: [7, 12, 25] },
  { advice: "Your skin is craving harmony. A gentle, hydrating face mist will align you with Venus's loving energy.", cosmic: "Venus promotes self-care. Nurture your skin, and your inner glow will follow.", luckyNumbers: [3, 9, 18] },
  { advice: "A bold lip color is your power move today. Channel the Sun's confidence with a vibrant shade.", cosmic: "The Sun's energy is strong. Don't be afraid to stand out and be seen.", luckyNumbers: [1, 10, 21] },
  { advice: "Earthy tones in your makeup or clothing will ground you. Think warm browns, deep greens, or terracotta.", cosmic: "Saturn's influence suggests stability. A classic, grounded look will feel most authentic.", luckyNumbers: [4, 8, 16] },
  { advice: "The cosmos favors a 'less is more' approach for you right now. Focus on a flawless, natural-looking base.", cosmic: "The Moon's phase encourages authenticity. Let your true self shine through.", luckyNumbers: [2, 11, 22] },
];

const Readings = ({ user }) => {
  const { toast } = useToast();
  const [reading, setReading] = useState(beautyReadings[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const index = (date.getHours() + date.getMinutes()) % beautyReadings.length;
      setReading(beautyReadings[index]);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getDetailedReading = () => {
    toast({
      title: "Detailed Reading ✨",
      description: "Based on your cosmic profile, a focus on earthy tones and natural ingredients is highly recommended this week.",
    });
  };

  const drawAnotherCard = () => {
    const newIndex = (beautyReadings.indexOf(reading) + 1) % beautyReadings.length;
    setReading(beautyReadings[newIndex]);
    toast({
      title: "New Cosmic Insight! ✨",
      description: "A fresh piece of beauty advice from the stars awaits you.",
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white playfair">Your Cosmic Profile</CardTitle>
          <CardDescription className="text-white/70">The canvas for your cosmic beauty</CardDescription>
        </CardHeader>
        <CardContent>
          {user.birth_date ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <img  class="w-24 h-24 mx-auto rounded-full mb-4" alt="Zodiac wheel with astrological symbols and cosmic elements" src="https://images.unsplash.com/photo-1542123562-91ac47eb7ec4" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-white/80"><Calendar className="w-4 h-4 mr-3 text-purple-400" /><span>Birth Date: {new Date(user.birth_date).toLocaleDateString()}</span></div>
                {user.birth_time && <div className="flex items-center text-white/80"><Clock className="w-4 h-4 mr-3 text-blue-400" /><span>Birth Time: {user.birth_time}</span></div>}
                {user.birth_place && <div className="flex items-center text-white/80"><MapPin className="w-4 h-4 mr-3 text-green-400" /><span>Birth Place: {user.birth_place}</span></div>}
              </div>
              <div className="p-4 rounded-lg bg-black/20 border border-white/10 mt-6">
                <h4 className="text-white font-semibold mb-2">Your Beauty Essence</h4>
                <p className="text-white/70 text-sm">Your cosmic energy radiates natural beauty and confidence. The stars suggest focusing on enhancing your natural features.</p>
              </div>
              <Button onClick={getDetailedReading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Star className="w-4 h-4 mr-2" /> Get Detailed Reading
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Complete Your Profile</h3>
              <p className="text-white/70 mb-4">Add birth details for personalized readings.</p>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">Add Birth Details</Button>
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
                        <p className="text-white/80 text-sm">"{reading.advice}"</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                        <h4 className="text-white font-semibold mb-2">Cosmic Context</h4>
                        <p className="text-white/80 text-sm">{reading.cosmic}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                        <h4 className="text-white font-semibold mb-2">Today's Lucky Numbers</h4>
                        <div className="flex items-center space-x-4">
                            {reading.luckyNumbers.map(num => (
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

export default Readings;