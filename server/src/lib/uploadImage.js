import cloudinary from "./cloudinary.js";

/**
 * Upload an image to Cloudinary
 * @param {string} image - Base64 image string or URL
 * @param {Object} options - Upload options
 * @returns {Promise<string>} Cloudinary secure URL
 */
export const uploadImage = async (image, options = {}) => {
  // If it's already a URL (e.g., during edit), return it as is
  if (image.startsWith('http')) {
    return image;
  }

  // If it's a base64 string, upload to Cloudinary
  if (image.startsWith('data:image')) {
    const result = await cloudinary.uploader.upload(image, {
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      ...options
    });
    return result.secure_url;
  }

  throw new Error('Invalid image format');
};

/**
 * Upload multiple images to Cloudinary
 * @param {string[]} images - Array of base64 image strings or URLs
 * @param {Object} options - Upload options
 * @returns {Promise<string[]>} Array of Cloudinary secure URLs
 */
export const uploadImages = async (images, options = {}) => {
  if (!images || !Array.isArray(images)) return [];
  
  try {
    const uploadPromises = images.map(image => uploadImage(image, options));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error('Error uploading images: ' + error.message);
  }
};
