import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FriendSuggestions = () => {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('skycial_user'));
    if (storedUser) {
      setCurrentUser(storedUser);
      generateSuggestions(storedUser);
    }
  }, []);

  const generateSuggestions = (user) => {
    const allUsers = JSON.parse(localStorage.getItem('skycialUsers')) || [];
    const allFriendRequests = JSON.parse(localStorage.getItem('friendRequests')) || [];

    if (!user || !user.friends || user.friends.length === 0) {
      setSuggestions([]);
      return;
    }

    const friendsOfFriends = new Set();
    user.friends.forEach(friendEmail => {
      const friend = allUsers.find(u => u.email === friendEmail);
      if (friend && friend.friends) {
        friend.friends.forEach(fofEmail => {
          if (fofEmail !== user.email && !user.friends.includes(fofEmail)) {
            friendsOfFriends.add(fofEmail);
          }
        });
      }
    });

    const suggestionList = Array.from(friendsOfFriends)
      .map(email => allUsers.find(u => u.email === email))
      .filter(Boolean) // Filter out any undefined users
      .filter(suggestedUser => {
        // Exclude users with whom a request already exists
        const existingRequest = allFriendRequests.find(req =>
          (req.from === user.email && req.to === suggestedUser.email) ||
          (req.from === suggestedUser.email && req.to === user.email)
        );
        return !existingRequest;
      });

    setSuggestions(suggestionList.slice(0, 5)); // Limit to 5 suggestions
  };

  const sendFriendRequest = (toUser) => {
    if (!currentUser) return;

    const friendRequests = JSON.parse(localStorage.getItem('friendRequests')) || [];
    
    const newRequest = {
      id: Date.now(),
      from: currentUser.email,
      fromUserName: currentUser.fullName,
      fromUserAvatar: currentUser.avatarUrl,
      to: toUser.email,
      status: 'pending'
    };

    friendRequests.push(newRequest);
    localStorage.setItem('friendRequests', JSON.stringify(friendRequests));
    
    toast({
      title: "Friend Request Sent! 🚀",
      description: `Your request has been sent to ${toUser.fullName}.`,
    });

    // Refresh suggestions after sending a request
    generateSuggestions(currentUser);
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="glass-card p-6 rounded-xl"
    >
      <h2 className="text-2xl font-bold text-white playfair mb-4">People You May Know</h2>
      <ul className="space-y-3">
        {suggestions.map(user => (
          <li key={user.email} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 rounded-full">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">{user.fullName ? user.fullName[0] : '?'}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium text-white">{user.fullName}</span>
                <p className="text-xs text-white/60">Mutual Connections</p>
              </div>
            </div>
            <Button 
              onClick={() => sendFriendRequest(user)}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <UserPlus className="w-4 h-4 mr-2" /> Add
            </Button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default FriendSuggestions;