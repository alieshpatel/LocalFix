/**
 * ImageKit File Upload Component
 * Handle file uploads to ImageKit with progress tracking and error handling
 */

import { useState, useRef } from "react";
import { upload, ImageKitUploadNetworkError, ImageKitServerError } from "@imagekit/react";
import { fetchUploadAuth, validateFile, formatFileSize } from "../utils/imagektUtils";

/**
 * ImageUpload Component
 * Provides file upload functionality to ImageKit
 * 
 * @param {object} props - Component props
 * @param {function} props.onSuccess - Callback when upload succeeds, receives {url, fileId, fileName}
 * @param {function} props.onError - Callback when upload fails, receives error
 * @param {string} props.folder - ImageKit folder path for upload
 * @param {array} props.allowedTypes - Allowed MIME types
 * @param {number} props.maxSize - Maximum file size in bytes
 * @param {boolean} props.multiple - Allow multiple files (queuing)
 */
export const ImageUpload = ({
  onSuccess,
  onError,
  folder = "/",
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    // If multiple is false, only process first file
    const filesToProcess = multiple ? files : [files[0]];

    for (const file of filesToProcess) {
      await uploadFile(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (file) => {
    setError("");
    setProgress(0);

    // Validate file
    const validation = validateFile(file, { allowedTypes, maxSize });
    if (!validation.valid) {
      const errorMsg = validation.error;
      setError(errorMsg);
      onError?.(new Error(errorMsg));
      return;
    }

    setIsUploading(true);
    abortControllerRef.current = new AbortController();

    try {
      // Fetch authentication parameters
      const authParams = await fetchUploadAuth();
      
      // Upload file using ImageKit SDK
      const uploadResponse = await upload({
        file,
        fileName: file.name,
        signature: authParams.signature,
        token: authParams.token,
        expire: authParams.expire,
        publicKey: authParams.publicKey,
        folder: folder,
        onProgress: (event) => {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setProgress(percentage);
        },
        abortSignal: abortControllerRef.current.signal,
      });

      setProgress(100);
      setIsUploading(false);
      setError("");

      // Call success callback with upload response
      onSuccess?.({
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        fileName: uploadResponse.name,
        size: uploadResponse.size,
        type: uploadResponse.mime
      });

      console.log("✅ Upload successful:", uploadResponse);
    } catch (err) {
      setIsUploading(false);
      
      // Handle specific error types
      if (err.name === "AbortError") {
        const errorMsg = "Upload cancelled";
        setError(errorMsg);
        onError?.(new Error(errorMsg));
      } else if (err instanceof ImageKitUploadNetworkError) {
        const errorMsg = `Network error: ${err.message}`;
        setError(errorMsg);
        onError?.(err);
      } else if (err instanceof ImageKitServerError) {
        const errorMsg = `Server error: ${err.message}`;
        setError(errorMsg);
        onError?.(err);
      } else {
        const errorMsg = err.message || "Upload failed";
        setError(errorMsg);
        onError?.(err);
      }

      console.error("❌ Upload error:", err);
    }
  };

  const cancelUpload = () => {
    abortControllerRef.current.abort();
    setIsUploading(false);
    setProgress(0);
  };

  return {
    fileInputRef,
    handleFileSelect,
    isUploading,
    progress,
    error,
    cancelUpload
  };
};

/**
 * UploadDropZone Component
 * Drag and drop upload interface
 */
export const UploadDropZone = ({
  onFileSelect,
  accept = ".jpg,.jpeg,.png,.webp",
  maxSize = 10 * 1024 * 1024
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50 hover:border-gray-400"
      }`}
    >
      <svg
        className="w-12 h-12 mx-auto mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <p className="text-gray-700 font-medium">
        {isDragging ? "Drop your file here" : "Drag and drop your image here"}
      </p>
      <p className="text-gray-500 text-sm mt-1">
        or click to browse (Max: {formatFileSize(maxSize)})
      </p>
    </div>
  );
};

export default ImageUpload;
