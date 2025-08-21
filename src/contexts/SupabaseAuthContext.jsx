import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';

import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

// Helper function to map frontend camelCase names to database snake_case names
const mapToProfileColumns = (data) => {
  const payload = {};
  if (data.fullName) payload.full_name = data.fullName;
  // if (data.fullName) payload.last_name = data.fullName.split(' ')[1] || '';
  if (data.avatarUrl) payload.avatar_url = data.avatarUrl;
  if (data.age) payload.age = data.age;
  if (data.zodiacSign) payload.zodiac_sign = data.zodiacSign;
  if (data.skinType) payload.skin_type = data.skinType;
  if (data.gender) payload.gender = data.gender;
  if (data.birthDate) payload.birth_date = data.birthDate;
  if (data.birthTime) payload.birth_time = data.birthTime;
  if (data.birthPlace) payload.birth_place = data.birthPlace;
  return payload;
};


export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }

    return data;
  };

  const handleSession = useCallback(async (session) => {
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      const profile = await fetchUserProfile(currentUser.id);
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(
    async (email, password, options = {}) => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {  // Also changed this from profileData to options to match the function signature
          authData: {  // Changed this form data to authData to check if it was a variable naming issue, I guess it wasn't
            ...mapToProfileColumns(options)
          },
        },
      });

      console.log('Printing 1')
      console.log({authData});

      if (authError) {
        toast({
          variant: 'destructive',
          title: 'Sign up Failed',
          description: authError.message || 'Something went wrong',
        });
        return { error: authError };
      }

      if (!authData.user) {
        toast({
          variant: 'destructive',
          title: 'Sign up Incomplete',
          description: 'Could not create user. Please try again.',
        });
        return { error: 'User creation failed.' };
      }

      console.log('printing 2')

      const userId = authData?.user?.id;
      console.log('Printing 3')
      console.log({options});

      const profilePayload = mapToProfileColumns(options);

      console.log({profilePayload});
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: userId,
          email,
          friends: [],
          points: 100,
          total_advice_upvotes: 0,
          // full_name: options.fullName,
          // avatar_url: options.avatarUrl || '',
          ...profilePayload
        },
      ]);


      if (profileError) {
        toast({
          variant: 'destructive',
          title: 'Profile Creation Failed',
          description: profileError.message || 'Something went wrong',
        });
      }

      return { error: profileError };
    },
    [toast]
  );

  const signIn = useCallback(
    async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Sign in Failed',
          description: error.message || 'Something went wrong',
        });
        return { error };
      }

      const profile = await fetchUserProfile(data.user.id);
      setUserProfile(profile);

      return { error: null };
    },
    [toast]
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign out Failed',
        description: error.message || 'Something went wrong',
      });
    }

    return { error };
  }, [toast]);

  const value = useMemo(
    () => ({
      user,
      session,
      userProfile,
      loading,
      signUp,
      signIn,
      signOut,
    }),
    [user, session, userProfile, loading, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};