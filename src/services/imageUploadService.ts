import { supabase } from '@/lib/supabaseClient';

// Upload inspection image to Supabase Storage
export const uploadInspectionImage = async (
  file: File, 
  driverId: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Ensure bucket exists
    const bucketReady = await ensureBucketExists();
    
    if (!bucketReady) {
      return {
        success: false,
        error: 'Storage bucket not available'
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `inspection-${driverId}-${Date.now()}.${fileExt}`;
    const filePath = `inspections/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('driver-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}`
      };
    }

    // Get public URL
    const { data } = supabase.storage
      .from('driver-assets')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: data.publicUrl
    };

  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Ensure storage bucket exists
const ensureBucketExists = async (): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'driver-assets');
    
    if (bucketExists) {
      return true;
    }

    // Try to create the bucket
    const { error: createError } = await supabase.storage.createBucket('driver-assets', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (createError) {
      console.error('Could not create storage bucket:', createError);
      return false;
    }

    console.log('✅ Storage bucket "driver-assets" created successfully');
    return true;
    
  } catch (error) {
    console.error('Error checking/creating bucket:', error);
    return false;
  }
};

// Convert File to base64 (fallback option)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Delete inspection image from storage
export const deleteInspectionImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/storage/v1/object/public/driver-assets/');
    if (urlParts.length !== 2) {
      console.warn('Invalid image URL format for deletion');
      return false;
    }

    const filePath = urlParts[1];
    
    const { error } = await supabase.storage
      .from('driver-assets')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};