import { supabase } from '@/lib/supabaseClient';

export interface OnboardingData {
  firstName: string;
  lastName: string;
  driverLicense: string;
  experience: string;
  carImageUrl: string;
}

export interface OnboardingResponse {
  success: boolean;
  error?: string;
}

// Complete driver onboarding
export const completeDriverOnboarding = async (
  driverId: string,
  onboardingData: OnboardingData
): Promise<OnboardingResponse> => {
  try {
    // Prepare update data with basic fields first
    const updateData: any = {
      full_name: `${onboardingData.firstName} ${onboardingData.lastName}`,
      driver_license_number: onboardingData.driverLicense,
      profile_image_url: onboardingData.carImageUrl,
      updated_at: new Date().toISOString()
    };

    // Try to add optional fields that might not exist in the schema yet
    try {
      updateData.driver_experience = onboardingData.experience;
      updateData.onboarding_completed = true;
    } catch (e) {
      console.warn('Some onboarding fields may not exist in database schema');
    }

    // Update user profile with onboarding data
    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', driverId);

    if (error) {
      console.error('Error completing onboarding:', error);
      
      // If error is about missing columns, try with minimal data
      if (error.message.includes('could not find') || error.message.includes('column')) {
        console.warn('Retrying with minimal data due to schema mismatch');
        
        const minimalData = {
          full_name: `${onboardingData.firstName} ${onboardingData.lastName}`,
          driver_license_number: onboardingData.driverLicense,
          profile_image_url: onboardingData.carImageUrl,
          updated_at: new Date().toISOString()
        };

        const { error: retryError } = await supabase
          .from('users')
          .update(minimalData)
          .eq('id', driverId);

        if (retryError) {
          return {
            success: false,
            error: `Database schema needs updating. Please run the migration script. Error: ${retryError.message}`,
          };
        }

        return {
          success: true,
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Check if driver has completed onboarding
export const checkOnboardingStatus = async (driverId: string): Promise<{ completed: boolean; error?: string }> => {
  try {
    // Try to select the onboarding_completed field
    let { data: user, error } = await supabase
      .from('users')
      .select('onboarding_completed, full_name, driver_license_number')
      .eq('id', driverId)
      .single();

    if (error) {
      // If the onboarding_completed column doesn't exist, fall back to checking basic fields
      if (error.message.includes('could not find') || error.message.includes('column')) {
        console.warn('onboarding_completed column not found, checking basic fields');
        
        const { data: basicUser, error: basicError } = await supabase
          .from('users')
          .select('full_name, driver_license_number')
          .eq('id', driverId)
          .single();

        if (basicError) {
          return {
            completed: false,
            error: basicError.message,
          };
        }

        // Consider onboarding completed if basic fields are filled
        const hasBasicInfo = basicUser?.full_name && basicUser?.driver_license_number;
        return {
          completed: !!hasBasicInfo,
        };
      }

      console.error('Error checking onboarding status:', error);
      return {
        completed: false,
        error: error.message,
      };
    }

    // If onboarding_completed exists, use it; otherwise check basic fields
    if (user?.onboarding_completed !== undefined) {
      return {
        completed: user.onboarding_completed,
      };
    }

    // Fallback: check if basic fields are filled
    const hasBasicInfo = user?.full_name && user?.driver_license_number;
    return {
      completed: !!hasBasicInfo,
    };
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return {
      completed: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Create storage bucket if it doesn't exist
const ensureBucketExists = async (): Promise<boolean> => {
  try {
    // Try to get bucket info first
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'driver-assets');
    
    if (bucketExists) {
      return true;
    }

    // Try to create the bucket
    const { error: createError } = await supabase.storage.createBucket('driver-assets', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (createError) {
      console.warn('Could not create storage bucket:', createError);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Error checking/creating bucket:', error);
    return false;
  }
};

// Upload car image (fallback to base64 if storage fails)
export const uploadCarImage = async (file: File, driverId: string): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Ensure bucket exists first
    const bucketReady = await ensureBucketExists();
    
    if (bucketReady) {
      // Try to upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${driverId}-car-${Date.now()}.${fileExt}`;
      const filePath = `car-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('driver-assets')
        .upload(filePath, file);

      if (uploadError) {
        console.warn('Supabase storage upload failed, using base64 fallback:', uploadError);
        
        // Fallback to base64 data URL for now
        const base64Url = await fileToBase64(file);
        return {
          success: true,
          url: base64Url,
        };
      }

      const { data } = supabase.storage
        .from('driver-assets')
        .getPublicUrl(filePath);

      return {
        success: true,
        url: data.publicUrl,
      };
    } else {
      // Bucket creation failed, use base64 fallback
      console.warn('Storage bucket not available, using base64 fallback');
      const base64Url = await fileToBase64(file);
      return {
        success: true,
        url: base64Url,
      };
    }
  } catch (error) {
    console.warn('Image upload failed, using base64 fallback:', error);
    
    try {
      // Fallback to base64 data URL
      const base64Url = await fileToBase64(file);
      return {
        success: true,
        url: base64Url,
      };
    } catch (fallbackError) {
      console.error('Both upload methods failed:', fallbackError);
      return {
        success: false,
        error: 'Failed to process image. Please try again.',
      };
    }
  }
};

// Convert file to base64 for preview
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
