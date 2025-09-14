import { User } from '@/lib/supabaseClient';

/**
 * Check if a driver has completed onboarding
 * This function provides a consistent way to check onboarding status
 * across the application, handling both the onboarding_completed flag
 * and fallback checks for basic driver information.
 */
export const hasCompletedOnboarding = (user: User | null): boolean => {
  if (!user || user.role !== 'Driver') {
    return false;
  }

  // If the onboarding_completed flag exists and is true, they're done
  if (user.onboarding_completed === true) {
    return true;
  }

  // Fallback: Check if they have essential driver information
  // This handles cases where the onboarding_completed column doesn't exist
  // or wasn't properly set during the onboarding process
  const hasEssentialInfo = !!(
    user.driver_license_number && 
    user.full_name && 
    user.full_name.trim().length > 0
  );

  return hasEssentialInfo;
};

/**
 * Check if a driver needs to complete onboarding
 * This is the inverse of hasCompletedOnboarding
 */
export const needsOnboarding = (user: User | null): boolean => {
  return !hasCompletedOnboarding(user);
};

/**
 * Get the appropriate redirect path for a driver based on their onboarding status
 */
export const getDriverRedirectPath = (user: User | null): string => {
  if (!user || user.role !== 'Driver') {
    return '/map'; // Default for non-drivers
  }

  return hasCompletedOnboarding(user) ? '/driver-dashboard' : '/driver-onboarding';
};

/**
 * Check if a user should be allowed to access the driver dashboard
 */
export const canAccessDriverDashboard = (user: User | null): boolean => {
  return !!(user && user.role === 'Driver' && hasCompletedOnboarding(user));
};

/**
 * Check if a user should be redirected to onboarding
 */
export const shouldRedirectToOnboarding = (user: User | null): boolean => {
  return !!(user && user.role === 'Driver' && needsOnboarding(user));
};
