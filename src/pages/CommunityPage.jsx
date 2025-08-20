import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, Share2, Camera, ShieldAlert, Send, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import { supabase } from '@/lib/customSupabaseClient';
import { timeAgo } from '@/lib/timeUtils';
import {
  getUser,
  getPersonalizedPosts,
  getCommentsForPost,
  togglePostLike,
  toggleCommentLike,
  addComment,
  reportPost,
  sharePost,
} from '@/lib/supabaseData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// A more self-contained PostCard component
const PostCard = ({ post, onSelectPost, user }) => {
  return (
    <Card
      className="glass-card border-white/20 overflow-hidden break-inside-avoid cursor-pointer hover:border-white/40 transition-all duration-300"
      onClick={() => onSelectPost(post)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10 rounded-lg flex-shrink-0">
            <AvatarImage src={post.avatar_url} />
            <AvatarFallback>{(post?.user?.charAt(0) || 'S').toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold text-white text-sm">{post.user}</span>
                <span className="text-xs text-white/60 ml-2">{timeAgo(post.created_at)}</span>
              </div>
            </div>
            <p className="text-white/80 my-2 text-sm line-clamp-3">
              {post.content}
            </p>
            {post.image_url && (
              <div className="mt-2 rounded-md overflow-hidden">
                <img
                  className="w-full h-auto object-cover"
                  alt=""
                  src={post.image_url}
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags && post.tags.map((tag) => (
                <span key={tag} className="mt-2 px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                  <Tag className="w-3 h-3 mr-1" /> {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-4 text-xs text-white/70 mt-3">
              <div className="flex items-center"><Heart className="w-3 h-3 mr-1.5" /> {post.likes_count || 0}</div>
              <div className="flex items-center"><MessageCircle className="w-3 h-3 mr-1.5" /> {post.comments_count || 0}</div>
              <div className="flex items-center"><Share2 className="w-3 h-3 mr-1.5" /> {post.shares || 0}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// The detailed view of a selected post
const MainPost = ({
  post,
  user,
  comments,
  commentText,
  onCommentChange,
  onCommentSubmit,
  onLike,
  onCommentLike,
  onReport,
  onShare,
}) => {
  if (!post) return null;

  return (
    // RESPONSIVENESS: The post is now only sticky on large screens (lg) and up.
    <div className="lg:sticky top-24">
      <Card className="glass-card border-white/20 overflow-hidden">
        {post.image_url && (
          <div className="p-4 pb-0">
            <img
              className="w-full h-auto object-cover rounded-lg"
              src={post.image_url}
              alt={post.content}
            />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex-shrink-0">
              <AvatarImage src={post?.avatar_url} />
              <AvatarFallback>{(post?.user?.charAt(0) || 'S').toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-white">{post.user}</span>
                  <span className="text-sm text-white/60 ml-2">{timeAgo(post.created_at)}</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white/50 hover:text-red-500"><ShieldAlert className="w-4 h-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-black/80 backdrop-blur-lg border-white/20 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Report Post?</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/70">This will submit the post for review by our moderators.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-white/30 hover:bg-white/10">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onReport(post.id)} className="bg-red-600 hover:bg-red-700">Report</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <p className="text-white/90 my-3">{post.content}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags && post.tags.map((tag) => (
                  <span key={tag} className="flex items-center px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                    <Tag className="w-3 h-3 mr-1" /> {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-y-2 gap-x-4 md:gap-x-6 border-t border-b border-white/10 py-2 my-4">
                <Button variant="ghost" size="sm" onClick={() => onLike(post.id)} className={`text-white/70 hover:bg-white/10 ${post.user_has_liked ? 'text-pink-400' : ''}`}>
                  <motion.span animate={{ scale: post.user_has_liked ? [1, 1.2, 1] : 1 }}><Heart className={`w-4 h-4 mr-2 ${post.user_has_liked ? 'fill-current' : ''}`} /></motion.span>
                  {post.likes_count || 0} Likes
                </Button>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-blue-400 hover:bg-white/10">
                  <MessageCircle className="w-4 h-4 mr-2" /> {post.comments_count || 0} Comments
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onShare(post.id)} className="text-white/70 hover:text-green-400 hover:bg-white/10">
                  <Share2 className="w-4 h-4 mr-2" /> {post.shares || 0} Shares
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Textarea value={commentText} onChange={onCommentChange} placeholder="Add a cosmic comment..." className="bg-black/20 border-white/20 text-white placeholder:text-white/50 text-sm h-10 resize-none" />
                <Button size="icon" onClick={onCommentSubmit} disabled={!commentText?.trim()} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
                {comments.map((comment) => (
                  <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start space-x-3 text-sm">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={comment.profile?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs">{(comment.profile?.full_name?.charAt(0) || 'U').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-white/5 p-2 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold text-white/90">{comment.profile?.full_name || 'Anonymous'}</span>
                          <p className="text-white/80">{comment.comment_text}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => onCommentLike(comment.id)} className={`text-white/50 h-auto p-0 hover:text-pink-400 ${comment.user_has_liked ? 'text-pink-400' : ''}`}>
                          <Heart className={`w-3 h-3 mr-1 ${comment.user_has_liked ? 'fill-current' : ''}`} /> {comment.likes_count || 0}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


const CommunityPage = ({ setIsLoading }) => {
  const { toast } = useToast();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const patchPostState = useCallback((postId, updates) => {
    const applyUpdates = (post) => ({ ...post, ...updates(post) });
    setPosts(prev => prev.map(p => p.id === postId ? applyUpdates(p) : p));
    setSelectedPost(prev => prev?.id === postId ? applyUpdates(prev) : prev);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setIsLoading?.(true);
      const currentUser = await getUser();
      setUser(currentUser);
      const fetchedPosts = await getPersonalizedPosts(currentUser?.id);
      setPosts(fetchedPosts);
      const queryParams = new URLSearchParams(location.search);
      const postIdFromUrl = queryParams.get('post');
      let postToSelect = null;
      if (postIdFromUrl) {
        postToSelect = fetchedPosts.find(p => p.id === postIdFromUrl);
      }
      if (!postToSelect && fetchedPosts.length > 0) {
        postToSelect = fetchedPosts[0];
      }
      setSelectedPost(postToSelect);
      setLoading(false);
      setIsLoading?.(false);
    };
    fetchData();
  }, [setIsLoading, location.search]);

  useEffect(() => {
    if (!selectedPost) return;
    const fetchComments = async () => {
      const fetchedComments = await getCommentsForPost(selectedPost.id, user?.id);
      setComments(fetchedComments);
    };
    fetchComments();
  }, [selectedPost, user?.id]);

  useEffect(() => {
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' },
        (payload) => {
          if (payload.new.updated_by !== user?.id) {
            patchPostState(payload.new.id, () => payload.new);
          }
        }
      )
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.user_id)
            .single();
          const enrichedPost = {
            ...payload.new,
            user: profile?.full_name || 'Anonymous',
            avatar_url: profile?.avatar_url,
            user_has_liked: false,
          };
          setPosts(prev => [enrichedPost, ...prev]);
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [patchPostState, user?.id]);

  const handleLike = useCallback(async (postId) => {
    if (!user) return toast({ variant: "destructive", title: "Please log in to like posts." });
    patchPostState(postId, (post) => ({
      user_has_liked: !post.user_has_liked,
      likes_count: post.user_has_liked ? (post.likes_count || 1) - 1 : (post.likes_count || 0) + 1,
    }));
    const { error } = await togglePostLike(postId, user.id);
    if (error) toast({ variant: "destructive", title: "Failed to update like." });
  }, [user, patchPostState, toast]);

  const handleCommentLike = useCallback(async (commentId) => {
    if (!user) return toast({ variant: "destructive", title: "Please log in to like comments." });
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          user_has_liked: !c.user_has_liked,
          likes_count: c.user_has_liked ? (c.likes_count || 1) - 1 : (c.likes_count || 0) + 1,
        };
      }
      return c;
    }));
    await toggleCommentLike(commentId, user.id);
  }, [user, toast]);

  const handleCommentSubmit = useCallback(async () => {
    if (!user) return toast({ variant: "destructive", title: "Please log in to comment." });
    if (!commentText.trim()) return;
    const { error } = await addComment(selectedPost.id, user.id, commentText);
    if (error) {
      toast({ variant: "destructive", title: "Failed to post comment." });
    } else {
      setCommentText('');
      const fetchedComments = await getCommentsForPost(selectedPost.id, user.id);
      setComments(fetchedComments);
    }
  }, [user, selectedPost, commentText, toast]);

  const handleReport = useCallback(async (postId) => {
    await reportPost(postId, user.id, 'User reported post');
    toast({ title: "Post Reported", description: "Thank you for keeping our community safe." });
  }, [user, toast]);

  const handleShare = useCallback(async (postId) => {
    if (!user) return toast({ variant: "destructive", title: "Please log in to share." });
    const postUrl = `${window.location.origin}/community?post=${postId}`;
    try {
      const textArea = document.createElement('textarea');
      textArea.value = postUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      patchPostState(postId, (p) => ({ shares: (p.shares || 0) + 1 }));
      const { error } = await sharePost(postId);
      if (error) {
        toast({ variant: "destructive", title: "Failed to update share count." });
      } else {
        toast({ title: "Copied!", description: "Post link copied to your clipboard." });
      }
    } catch (err) {
      console.error('Failed to copy link: ', err);
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy the link." });
    }
  }, [user, patchPostState, toast]);

  const filteredPosts = useMemo(() => posts.filter(post => {
    const term = searchTerm.toLowerCase();
    return post.content.toLowerCase().includes(term) || (post.tags || []).some(tag => tag.toLowerCase().includes(term));
  }), [posts, searchTerm]);

  if (loading) return null;

  return (
    <>
      <Helmet><title>Community - Skycial</title></Helmet>
      <div className="min-h-screen cosmic-bg">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="text-center mb-6">
              {/* RESPONSIVENESS: Font sizes adjust for smaller screens. */}
              <h1 className="text-3xl md:text-4xl font-bold text-white playfair gold-gradient-text mb-2">Beauty Community</h1>
              <p className="text-white/70 text-base md:text-lg">Your personalized feed of cosmic beauty trends and tips.</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
                  <Input placeholder="Search posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-black/20 border-white/20 text-white w-full" />
                </div>
                <Link to="/submit-advice" className="w-full sm:w-auto">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-full"><Camera className="w-4 h-4 mr-2" />Share Your Beauty</Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* RESPONSIVENESS: The main layout is now a flex container. It stacks vertically on mobile and goes to a row on large screens. */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full lg:w-2/3">
              <AnimatePresence>
                {selectedPost ? (
                  <motion.div key={selectedPost.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <MainPost
                      post={selectedPost}
                      user={user}
                      comments={comments}
                      commentText={commentText}
                      onCommentChange={(e) => setCommentText(e.target.value)}
                      onCommentSubmit={handleCommentSubmit}
                      onLike={handleLike}
                      onCommentLike={handleCommentLike}
                      onReport={handleReport}
                      onShare={handleShare}
                    />
                  </motion.div>
                ) : (
                  <div className="text-center py-12 glass-card rounded-lg"><p className="text-white/70">Select a post to view details.</p></div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full lg:w-1/3 space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-white playfair">More From The Cosmos</h2>
              <AnimatePresence>
                {filteredPosts.filter(p => p.id !== selectedPost?.id).slice(0, 10).map((post, index) => (
                  <motion.div key={post.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.05 }}>
                    <PostCard post={post} onSelectPost={setSelectedPost} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredPosts.length === 0 && (
                <div className="text-center py-12 glass-card rounded-lg"><p className="text-white/70">No cosmic whispers found.</p></div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityPage;
