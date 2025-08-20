import React, { useState, useEffect } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet-async';
    import Navigation from '@/components/Navigation';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { RefreshCw, ArrowLeft } from 'lucide-react';
    import { tipsDatabase, allTips } from '@/lib/cultural-tips-db';

    const CulturalTipDetailPage = () => {
      const { tipId } = useParams();
      const tipInfo = allTips.find(t => t.id === tipId);
      const tipData = tipsDatabase[tipId];

      const [currentTip, setCurrentTip] = useState(tipData ? tipData[0] : null);
      const [key, setKey] = useState(0);

      useEffect(() => {
        if (tipData) {
          setCurrentTip(tipData[0]);
        }
      }, [tipId, tipData]);

      const refreshTip = () => {
        const currentIndex = tipData.indexOf(currentTip);
        const nextIndex = (currentIndex + 1) % tipData.length;
        setCurrentTip(tipData[nextIndex]);
        setKey(prevKey => prevKey + 1);
      };

      if (!tipInfo || !currentTip) {
        return (
          <div className="min-h-screen cosmic-bg flex items-center justify-center">
            <p className="text-white text-xl">Cosmic beauty tip not found!</p>
          </div>
        );
      }

      return (
        <>
          <Helmet><title>{tipInfo.title} - Skycial</title><meta name="description" content={tipInfo.description} /></Helmet>
          <div className="min-h-screen cosmic-bg">
            <Navigation />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Link to="/global-beauty" className="inline-flex items-center text-white/70 hover:text-white mb-8 group">
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  Back to Global Beauty Secrets
                </Link>

                <Card className="glass-card border-white/20 overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-4xl">{tipInfo.icon}</span>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold playfair text-white">{tipInfo.title}</CardTitle>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={refreshTip} className="text-white/70 hover:text-white hover:bg-white/10">
                      <RefreshCw className="w-5 h-5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-white/80 mb-6 text-lg">{tipInfo.description}</p>
                    <motion.div key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid md:grid-cols-2 gap-6 items-center">
                      <div className="space-y-4 text-white/90">
                        <p><strong>Core Principle:</strong> {currentTip.principle}</p>
                        <p><strong>Key Ingredients:</strong> {currentTip.ingredient}</p>
                        <p><strong>Signature Practice:</strong> {currentTip.practice}</p>
                      </div>
                      <img  class="w-full h-64 object-cover rounded-lg" alt={currentTip.image} src="https://images.unsplash.com/photo-1638913972776-873fc7af3fdf" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </>
      );
    };

    export default CulturalTipDetailPage;