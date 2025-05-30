import { supabase } from './client';

export type StorageBucket =
  | 'exam-files'
  | 'student-submissions'
  | 'processed-results';

export interface UploadOptions {
  bucket: StorageBucket;
  path: string;
  file: File;
  userId: string;
}

export interface UploadResult {
  success: boolean;
  data?: {
    path: string;
    fullPath: string;
    publicUrl?: string;
  };
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile({
  bucket,
  path,
  file,
  userId,
}: UploadOptions): Promise<UploadResult> {
  try {
    // Create user-specific path: userId/path
    const fullPath = `${userId}/${path}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: {
        path: data.path,
        fullPath: data.fullPath,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get a signed URL for a file
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn: number = 3600
): Promise<{ url: string | null; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      return { url: null, error: error.message };
    }

    return { url: data.signedUrl };
  } catch (error) {
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * List files in a user's folder
 */
export async function listUserFiles(
  bucket: StorageBucket,
  userId: string,
  folder?: string
): Promise<{ files: any[]; error?: string }> {
  try {
    const path = folder ? `${userId}/${folder}` : userId;

    const { data, error } = await supabase.storage.from(bucket).list(path);

    if (error) {
      return { files: [], error: error.message };
    }

    return { files: data || [] };
  } catch (error) {
    return {
      files: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get file metadata
 */
export async function getFileMetadata(
  bucket: StorageBucket,
  path: string
): Promise<{ metadata: any; error?: string }> {
  try {
    const { data, error } = await supabase.storage.from(bucket).list('', {
      search: path,
    });

    if (error) {
      return { metadata: null, error: error.message };
    }

    const file = data?.find((f: any) => f.name === path.split('/').pop());

    return { metadata: file || null };
  } catch (error) {
    return {
      metadata: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate a unique filename with timestamp
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');

  return `${nameWithoutExt}_${timestamp}_${randomString}.${extension}`;
}

/**
 * Validate file type and size
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = ['application/pdf', 'image/jpeg', 'image/png'],
  maxSizeMB: number = 50
): { valid: boolean; error?: string } {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}
