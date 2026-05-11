/**
 * ImageKit Image Display Component
 * Responsive image component using ImageKit
 */

import { Image, ImageKitProvider } from "@imagekit/react";
import { imageKitConfig } from "../config/imagekit";

/**
 * ResponsiveImage Component
 * Displays images using ImageKit with automatic optimization
 * 
 * @param {object} props - Component props
 * @param {string} props.src - Image path (relative to ImageKit endpoint)
 * @param {string} props.alt - Alt text for accessibility
 * @param {number} props.width - Image display width
 * @param {number} props.height - Image display height
 * @param {string} props.className - CSS classes
 * @param {array} props.transformation - ImageKit transformations
 * @returns {JSX.Element}
 */
export const ResponsiveImage = ({
  src,
  alt = "Image",
  width = 400,
  height = 300,
  className = "",
  transformation = [],
  ...props
}) => {
  if (!src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}>
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  return (
    <ImageKitProvider urlEndpoint={imageKitConfig.urlEndpoint}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        transformation={transformation}
        className={className}
        loading="lazy"
        {...props}
      />
    </ImageKitProvider>
  );
};

/**
 * ProfileImage Component
 * Displays profile pictures with circular styling
 */
export const ProfileImage = ({ src, alt = "Profile", size = "md", className = "" }) => {
  const sizeMap = {
    sm: { width: 48, height: 48 },
    md: { width: 96, height: 96 },
    lg: { width: 160, height: 160 }
  };

  const { width, height } = sizeMap[size] || sizeMap.md;

  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      transformation={[
        { width, height, crop: "face" }
      ]}
      className={`rounded-full object-cover ${className}`}
    />
  );
};

/**
 * ThumbnailImage Component
 * Displays thumbnail images with optimization
 */
export const ThumbnailImage = ({ src, alt = "Thumbnail", size = 200, className = "" }) => {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      transformation={[
        { width: size, height: size, crop: "fill", quality: 80 }
      ]}
      className={`object-cover ${className}`}
    />
  );
};

/**
 * ServiceImage Component
 * Displays service images with specific dimensions
 */
export const ServiceImage = ({ src, alt = "Service", className = "" }) => {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      width={400}
      height={300}
      transformation={[
        { width: 400, height: 300, crop: "fill", quality: 85 }
      ]}
      className={`w-full h-48 object-cover rounded-lg ${className}`}
    />
  );
};

export default ResponsiveImage;
