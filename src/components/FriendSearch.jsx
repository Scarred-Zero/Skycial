import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FriendSearch = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('skycial_user'));
    const allUsers = JSON.parse(localStorage.getItem('skycialUsers')) || [];

    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const results = allUsers.filter(user => 
      user.email !== currentUser.email &&
      (user.fullName.toLowerCase().includes(term) || user.email.toLowerCase().includes(term))
    );
    setSearchResults(results);
  };

  const sendFriendRequest = (toUser) => {
    const currentUser = JSON.parse(localStorage.getItem('skycial_user'));
    const friendRequests = JSON.parse(localStorage.getItem('friendRequests')) || [];
    
    const existingRequest = friendRequests.find(req => 
      (req.from === currentUser.email && req.to === toUser.email) ||
      (req.from === toUser.email && req.to === currentUser.email)
    );

    if (existingRequest) {
      toast({
        variant: "destructive",
        title: "Request Already Sent or Exists",
        description: `You already have a pending request with ${toUser.fullName}.`,
      });
      return;
    }

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

    const notifications = JSON.parse(localStorage.getItem('skycialNotifications')) || {};
    const recipientNotifications = notifications[toUser.email] || [];
    recipientNotifications.push({
      id: Date.now(),
      type: 'friend_request',
      fromUser: currentUser.email,
      fromUserName: currentUser.fullName,
      message: `${currentUser.fullName} sent you a friend request!`,
      read: false,
      timestamp: new Date().toISOString()
    });
    notifications[toUser.email] = recipientNotifications;
    localStorage.setItem('skycialNotifications', JSON.stringify(notifications));
    
    toast({
      title: "Friend Request Sent! 🚀",
      description: `Your request has been sent to ${toUser.fullName}.`,
    });
  };

  return (
    <div className="mb-6 glass-card p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-white playfair mb-4">Find Your Cosmic Circle</h2>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Find friends by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-black/20 border-white/20 text-white placeholder:text-white/50"
        />
        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">Search</Button>
      </form>
      <div className="mt-4">
        {searchResults.length > 0 ? (
          <ul className="space-y-3">
            {searchResults.map(user => (
              <li key={user.email} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="font-medium text-white">{user.fullName}</p>
                  <p className="text-sm text-white/60">{user.email}</p>
                </div>
                <Button 
                  onClick={() => sendFriendRequest(user)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Add Friend
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/50 text-center pt-4">No users found. Try another search.</p>
        )}
      </div>
    </div>
  );
};

export default FriendSearch;