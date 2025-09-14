-- Migration: Add driver onboarding fields to users table
-- Run this in your Supabase SQL Editor

-- Add missing columns for driver onboarding
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS driver_experience TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update existing drivers to have onboarding_completed = true if they have basic info
UPDATE users 
SET onboarding_completed = true 
WHERE role = 'Driver' 
AND full_name IS NOT NULL 
AND full_name != '' 
AND onboarding_completed IS NULL;
