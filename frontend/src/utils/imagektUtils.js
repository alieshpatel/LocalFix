/**
 * ImageKit Utility Functions
 * Helper functions for generating ImageKit URLs and managing uploads
 */

import { imageKitConfig } from "../config/imagekit";

/**
 * Generate a responsive ImageKit URL with transformations
 * @param {string} filePath - The file path in ImageKit
 * @param {object} transformations - Optional transformations object
 * @returns {string} The formatted ImageKit URL
 */
export const generateImageKitUrl = (filePath, transformations = {}) => {
  if (!filePath) return "";

  // Build transformation string
  let transformationString = "";
  if (Object.keys(transformations).length > 0) {
    const params = [];
    
    if (transformations.width) params.push(`w-${transformations.width}`);
    if (transformations.height) params.push(`h-${transformations.height}`);
    if (transformations.quality) params.push(`q-${transformations.quality}`);
    if (transformations.crop) params.push(`c-${transformations.crop}`);
    if (transformations.radius) params.push(`r-${transformations.radius}`);
    if (transformations.format) params.push(`f-${transformations.format}`);
    if (transformations.blur) params.push(`bl-${transformations.blur}`);
    
    if (params.length > 0) {
      transformationString = `/tr:${params.join(",")}`;
    }
  }

  // Remove leading slash if present
  const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
  
  return `${imageKitConfig.urlEndpoint}${transformationString}${cleanPath}`;
};

/**
 * Fetch upload authentication parameters from backend
 * @returns {Promise<object>} Authentication parameters {token, expire, signature, publicKey}
 */
export const fetchUploadAuth = async () => {
  try {
    const response = await fetch(`${imageKitConfig.apiEndpoint}/api/upload/auth`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch auth: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching upload auth:", error);
    throw error;
  }
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result {valid: boolean, error?: string}
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  } = options;

  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File size exceeds limit (${formatFileSize(maxSize)})` 
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type not allowed. Supported: ${allowedTypes.join(", ")}` 
    };
  }

  return { valid: true };
};
