import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import FriendSearch from '@/components/FriendSearch';
import FriendList from '@/components/FriendList';
import FriendSuggestions from '@/components/FriendSuggestions';
import { Button } from '@/components/ui/button';
import { Contact } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FriendsPage = () => {
  const { toast } = useToast();

  const handleImportContacts = () => {
    toast({
      title: "🚧 Feature in Development",
      description: "Importing contacts isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Find Friends - Skycial</title>
        <meta name="description" content="Search for and connect with friends on Skycial." />
      </Helmet>
      <div className="min-h-screen cosmic-bg">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FriendSearch />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <Button onClick={handleImportContacts} variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
              <Contact className="w-4 h-4 mr-2" /> Import Phone Contacts
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <FriendSuggestions />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <FriendList />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FriendsPage;