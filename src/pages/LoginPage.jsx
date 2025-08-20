import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { handleDailyLogin, loginUser } from '@/lib/supabaseData';
import PasswordInput from '@/components/PasswordInput';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('remember_email');
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanEmail = email.trim();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      toast({
        variant: 'destructive',
        title: 'Missing details',
        description: 'Please provide both email and password.',
      });
      return;
    }

    setLoading(true);
    try {
      const { user, error } = await loginUser(cleanEmail, cleanPassword);

      if (error || !user) {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: error?.message === 'Invalid login credentials'
            ? 'Invalid email or password. Please try again.'
            : error?.message || 'Invalid login credentials. Please try again.',
        });
        setLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem('remember_email', cleanEmail);
      } else {
        localStorage.removeItem('remember_email');
      }

      try {
        await handleDailyLogin(user.id);
      } catch (e) {
        // Optionally log or ignore daily login errors
        console.error('Daily login error:', e);
        toast({
          variant: 'destructive',
          title: 'Daily Login Error',
          description: 'There was an issue recording your daily login. Please try again later.',
        });
      }

      toast({
        title: 'Welcome back! ✨',
        description: "You've successfully logged in. Let's explore the cosmos!",
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      toast({
        variant: 'destructive',
        title: 'Unexpected Error',
        description: err?.message || 'Something went wrong. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Skycial</title>
        <meta
          name="description"
          content="Login to your Skycial account and continue your cosmic beauty journey."
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4 cosmic-bg">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 rounded-2xl">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-4" aria-label="Go to home">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-300 to-amber-500 rounded-full flex items-center justify-center cosmic-glow mx-auto">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </Link>
              <h1 className="text-3xl font-bold playfair gold-gradient-text">Welcome Back, Star</h1>
              <p className="text-white/70 mt-2">Log in to continue your cosmic journey.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@cosmic.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/20 border border-white/20 text-white placeholder:text-white/50"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <PasswordInput
                  id="password"
                  placeholder="Enter your cosmic key"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/20 border border-white/20 text-white placeholder:text-white/50"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(Boolean(v))}
                    className="border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  />
                  <Label htmlFor="remember-me" className="text-sm text-white/70">
                    Remember me
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 disabled:opacity-60"
              >
                {loading ? 'Logging in…' : 'Log In'}
              </Button>
            </form>

            <p className="text-center text-white/60 mt-8">
              New to Skycial?{' '}
              <Link to="/register" className="font-semibold text-yellow-400 hover:text-yellow-300">
                Join the Stars
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;