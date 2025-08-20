import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white z-[100]">
      <motion.div
        className="relative flex items-center justify-center"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1.5,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <Star className="w-24 h-24 text-yellow-400 fill-yellow-400" />
        <span 
          className="absolute text-black font-bold text-sm -rotate-[30deg] playfair" 
          style={{ transformOrigin: 'center' }}
        >
          Skycial
        </span>
      </motion.div>
      <p className="mt-4 text-lg font-medium playfair tracking-wider">{text}</p>
    </div>
  );
};

export default LoadingSpinner;