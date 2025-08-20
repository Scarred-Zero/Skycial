import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, User, Users, Star, Globe, Gift, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Navigation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('skycial_user');
    sessionStorage.removeItem('skycial_user');
    toast({
      title: "Logged out successfully! ✨",
      description: "See you soon, beautiful soul!",
    });
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/global-beauty', icon: Globe, label: 'Global Beauty' },
    { path: '/astrology', icon: Star, label: 'Astrology' },
    { path: '/rewards', icon: Gift, label: 'Rewards' },
  ];

  return (
    <nav className="glass-card border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-amber-500 rounded-full flex items-center justify-center cosmic-glow relative">
                <Star className="w-5 h-5 text-white" />
                <span className="absolute text-black font-bold text-[8px] -rotate-[30deg] playfair" style={{ transformOrigin: 'center' }}>Skycial</span>
            </div>
            <span className="text-xl font-bold gold-gradient-text playfair hidden sm:inline">Skycial</span>
          </Link>

          <div className="flex-1 min-w-0 px-2 sm:px-4">
            <div className="flex items-center space-x-1 overflow-x-auto hide-scrollbar">
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors flex-shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center"
                  >
                    <item.icon className="w-4 h-4 sm:mr-2" />
                    <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
                  </motion.div>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;