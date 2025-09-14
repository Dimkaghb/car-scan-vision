import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gwrvapseguvhpgpmczsy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cnZhcHNlZ3V2aHBncG1jenN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTU0MzYsImV4cCI6MjA3MzQzMTQzNn0.kgo0nXXhsnquEWmZUyg3IWnIOJPOchGeIPShcumKoPg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'Passenger' | 'Driver';
  full_name: string;
  phone_number?: string;
  profile_image_url?: string;
  is_verified: boolean;
  is_active: boolean;
  onboarding_completed?: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  
  // Driver-specific fields
  driver_license_number?: string;
  driver_experience?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_color?: string;
  vehicle_plate_number?: string;
  driver_rating?: number;
  total_rides?: number;
  
  // Passenger-specific fields
  passenger_rating?: number;
  total_trips?: number;
  
  // Location fields
  current_latitude?: number;
  current_longitude?: number;
  home_address?: string;
  work_address?: string;
  
  // Preferences
  preferred_payment_method?: string;
  notification_preferences?: any;
  
  // Emergency contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  
  // Additional metadata
  metadata?: any;
}
