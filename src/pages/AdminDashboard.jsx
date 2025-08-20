import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Skycial</title>
        <meta name="description" content="Skycial administrative dashboard." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4 cosmic-bg">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-md text-center"
        >
          <div className="glass-card p-8 rounded-2xl">
            <h1 className="text-3xl font-bold playfair gold-gradient-text mb-4">Admin Dashboard</h1>
            <p className="text-white/70">
              🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboard;