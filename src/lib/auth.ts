import { supabase, User } from './supabaseClient';
import * as bcrypt from 'bcryptjs';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: 'Passenger' | 'Driver';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Hash password function
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password function
const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Sign up new user
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', data.email)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }

    // Hash the password
    const hashedPassword = await hashPassword(data.password);

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email: data.email,
          password_hash: hashedPassword,
          full_name: data.fullName,
          role: data.role,
          is_verified: false,
          is_active: true,
        }
      ])
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    // Temporarily return without JWT token
    return {
      success: true,
      user: newUser
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

// Sign in existing user
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  try {
    // Get user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.email)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(data.password, user.password_hash);
    
    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    // Temporarily return without JWT token
    return {
      success: true,
      user: user
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

// Get current user (for auth state management)
export const getCurrentUser = async (userId: string): Promise<User | null> => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

// Simple user validation without JWT
export const validateTokenAndGetUser = async (userId: string): Promise<AuthResponse> => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      return {
        success: false,
        error: 'User not found or inactive'
      };
    }

    return {
      success: true,
      user: user
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<AuthResponse> => {
  try {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      user: updatedUser
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};
