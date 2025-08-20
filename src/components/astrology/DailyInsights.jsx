import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

const DailyInsights = ({ insights }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="mb-8"
    >
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white playfair flex items-center">
            <Star className="w-6 h-6 mr-2 text-yellow-400" />
            Today's Cosmic Insights
          </CardTitle>
          <CardDescription className="text-white/70">
            Personalized guidance for your beauty journey today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center p-4 rounded-lg bg-black/20 border border-white/10"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <insight.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{insight.title}</h3>
                <p className="text-white/70 text-sm">{insight.content}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyInsights;