import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import HomePage from '@/pages/HomePage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import CommunityPage from '@/pages/CommunityPage';
import ProfilePage from '@/pages/ProfilePage';
import AstrologyPage from '@/pages/AstrologyPage';
import StarField from '@/components/StarField';
import SubmitAdvicePage from '@/pages/SubmitAdvicePage';
import RewardsPage from '@/pages/RewardsPage';
import CulturalTipsPage from '@/pages/CulturalTipsPage';
import CulturalTipDetailPage from '@/pages/CulturalTipDetailPage';
import AdminDashboard from '@/pages/AdminDashboard';
import FriendsPage from '@/pages/FriendsPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthProvider>
      <Helmet>
        <title>Skycial - Your Beauty, Powered by the Stars</title>
        <meta name="description" content="Join Skycial, the cosmic beauty community where you share photos, get advice, and discover your beauty potential through astrology. Your beauty, powered by the stars!" />
      </Helmet>
      <Router>
        <div className="min-h-screen relative">
          <StarField />
          {isLoading && <LoadingSpinner text="Summoning stardust and moonbeams..." />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage setIsLoading={setIsLoading} />} />
              <Route path="/community" element={<CommunityPage setIsLoading={setIsLoading} />} />
              <Route path="/profile" element={<ProfilePage setIsLoading={setIsLoading} />} />
              <Route path="/astrology" element={<AstrologyPage setIsLoading={setIsLoading} />} />
              <Route path="/submit-advice" element={<SubmitAdvicePage setIsLoading={setIsLoading} />} />
              <Route path="/rewards" element={<RewardsPage setIsLoading={setIsLoading} />} />
              <Route path="/friends" element={<FriendsPage setIsLoading={setIsLoading} />} />
              <Route path="/global-beauty" element={<CulturalTipsPage setIsLoading={setIsLoading} />} />
              <Route path="/cultural-tips/:tipId" element={<CulturalTipDetailPage setIsLoading={setIsLoading} />} />
              <Route path="/admin-dashboard" element={<AdminDashboard setIsLoading={setIsLoading} />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;