import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Sparkles, Users, Camera, Gift, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CulturalTip = ({ title, description, icon }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.05 }}
    className="glass-card p-6 rounded-xl text-center"
  >
    <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
    <p className="text-white/70">{description}</p>
  </motion.div>
);

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Skycial - Your Beauty, Powered by the Stars</title>
        <meta name="description" content="Join Skycial, the cosmic beauty community where you share photos, get advice, and discover your beauty potential through astrology." />
      </Helmet>
      
      <div className="min-h-screen cosmic-bg">
        <section className="relative overflow-hidden py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex justify-center items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-300 to-amber-500 rounded-full flex items-center justify-center cosmic-glow">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 playfair">
                <span className="gold-gradient-text">Skycial</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 mb-4 playfair">
                Your Beauty, Powered by the Stars
              </p>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Share your beauty journey, get personalized advice, and discover your cosmic potential in our stellar community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg cosmic-glow">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Join the Stars
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg">
                  Sign In
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative"
            >
              <img  class="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl glass-card" alt="5 diverse friends (Black, Asian, White, Middle Eastern, Latino) laughing together at a skincare table with beauty products, one man pretending to examine his friend's face with a magnifying mirror, with a soft purple and gold background and warm lighting" src="https://images.unsplash.com/photo-1681641093028-cf29d0fc9f2a" />
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 playfair gold-gradient-text">
                Discover Your Cosmic Beauty
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Connect with a community that celebrates your unique beauty while the stars guide your journey.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Camera, title: "Share Your Journey", description: "Upload photos to get personalized advice from our caring community.", link: "/submit-advice" },
                { icon: Users, title: "Beauty Community", description: "Connect with others, share tips, and get advice on skincare and beauty.", link: "/community" },
                { icon: Star, title: "Astrology Insights", description: "Get beauty advice based on your birth chart and cosmic alignment.", link: "/astrology" },
                { icon: Gift, title: "Rewards & Incentives", description: "Earn points for referrals and unlock free astrology readings.", link: "/rewards" }
              ].map((feature, index) => (
                <Link to={feature.link} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="glass-card p-6 rounded-xl text-center hover:scale-105 transition-transform h-full"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 playfair gold-gradient-text">
                Cultural Beauty Tips
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Explore timeless beauty secrets from around the globe.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link to="/cultural-tips#japanese"><CulturalTip title="Japanese Skincare" description="Layering lightweight products for 'mochi skin'—plump and hydrated." icon="🌸" /></Link>
              <Link to="/cultural-tips#korean"><CulturalTip title="Korean Beauty (K-Beauty)" description="The famous 10-step routine focusing on hydration and protection." icon="💧" /></Link>
              <Link to="/cultural-tips#ayurvedic"><CulturalTip title="Ayurvedic Practices" description="Indian traditions using natural ingredients like turmeric and neem." icon="🌿" /></Link>
              <Link to="/cultural-tips#african"><CulturalTip title="African Beauty Secrets" description="Utilizing rich shea butter and black soap for deep nourishment." icon="🌍" /></Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card p-12 rounded-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 playfair gold-gradient-text">
                Ready to Shine?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join thousands of beautiful souls discovering their cosmic potential.
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black px-12 py-4 text-xl cosmic-glow">
                  <Star className="w-6 h-6 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        <section className="py-20 px-4">
          <div className="max-w-xl mx-auto text-center">
             <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card p-8 rounded-2xl"
            >
              <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-teal-400" />
              <h2 className="text-3xl font-bold mb-4 playfair text-white">A Safe & Positive Space</h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Skycial is committed to fostering a supportive, bully-free environment. We use advanced moderation tools and have a zero-tolerance policy for hateful speech, ensuring everyone can share their journey with confidence. Your safety is our priority.
              </p>
            </motion.div>
          </div>
        </section>

        <footer className="py-12 px-4 border-t border-white/20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-amber-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gold-gradient-text playfair ml-2">Skycial</span>
            </div>
            <p className="text-white/60">
              © 2025 Skycial. Your beauty, powered by the stars. ✨
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;