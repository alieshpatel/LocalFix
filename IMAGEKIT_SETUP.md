# ImageKit Setup Complete ✅

This document outlines the ImageKit integration setup for your LocalFix application.

## Overview

ImageKit is configured for:
- **Image resizing & optimization** - Automatic responsive images
- **URL generation** - Dynamic image URLs with transformations
- **File uploads** - Client-side uploads with authentication
- **Responsive images** - Automatic scaling across devices

## Configuration

### 1. Backend Setup (.env)
```
IMAGEKIT_PRIVATE_KEY=private_aoG3BzmBQzK8h268k6kDx4uUbjE=
IMAGEKIT_PUBLIC_KEY=public_dbnI+QiW7bANXsAx6t1Tb5Vspas=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/Techmitra/
```

**Location:** `backend/.env`

The ImageKit package is already installed in your dependencies (`imagekit: ^6.0.0`).

### 2. Frontend Setup (.env)
```
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/Techmitra/
VITE_IMAGEKIT_PUBLIC_KEY=public_dbnI+QiW7bANXsAx6t1Tb5Vspas=
VITE_API_BASE_URL=http://localhost:5000
```

**Location:** `frontend/.env`

### 3. Install Frontend Dependency

Run in the frontend directory:
```bash
npm install @imagekit/react
```

## Backend Changes

### API Endpoint: GET `/api/upload/auth`
Returns authentication parameters for client-side uploads.

**Response:**
```json
{
  "token": "unique_token",
  "expire": 1234567890,
  "signature": "hashed_signature",
  "publicKey": "public_dbnI+QiW7bANXsAx6t1Tb5Vspas="
}
```

Used by frontend to securely upload files without exposing the private key.

### Files Modified:
- `backend/controllers/uploadController.js` - Added `getAuthToken()` function
- `backend/routes/uploadRoutes.js` - Added GET `/auth` endpoint

## Frontend Components Created

### 1. **ImageKitImage.jsx** - Image Display Components

#### ResponsiveImage
```jsx
<ResponsiveImage
  src="/profile.png"
  alt="Profile"
  width={400}
  height={300}
  transformation={[{ width: 400, height: 300, quality: 85 }]}
/>
```

#### ProfileImage
```jsx
<ProfileImage
  src="/user-photo.jpg"
  alt="User"
  size="md" // sm | md | lg
/>
```

#### ServiceImage
```jsx
<ServiceImage
  src="/service.jpg"
  alt="Service"
/>
```

#### ThumbnailImage
```jsx
<ThumbnailImage
  src="/image.jpg"
  alt="Thumbnail"
  size={150}
/>
```

### 2. **ImageUpload.jsx** - Upload Components

#### ImageUpload Hook
```jsx
const {
  fileInputRef,
  handleFileSelect,
  isUploading,
  progress,
  error,
  cancelUpload
} = ImageUpload({
  onSuccess: (response) => { /* response.url, response.fileName */ },
  onError: (err) => { /* handle error */ },
  folder: "/service-images"
});
```

#### UploadDropZone
```jsx
<UploadDropZone
  onFileSelect={(file) => handleUpload(file)}
  maxSize={10 * 1024 * 1024}
/>
```

### 3. **Utility Functions** (imagektUtils.js)

- `generateImageKitUrl()` - Create ImageKit URLs with transformations
- `fetchUploadAuth()` - Get upload tokens from backend
- `validateFile()` - Validate file size and type
- `formatFileSize()` - Format bytes for display

### 4. **Configuration** (config/imagekit.js)

Central configuration for ImageKit with validation:
```jsx
import { imageKitConfig } from "@/config/imagekit";
// URL, public key, and API endpoint automatically configured
```

## Usage Examples

### Display a Service Image
```jsx
import { ServiceImage } from "@/components/ImageKitImage";

export default function ServiceCard() {
  return <ServiceImage src="/services/plumbing.jpg" alt="Plumbing" />;
}
```

### Display a Profile Picture
```jsx
import { ProfileImage } from "@/components/ImageKitImage";

export default function UserProfile() {
  return <ProfileImage src="/profiles/john.jpg" alt="John" size="lg" />;
}
```

### Handle File Upload
```jsx
import { ImageUpload, UploadDropZone } from "@/components/ImageUpload";

export default function UploadService() {
  const { fileInputRef, handleFileSelect, progress, error } = ImageUpload({
    onSuccess: (response) => {
      console.log("Upload URL:", response.url);
      // Save URL to database
    },
    folder: "/services"
  });

  return (
    <div>
      <UploadDropZone onFileSelect={(file) => {
        handleFileSelect({ target: { files: [file] } });
      }} />
      {progress > 0 && <div>Upload: {progress}%</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

## Supported Transformations

ImageKit URL parameters (examples):
```jsx
transformation={[
  { width: 300, height: 300 },           // w-300,h-300
  { quality: 85 },                        // q-85
  { crop: "fill" },                       // c-fill
  { radius: 10 },                         // r-10
  { format: "webp" },                     // f-webp
  { blur: 10 },                           // bl-10
]}
```

## Image URLs Format

### Standard URL
```
https://ik.imagekit.io/Techmitra/image.jpg
```

### URL with Transformations
```
https://ik.imagekit.io/Techmitra/tr:w-300,h-300,q-85/image.jpg
```

### Responsive with Multiple Sizes
The Image component automatically generates srcset for:
- Mobile: 640px
- Tablet: 750px, 828px
- Desktop: 1080px, 1200px
- High-res: 1920px, 2048px, 3840px

## File Upload Flow

1. **User selects file** → Frontend validates
2. **Request auth token** → Call `GET /api/upload/auth`
3. **Backend returns** → {token, expire, signature, publicKey}
4. **Upload file** → ImageKit API with auth params
5. **ImageKit returns** → {url, fileId, name, size, mime}
6. **Save URL** → Store in database for later use

## Security Considerations

✅ **Private key never exposed** - Only used server-side
✅ **Time-limited tokens** - Auth parameters expire in 1 hour
✅ **HMAC signatures** - Prevent unauthorized uploads
✅ **CORS enabled** - Backend allows cross-origin requests
✅ **File validation** - Size and type checks on client & server

## Testing the Setup

### Test Image Display
```jsx
<ResponsiveImage
  src="/test.jpg"
  alt="Test"
  width={200}
  height={200}
/>
```

### Test File Upload
1. Navigate to upload component
2. Select or drag image file
3. Monitor upload progress
4. Verify image appears in ImageKit dashboard

## Troubleshooting

### Images not loading?
- Check VITE_IMAGEKIT_URL_ENDPOINT in frontend .env
- Verify ImageKit public key is correct
- Check browser console for errors

### Upload failing?
- Ensure backend .env has correct private key
- Verify /api/upload/auth endpoint is accessible
- Check file size doesn't exceed maxSize
- Look for CORS errors in browser console

### Missing packages?
```bash
# Frontend
npm install @imagekit/react

# Backend (already installed, but if needed)
npm install imagekit
```

## Production Deployment

Before deploying:
1. Update environment variables in production
2. Use production ImageKit URL endpoint
3. Enable HTTPS for secure uploads
4. Increase file size limits if needed
5. Add upload folder structure per user/service
6. Implement additional server-side validation

## Resources

- ImageKit Docs: https://docs.imagekit.io/
- React SDK: https://github.com/imagekit-developer/imagekit-react
- Transformations: https://docs.imagekit.io/features/image-transformation

## Component Files Created

- `frontend/src/config/imagekit.js` - Configuration
- `frontend/src/components/ImageKitImage.jsx` - Display components
- `frontend/src/components/ImageUpload.jsx` - Upload components
- `frontend/src/utils/imagektUtils.js` - Utility functions
- `frontend/src/pages/ImageKitExample.jsx` - Example page
- `frontend/.env` - Environment variables
- `backend/.env` - Updated with ImageKit keys
- `backend/controllers/uploadController.js` - Updated with auth function
- `backend/routes/uploadRoutes.js` - Updated with auth route

**Setup Status: ✅ Complete!**

All files have been created and configured. You just need to run:
```bash
cd frontend
npm install @imagekit/react
```

Then restart your development servers and you're ready to use ImageKit! 🚀
