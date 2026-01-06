import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole, AuthState, LoginCredentials, ROLE_ROUTES } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // Demo feature
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.full_name || email.split('@')[0],
        role: data.role as UserRole,
        institutionId: data.institution_id,
      };
    } catch (err) {
      console.error('Profile fetch transition error:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id, session.user.email!).then(user => {
          setState({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          });
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const user = await fetchUserProfile(session.user.id, session.user.email!);
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));

    if (!isSupabaseConfigured()) {
      // Fallback to demo logic for development if Supabase is not configured
      toast.info("Using demo login (Supabase not configured)");
      await new Promise(resolve => setTimeout(resolve, 1000));

      let role: UserRole = 'student';
      if (credentials.email === 'ADMINERP@gmail.com' || credentials.email.includes('admin')) role = 'admin';
      else if (credentials.email === 'INST@gmail.com' || credentials.email.includes('institution')) role = 'institution';
      else if (credentials.email.includes('STAFF') || credentials.email.includes('faculty')) role = 'faculty';
      else if (credentials.email === 'PARENT@gmail.com' || credentials.email.includes('parent')) role = 'parent';

      const demoUser: User = {
        id: 'DEMO001',
        email: credentials.email,
        name: 'Demo User',
        role: role,
      };

      setState({
        user: demoUser,
        isAuthenticated: true,
        isLoading: false,
      });
      navigate(ROLE_ROUTES[role]);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error(error.message);
      throw error;
    }

    const user = await fetchUserProfile(data.user.id, data.user.email!);
    if (user) {
      navigate(ROLE_ROUTES[user.role]);
    } else {
      toast.error("Profile not found. Contact administrator.");
      await supabase.auth.signOut();
    }
  }, [navigate, fetchUserProfile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate('/login');
  }, [navigate]);

  const switchRole = useCallback((role: UserRole) => {
    // Only for demo/testing purposes
    const demoUser: User = {
      id: 'DEMO_' + role.toUpperCase(),
      email: `${role}@demo.com`,
      name: `Demo ${role}`,
      role: role,
    };
    setState({
      user: demoUser,
      isAuthenticated: true,
      isLoading: false,
    });
    navigate(ROLE_ROUTES[role]);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
