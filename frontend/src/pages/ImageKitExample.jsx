/**
 * ImageKit Setup Example Page
 * Demonstrates how to use ImageKit components for image display and uploads
 */

import { useState } from "react";
import { ResponsiveImage, ProfileImage, ServiceImage, ThumbnailImage } from "../components/ImageKitImage";
import { ImageUpload, UploadDropZone } from "../components/ImageUpload";

export const ImageKitExample = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // Using ImageUpload hook
  const {
    fileInputRef,
    handleFileSelect,
    isUploading,
    progress,
    error,
    cancelUpload
  } = ImageUpload({
    onSuccess: (response) => {
      setUploadedImage(response);
      setUploadMessage(`✅ Successfully uploaded: ${response.fileName}`);
    },
    onError: (err) => {
      setUploadMessage(`❌ Upload failed: ${err.message}`);
    },
    folder: "/service-images"
  });

  const handleDropZoneFile = (file) => {
    const event = {
      target: {
        files: [file]
      }
    };
    handleFileSelect(event);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">ImageKit Setup Guide</h1>

      {/* Image Display Examples Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Image Display Examples</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Responsive Image */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-600">Responsive Image</h3>
            <ResponsiveImage
              src="/sample-image.jpg"
              alt="Sample responsive image"
              width={300}
              height={225}
              transformation={[
                { width: 300, height: 225, crop: "fill", quality: 85 }
              ]}
              className="rounded-lg shadow-md"
            />
          </div>

          {/* Profile Image */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-600">Profile Image</h3>
            <ProfileImage
              src="/profile-pic.jpg"
              alt="User profile"
              size="md"
              className="mx-auto shadow-md"
            />
          </div>

          {/* Service Image */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-600">Service Image</h3>
            <ServiceImage
              src="/service-image.jpg"
              alt="Service photo"
              className="shadow-md"
            />
          </div>

          {/* Thumbnail Image */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-600">Thumbnail Image</h3>
            <ThumbnailImage
              src="/thumbnail.jpg"
              alt="Thumbnail"
              size={150}
              className="shadow-md"
            />
          </div>
        </div>
      </section>

      {/* File Upload Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">File Upload</h2>

        {/* Drag and Drop Zone */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-3 text-gray-600">
            Drag and Drop Zone
          </label>
          <UploadDropZone
            onFileSelect={handleDropZoneFile}
            accept=".jpg,.jpeg,.png,.webp"
            maxSize={10 * 1024 * 1024}
          />
        </div>

        {/* File Input */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-3 text-gray-600">
            Or Choose File
          </label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50"
            />
          </div>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <button
              onClick={cancelUpload}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {uploadMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">{uploadMessage}</p>
          </div>
        )}

        {/* Uploaded Image Preview */}
        {uploadedImage && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-600">Uploaded Image</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Preview</p>
                <img
                  src={uploadedImage.url}
                  alt={uploadedImage.fileName}
                  className="rounded-lg shadow-md max-w-full h-auto"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Details</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                    <p className="text-sm text-gray-600">{uploadedImage.fileName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">URL:</span>
                    <p className="text-xs text-blue-600 break-all">{uploadedImage.url}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Size:</span>
                    <p className="text-sm text-gray-600">{uploadedImage.size} bytes</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    <p className="text-sm text-gray-600">{uploadedImage.type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Integration Code Examples */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Integration Examples</h2>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Basic Image Display</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import { ResponsiveImage } from "@/components/ImageKitImage";

export default function MyComponent() {
  return (
    <ResponsiveImage
      src="/my-image.jpg"
      alt="My image"
      width={400}
      height={300}
      transformation={[{ width: 400, height: 300, quality: 85 }]}
    />
  );
}`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Profile Picture</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import { ProfileImage } from "@/components/ImageKitImage";

export default function Profile() {
  return (
    <ProfileImage
      src="/user-profile.jpg"
      alt="User profile"
      size="md"
    />
  );
}`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">File Upload</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import { ImageUpload } from "@/components/ImageUpload";

export default function UploadComponent() {
  const { fileInputRef, handleFileSelect, progress } = ImageUpload({
    onSuccess: (response) => console.log("Uploaded:", response),
    folder: "/my-folder"
  });

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
      />
      {progress > 0 && <p>Progress: {progress}%</p>}
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Configuration Checklist */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Setup Checklist</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <input type="checkbox" className="mt-1 mr-3" defaultChecked />
            <span className="text-gray-700">✅ ImageKit credentials added to backend .env</span>
          </li>
          <li className="flex items-start">
            <input type="checkbox" className="mt-1 mr-3" defaultChecked />
            <span className="text-gray-700">✅ Frontend environment variables configured</span>
          </li>
          <li className="flex items-start">
            <input type="checkbox" className="mt-1 mr-3" defaultChecked />
            <span className="text-gray-700">✅ Backend /auth endpoint created</span>
          </li>
          <li className="flex items-start">
            <input type="checkbox" className="mt-1 mr-3" defaultChecked />
            <span className="text-gray-700">✅ @imagekit/react installed in frontend</span>
          </li>
          <li className="flex items-start">
            <input type="checkbox" className="mt-1 mr-3" defaultChecked />
            <span className="text-gray-700">✅ ImageKit components created and imported</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ImageKitExample;
