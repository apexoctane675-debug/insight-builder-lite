import { supabase } from '@/integrations/supabase/client';
import { User, LoginData, SignupData } from '@/types/auth';

export class AuthService {
  static async getCurrentUser(): Promise<User | null> {
    try {
      console.log('AuthService: Getting current user...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('AuthService: Auth user result:', { hasUser: !!user, userId: user?.id });
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return null;

      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        createdAt: profile.created_at,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async login(data: LoginData): Promise<User> {
    console.log('AuthService: Attempting login for:', data.email);
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    console.log('AuthService: Login result:', { hasUser: !!authData.user, error: error?.message });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.user) {
      throw new Error('Login failed');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      createdAt: profile.created_at,
    };
  }

  static async signup(data: SignupData): Promise<User> {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.user) {
      throw new Error('Signup failed');
    }

    // The profile will be created automatically by the trigger
    return {
      id: authData.user.id,
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString(),
    };
  }

  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: userData.name,
        email: userData.email,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      createdAt: data.created_at,
    };
  }
}