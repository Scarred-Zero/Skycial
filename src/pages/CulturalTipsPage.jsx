import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet-async';
    import Navigation from '@/components/Navigation';
    import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
    import { allTips } from '@/lib/cultural-tips-db';

    const CulturalTipsPage = () => {
      return (
        <>
          <Helmet><title>Global Beauty Secrets - Skycial</title><meta name="description" content="Explore timeless beauty secrets from around the globe, from Japanese Skincare to African Beauty rituals." /></Helmet>
          <div className="min-h-screen cosmic-bg">
            <Navigation />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold playfair gold-gradient-text mb-4">Global Beauty Secrets</h1>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">Discover timeless beauty wisdom and rituals from cultures around the world. Select a culture to learn more.</p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allTips.map((tip, index) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={`/cultural-tips/${tip.id}`} className="block h-full group">
                      <Card className="glass-card border-white/20 h-full flex flex-col justify-between transform group-hover:-translate-y-2 transition-transform duration-300 cursor-pointer overflow-hidden">
                        <CardHeader className="flex flex-row items-center space-x-4 p-6 z-10">
                           <div className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl">{tip.icon}</span>
                          </div>
                           <CardTitle className="text-xl font-bold playfair text-white">{tip.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 z-10">
                           <p className="text-white/80 text-sm">{tip.description}</p>
                        </CardContent>
                        <img  class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300" alt={tip.image} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </>
      );
    };

    export default CulturalTipsPage;