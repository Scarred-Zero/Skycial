import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Camera, Upload, Send, Loader2, Globe, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import { createNewPost, getUser } from '@/lib/supabaseData';
import Compressor from 'compressorjs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SubmitAdvicePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [privacy, setPrivacy] = useState('global');
  const [user, setUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      const currentUser = await getUser();
      if (isMounted) {
        if (currentUser) {
          setUser(currentUser);
        } else {
          toast({ variant: "destructive", title: "Not logged in", description: "Please log in to submit advice." });
          navigate('/login');
        }
      }
    };
    fetchUser();
    return () => { isMounted = false; };
  }, [navigate, toast]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({ variant: "destructive", title: "Invalid File Type", description: "Only PNG, JPEG, or WEBP images are allowed." });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File Too Large", description: "Maximum image size is 2MB." });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (fileToUpload) => {
    const apiKey = import.meta.env.VITE_IMGBB_KEY;
    if (!apiKey) {
      toast({ variant: "destructive", title: "API Key Missing!", description: "Image upload service is not configured." });
      return null;
    }
    const formData = new FormData();
    formData.append('image', fileToUpload);
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        return result.data.url;
      } else {
        throw new Error(result.error?.message || "Unknown error");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload your image. Please try again." });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({ variant: "destructive", title: "Oops!", description: "Please write something before submitting." });
      return;
    }
    if (!user) {
      toast({ variant: "destructive", title: "Not logged in", description: "Please log in to submit advice." });
      return;
    }
    setIsUploading(true);

    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await new Promise((resolve, reject) => {
          new Compressor(imageFile, {
            quality: 0.8,
            maxWidth: 1024,
            maxHeight: 1024,
            async success(compressedResult) {
              const url = await uploadImage(compressedResult);
              resolve(url);
            },
            error(err) {
              toast({ variant: "destructive", title: "Compression Failed", description: err.message });
              reject(err);
            },
          });
        });
      } catch {
        setIsUploading(false);
        return;
      }
    }

    // Pass the entire user object to the function
    const result = await createNewPost(content, imageUrl, user, privacy);
    setIsUploading(false);

    if (!result || !result.success) {
      console.error("Post submission failed:", result?.error);
      toast({
        variant: "destructive",
        title: "Post Failed",
        description: result?.error || "Could not submit your post. Please try again."
      });
      return;
    }

    toast({
      title: "Post Submitted! ✨",
      description: "Your post is now live in the community. You've earned 25 points!",
    });

    navigate('/community');
  };

  return (
    <>
      <Helmet>
        <title>Share Your Journey - Skycial</title>
        <meta name="description" content="Share a photo and ask for beauty advice from the Skycial community." />
      </Helmet>

      <div className="min-h-screen cosmic-bg">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Card className="glass-card border-white/20">
              <CardHeader className="text-center">
                <Camera className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                <CardTitle className="text-3xl font-bold playfair gold-gradient-text">Share Your Journey</CardTitle>
                <CardDescription className="text-white/70 text-lg">Ask for advice or share your results with the community.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="photo-upload" className="block text-sm font-medium text-white/80 mb-2">Upload a Photo (optional)</label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-white/30 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {imagePreview ? (
                          <img className="w-48 h-48 object-cover rounded-md mx-auto" alt="Selected preview" src={imagePreview} />
                        ) : (
                          <Upload className="mx-auto h-12 w-12 text-white/50" />
                        )}
                        <div className="flex text-sm text-white/60">
                          <label htmlFor="photo-upload" className="relative cursor-pointer bg-black/20 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 px-1">
                            <span>Upload a file</span>
                            <input id="photo-upload" name="photo-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-white/50">PNG, JPG, WEBP up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-white/80 mb-2">Your Message</label>
                    <Textarea id="content" rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="e.g., 'What kind of blush would suit my skin tone?' or 'Check out my 30-day skincare progress!'" className="bg-black/20 border-white/20 text-white placeholder:text-white/50" required />
                  </div>

                  <div>
                    <label htmlFor="privacy" className="block text-sm font-medium text-white/80 mb-2">Post Visibility</label>
                    <Select value={privacy} onValueChange={setPrivacy}>
                      <SelectTrigger className="w-full bg-black/20 border-white/20 text-white">
                        <SelectValue placeholder="Select who can see this post" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/20 text-white">
                        <SelectGroup>
                          <SelectItem value="global" className="focus:bg-white/10">
                            <div className="flex items-center"><Globe className="w-4 h-4 mr-2" />Global Community</div>
                          </SelectItem>
                          <SelectItem value="friends" className="focus:bg-white/10">
                            <div className="flex items-center"><Users className="w-4 h-4 mr-2" />Friends Only</div>
                          </SelectItem>
                          <SelectItem value="private" className="focus:bg-white/10">
                            <div className="flex items-center"><Lock className="w-4 h-4 mr-2" />Private (Just Me)</div>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUploading} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 px-8">
                      {isUploading ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Posting...</>
                      ) : (
                        <><Send className="w-5 h-5 mr-2" /> Post to Community</>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SubmitAdvicePage;
