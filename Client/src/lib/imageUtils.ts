// Utility functions for image handling

/**
 * Gets the image URL from a destination, handling all possible cases
 * @param destination The destination object
 * @returns A valid image URL or fallback
 */
export const getDestinationImageUrl = (destination: any): string => {
  // Default fallback image
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80";
  
  if (!destination) return DEFAULT_IMAGE;

  // Case 1: Try coverImage first
  if (destination.coverImage && typeof destination.coverImage === 'object' && destination.coverImage.url) {
    return destination.coverImage.url;
  }
  
  // Case 2: If coverImage is a string, use it directly
  if (destination.coverImage && typeof destination.coverImage === 'string') {
    return destination.coverImage;
  }

  // Case 3: Try images array next
  if (destination.images && Array.isArray(destination.images) && destination.images.length > 0) {
    // Handle both object with url property and direct string url
    const firstImage = destination.images[0];
    if (typeof firstImage === 'object' && firstImage.url) {
      return firstImage.url;
    } else if (typeof firstImage === 'string') {
      return firstImage;
    }
  }
  
  // If no valid image found, return default
  return DEFAULT_IMAGE;
};

/**
 * Generate a blurhash placeholder or color for an image
 * Simple implementation that returns a gradient background
 * In a production app, you might use a proper blurhash library
 */
export const generatePlaceholder = (seed?: string): string => {
  // Create a deterministic color based on the seed
  let hash = 0;
  if (seed) {
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
  } else {
    hash = Math.floor(Math.random() * 16777215);
  }
  
  // Generate two colors for gradient
  const color1 = `hsl(${hash % 360}, 70%, 80%)`;
  const color2 = `hsl(${(hash + 40) % 360}, 80%, 60%)`;
  
  return `linear-gradient(135deg, ${color1}, ${color2})`;
};

/**
 * Handle image loading errors by providing a fallback
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, seed?: string) => {
  const target = e.target as HTMLImageElement;
  
  // First try to use our default image
  target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80";
  
  // If that fails, add a colored background
  target.onerror = () => {
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.style.background = generatePlaceholder(seed);
    }
  };
};
