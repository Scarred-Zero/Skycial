import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, UserMinus, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FriendList = () => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    loadFriendData();
    const interval = setInterval(loadFriendData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadFriendData = () => {
    const storedCurrentUser = JSON.parse(localStorage.getItem('skycial_user'));
    setCurrentUser(storedCurrentUser);

    const storedAllUsers = JSON.parse(localStorage.getItem('skycialUsers')) || [];
    setAllUsers(storedAllUsers);

    if (storedCurrentUser) {
      const allFriendRequests = JSON.parse(localStorage.getItem('friendRequests')) || [];
      
      const userFriends = storedCurrentUser.friends || [];
      const populatedFriends = userFriends.map(friendEmail => storedAllUsers.find(u => u.email === friendEmail)).filter(Boolean);
      setFriends(populatedFriends);

      const userPendingRequests = allFriendRequests.filter(
        req => req.to === storedCurrentUser.email && req.status === 'pending'
      );
      setPendingRequests(userPendingRequests);

      const userSentRequests = allFriendRequests.filter(
        req => req.from === storedCurrentUser.email && req.status === 'pending'
      );
      setSentRequests(userSentRequests);
    }
  };

  const handleAcceptRequest = (request) => {
    if (!currentUser) return;

    const allFriendRequests = JSON.parse(localStorage.getItem('friendRequests')) || [];
    const updatedRequests = allFriendRequests.map(req => 
      req.id === request.id ? { ...req, status: 'accepted' } : req
    );
    localStorage.setItem('friendRequests', JSON.stringify(updatedRequests));

    const updatedAllUsers = allUsers.map(user => {
      if (user.email === currentUser.email) {
        const updatedFriends = user.friends ? [...user.friends, request.from] : [request.from];
        return { ...user, friends: updatedFriends };
      }
      if (user.email === request.from) {
        const updatedFriends = user.friends ? [...user.friends, currentUser.email] : [currentUser.email];
        return { ...user, friends: updatedFriends };
      }
      return user;
    });
    localStorage.setItem('skycialUsers', JSON.stringify(updatedAllUsers));

    const updatedCurrentUser = updatedAllUsers.find(u => u.email === currentUser.email);
    localStorage.setItem('skycial_user', JSON.stringify(updatedCurrentUser));
    
    toast({
      title: "Friend Request Accepted! 🎉",
      description: `You are now friends with ${request.fromUserName}.`,
    });
    loadFriendData();
  };

  const handleDeclineRequest = (request) => {
    const allFriendRequests = JSON.parse(localStorage.getItem('friendRequests')) || [];
    const updatedRequests = allFriendRequests.filter(req => req.id !== request.id);
    localStorage.setItem('friendRequests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Friend Request Declined",
      description: `You declined the request from ${request.fromUserName}.`,
    });
    loadFriendData();
  };

  const handleRemoveFriend = (friendEmail) => {
    if (!currentUser) return;

    const updatedAllUsers = allUsers.map(user => {
      if (user.email === currentUser.email) {
        return { ...user, friends: user.friends.filter(email => email !== friendEmail) };
      }
      if (user.email === friendEmail) {
        return { ...user, friends: user.friends.filter(email => email !== currentUser.email) };
      }
      return user;
    });
    localStorage.setItem('skycialUsers', JSON.stringify(updatedAllUsers));

    const updatedCurrentUser = updatedAllUsers.find(u => u.email === currentUser.email);
    localStorage.setItem('skycial_user', JSON.stringify(updatedCurrentUser));

    const friendName = allUsers.find(u => u.email === friendEmail)?.fullName;
    toast({
      title: "Friend Removed 💔",
      description: `You are no longer friends with ${friendName}.`,
    });
    loadFriendData();
  };

  const getUserInfo = (email) => {
    return allUsers.find(u => u.email === email);
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white playfair mb-4">Friend Requests ({pendingRequests.length})</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-white/70">No pending friend requests.</p>
        ) : (
          <ul className="space-y-3">
            {pendingRequests.map(request => (
              <li key={request.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 rounded-full">
                    <AvatarImage src={request.fromUserAvatar} />
                    <AvatarFallback className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">{request.fromUserName ? request.fromUserName[0] : '?'}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-white">{request.fromUserName}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleAcceptRequest(request)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm">Accept</Button>
                  <Button onClick={() => handleDeclineRequest(request)} variant="outline" className="border-white/30 text-white hover:bg-white/10 px-3 py-1 text-sm">Decline</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white playfair mb-4">Your Friends ({friends.length})</h2>
        {friends.length === 0 ? (
          <p className="text-white/70">You don't have any friends yet. Use the search above to find some!</p>
        ) : (
          <ul className="space-y-3">
            {friends.map(friend => (
              <li key={friend.email} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 rounded-full">
                    <AvatarImage src={friend.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">{friend.fullName ? friend.fullName[0] : '?'}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-white">{friend.fullName}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" className="text-white/70 hover:text-blue-400 hover:bg-white/10 px-3 py-1 text-sm">
                    <MessageCircle className="w-4 h-4 mr-1" /> Message
                  </Button>
                  <Button onClick={() => handleRemoveFriend(friend.email)} variant="outline" className="border-white/30 text-white hover:bg-white/10 px-3 py-1 text-sm">
                    <UserMinus className="w-4 h-4 mr-1" /> Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white playfair mb-4">Sent Requests ({sentRequests.length})</h2>
        {sentRequests.length === 0 ? (
          <p className="text-white/70">No pending friend requests sent by you.</p>
        ) : (
          <ul className="space-y-3">
            {sentRequests.map(request => {
              const toUserInfo = getUserInfo(request.to);
              return (
                <li key={request.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-full">
                      <AvatarImage src={toUserInfo?.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">{toUserInfo?.fullName ? toUserInfo.fullName[0] : '?'}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-white">{toUserInfo?.fullName}</span>
                  </div>
                  <span className="text-white/60 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Pending
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendList;