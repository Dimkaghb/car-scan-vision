import { supabase } from '@/lib/supabaseClient';

// Setup storage bucket for driver assets
export const setupDriverStorage = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Setting up driver storage...');

    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return {
        success: false,
        message: `Failed to check existing buckets: ${listError.message}`
      };
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'driver-assets');
    
    if (bucketExists) {
      console.log('✅ Storage bucket "driver-assets" already exists');
      return {
        success: true,
        message: 'Storage bucket already exists and is ready to use'
      };
    }

    // Create the bucket
    const { error: createError } = await supabase.storage.createBucket('driver-assets', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
      fileSizeLimit: 5242880, // 5MB
    });

    if (createError) {
      console.error('Error creating bucket:', createError);
      return {
        success: false,
        message: `Failed to create storage bucket: ${createError.message}`
      };
    }

    console.log('✅ Storage bucket "driver-assets" created successfully');
    
    // Set up storage policies if needed
    try {
      await setupStoragePolicies();
    } catch (policyError) {
      console.warn('Storage policies setup failed (this is usually fine):', policyError);
    }

    return {
      success: true,
      message: 'Storage bucket created successfully and is ready to use'
    };

  } catch (error) {
    console.error('Unexpected error setting up storage:', error);
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Setup storage policies (optional)
const setupStoragePolicies = async () => {
  // Note: This would require RLS policies to be set up in Supabase dashboard
  // For now, we'll rely on the bucket being public
  console.log('Storage policies should be configured in Supabase dashboard if needed');
};

// Utility function to test storage
export const testStorage = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Create a small test file
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    const { error: uploadError } = await supabase.storage
      .from('driver-assets')
      .upload('test/test.txt', testFile);

    if (uploadError) {
      return {
        success: false,
        message: `Storage test failed: ${uploadError.message}`
      };
    }

    // Clean up test file
    await supabase.storage
      .from('driver-assets')
      .remove(['test/test.txt']);

    return {
      success: true,
      message: 'Storage is working correctly'
    };

  } catch (error) {
    return {
      success: false,
      message: `Storage test error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
