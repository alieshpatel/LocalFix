/**
 * ImageKit Configuration
 * Frontend setup for ImageKit URL generation and file uploads
 */

export const imageKitConfig = {
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  apiEndpoint: import.meta.env.VITE_API_BASE_URL
};

export const validateImageKitConfig = () => {
  if (!imageKitConfig.urlEndpoint) {
    console.error("❌ VITE_IMAGEKIT_URL_ENDPOINT not configured");
    return false;
  }
  if (!imageKitConfig.publicKey) {
    console.error("❌ VITE_IMAGEKIT_PUBLIC_KEY not configured");
    return false;
  }
  if (!imageKitConfig.apiEndpoint) {
    console.error("❌ VITE_API_BASE_URL not configured");
    return false;
  }
  console.log("✅ ImageKit configuration valid");
  return true;
};
