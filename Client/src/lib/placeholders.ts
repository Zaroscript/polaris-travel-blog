// Default placeholder images for user profiles when assets are missing

// Default cover image (landscape orientation) - uses a local SVG with travel theme
export const defaultCoverImage = "/images/default-cover.svg";

// Default profile picture (square orientation) - uses a local SVG with generic avatar
export const defaultProfilePic = "/images/default-user.svg";

// Get a cover image or fallback to default
export const getCoverImage = (userCoverImage?: string): string => {
  return userCoverImage || defaultCoverImage;
};

// Get a profile pic or fallback to default
export const getProfilePic = (userProfilePic?: string): string => {
  return userProfilePic || defaultProfilePic;
};
