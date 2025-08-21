import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Calendar, Clock, MapPin, ShieldCheck, Droplets, Sun, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import FormField from '@/components/FormField';
import ErrorMessage from '@/components/ErrorMessage';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Helper function to calculate age based on birth date and time
const calculateAge = (birthDate, birthTime) => {
  if (!birthDate) return '';

  const today = new Date();
  const birthDateObj = new Date(birthDate);

  // Set the time if provided, otherwise default to a conservative 00:00 to calculate full years
  if (birthTime) {
    const [hours, minutes] = birthTime.split(':').map(Number);
    birthDateObj.setHours(hours, minutes, 0, 0);
  }

  let age = today.getFullYear() - birthDateObj.getFullYear();
  const m = today.getMonth() - birthDateObj.getMonth();

  // Adjust age if the birth month hasn't passed yet, or if it's the same month and the day hasn't passed yet
  if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  // Final check with time if available, to handle the exact birthday moment
  if (birthTime) {
    const h = today.getHours() - birthDateObj.getHours();
    const min = today.getMinutes() - birthDateObj.getMinutes();
    if (m === 0 && today.getDate() === birthDateObj.getDate() && (h < 0 || (h === 0 && min < 0))) {
      age--;
    }
  }

  // Ensure age is not negative in case of future dates
  return Math.max(0, age);
};

// Helper function to determine the zodiac sign based on the birth date
const getZodiacSign = (date) => {
  if (!date) return '';

  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1; // getMonth() is 0-indexed
  const day = dateObj.getDate();

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius ♒';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces ♓';
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries ♈';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus ♉';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini ♊';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer ♋';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo ♌';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo ♍';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra ♎';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio ♏';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius ♐';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn ♑';

  return '';
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    zodiacSign: '',
    skinType: '',
    gender: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const zodiacSigns = [
    'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋', 'Leo ♌', 'Virgo ♍',
    'Libra ♎', 'Scorpio ♏', 'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
  ];

  const skinTypes = [
    { value: 'oily', label: 'Oily', icon: Droplets },
    { value: 'dry', label: 'Dry', icon: Sun },
    { value: 'combo', label: 'Combination', icon: Cloud },
  ];

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };

      if (name === 'birthDate' || name === 'birthTime') {
        const newBirthDate = newFormData.birthDate;
        const newBirthTime = newFormData.birthTime;

        if (newBirthDate && newBirthTime) {
          const calculatedAge = calculateAge(newBirthDate, newBirthTime);
          newFormData.age = calculatedAge.toString();
        } else if (name === 'birthDate' && newBirthDate) {
          const calculatedAge = calculateAge(newBirthDate, '');
          newFormData.age = calculatedAge.toString();
        }

        if (newBirthDate) {
          newFormData.zodiacSign = getZodiacSign(newBirthDate);
        }
      }

      return newFormData;
    });
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const validate = useCallback(() => {
    const tempErrors = {};
    if (!formData.fullName) tempErrors.fullName = 'Full name is required.';
    if (!formData.email) {
      tempErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is not valid.';
    }

    if (!formData.age) {
      tempErrors.age = 'Age is required. Please provide a value or your birth date.';
    } else if (parseInt(formData.age, 10) < 13) {
      tempErrors.age = 'You must be at least 13 years old to join.';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.zodiacSign || formData.zodiacSign.trim() === '') {
      tempErrors.zodiacSign = 'Please select your zodiac sign or enter your birth date to have it auto-filled.';
    }

    if (!formData.skinType || formData.skinType.trim() === '') {
      tempErrors.skinType = 'Please select your skin type.';
    }

    if (!formData.gender || formData.gender.trim() === '') {
      tempErrors.gender = 'Please select your gender.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const { email, password } = formData;

    try {
      // Create profile data object excluding password
      const { password: _password, confirmPassword: _confirmPassword, ...options } = formData;
      
      // Ensure avatarUrl has a default value
      options.avatarUrl = options.avatarUrl || "";
      
      const result = await signUp(email, password, options);
      const authError = result?.error || result?.data?.user === null;

      if (authError) {
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: result?.error?.message || 'Could not create account. The email may already be in use.',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Welcome to Skycial! Check your inbox! 📧',
        description: "We sent you a verification email. Please verify before logging in.",
      });

      navigate('/login');

    } catch (err) {
      console.error('Registration error:', err);
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
        <title>Join Skycial - Your Beauty, Powered by the Stars</title>
        <meta
          name="description"
          content="Create your Skycial account and start your cosmic beauty journey. Share photos, get advice, and discover your stellar potential."
        />
      </Helmet>

      <div className="min-h-screen cosmic-bg flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg"
        >
          <Card className="glass-card border-white/20">
            <CardHeader className="text-center">
              <Link to="/" className="flex justify-center mb-4" aria-label="Go to home">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-300 to-amber-500 rounded-full flex items-center justify-center cosmic-glow">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </Link>
              <CardTitle className="text-2xl playfair gold-gradient-text">Join Skycial</CardTitle>
              <CardDescription className="text-white/70">
                Start your cosmic beauty journey today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    id="fullName"
                    name="fullName"
                    label="Full Name"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={errors.fullName}
                    placeholder="Your Name"
                    required
                  />
                  <FormField
                    id="age"
                    name="age"
                    label="Age (13+)"
                    type="number"
                    min="13"
                    value={formData.age}
                    onChange={handleInputChange}
                    error={errors.age}
                    placeholder="Your Age"
                    required
                  />
                </div>

                <FormField
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder="your.email@example.com"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    placeholder="Min 6 chars"
                    required
                  />
                  <FormField
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zodiacSign" className="text-white/90">Zodiac Sign</Label>
                  <Select
                    value={formData.zodiacSign}
                    onValueChange={(value) => handleSelectChange('zodiacSign', value)}
                  >
                    <SelectTrigger className={`bg-black/20 border-white/20 text-white ${errors.zodiacSign ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select your sign" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20 text-white">
                      <SelectGroup>
                        {zodiacSigns.map(sign => (
                          <SelectItem key={sign} value={sign} className="focus:bg-white/10">{sign}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.zodiacSign && <ErrorMessage message={errors.zodiacSign} />}
                </div>

                <div className="space-y-2">
                  <Label className="text-white/90">Skin Type</Label>
                  <div className={`grid grid-cols-3 gap-2 glass-card p-1 rounded-lg ${errors.skinType ? 'border border-red-500' : ''}`}>
                    {skinTypes.map(type => (
                      <Button
                        key={type.value}
                        type="button"
                        onClick={() => handleSelectChange('skinType', type.value)}
                        variant={formData.skinType === type.value ? 'default' : 'ghost'}
                        className={`h-auto py-2 flex-col gap-1 ${formData.skinType === type.value ? 'bg-white/20' : 'text-white/70'}`}
                      >
                        <type.icon className="w-5 h-5" />
                        <span className="text-xs">{type.label}</span>
                      </Button>
                    ))}
                  </div>
                  {errors.skinType && <ErrorMessage message={errors.skinType} />}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-white/90">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger className={`bg-black/20 border-white/20 text-white ${errors.gender ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20 text-white">
                      <SelectGroup>
                        <SelectItem value="female" className="focus:bg-white/10">Female</SelectItem>
                        <SelectItem value="male" className="focus:bg-white/10">Male</SelectItem>
                        <SelectItem value="other" className="focus:bg-white/10">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.gender && <ErrorMessage message={errors.gender} />}
                </div>

                <div className="border-t border-white/20 pt-4">
                  <p className="text-sm text-white/70 mb-4">
                    <Star className="w-4 h-4 inline mr-1" />
                    Birth details for personalized astrology (optional)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      id="birthDate"
                      name="birthDate"
                      label="Birth Date"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      icon={<Calendar className="w-4 h-4 mr-2" />}
                    />
                    <FormField
                      id="birthTime"
                      name="birthTime"
                      label="Birth Time"
                      type="time"
                      value={formData.birthTime}
                      onChange={handleInputChange}
                      icon={<Clock className="w-4 h-4 mr-2" />}
                    />
                  </div>
                  <FormField
                    id="birthPlace"
                    name="birthPlace"
                    label="Birth Place"
                    type="text"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    icon={<MapPin className="w-4 h-4 mr-2" />}
                  />
                </div>

                <div className="flex items-start space-x-2 pt-4">
                  <ShieldCheck className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                  <p className="text-xs text-white/60">
                    By joining, you agree to our terms and our commitment to a positive, bully-free community.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white cosmic-glow"
                >
                  <Star className="w-4 h-4 mr-2" />
                  {loading ? 'Creating account…' : 'Join the Stars'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/70">
                  Already have an account?{' '}
                  <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">Sign in here</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;