import { Review } from '@/types/destination';

/**
 * Normalizes review data to ensure it matches the expected Review interface
 * Handles different API response formats for reviews
 */
export const normalizeReview = (reviewData: any): Review => {
  // Handle null or undefined case
  if (!reviewData) {
    return {
      _id: `temp-${Date.now()}`,
      author: {
        _id: `author-${Date.now()}`,
        fullName: 'Anonymous User',
        profilePic: '',
      },
      rating: 0,
      content: '',
      createdAt: new Date().toISOString(),
    };
  }

  // If reviewData already has the correct structure, return it
  if (
    reviewData._id &&
    reviewData.author &&
    typeof reviewData.author === 'object' &&
    reviewData.author.fullName &&
    reviewData.rating &&
    reviewData.content
  ) {
    return reviewData as Review;
  }

  // Handle case where author data is at the root level alongside user data
  if (reviewData._id && (reviewData.fullName || reviewData.user)) {
    return {
      _id: reviewData._id,
      author: {
        _id: reviewData.user?._id || reviewData.userId || reviewData._id,
        fullName: reviewData.fullName || reviewData.user?.fullName || reviewData.user?.name || reviewData.userName || 'User',
        profilePic: reviewData.profilePic || reviewData.user?.profilePic || reviewData.user?.avatar || '',
      },
      rating: reviewData.rating || 0,
      content: reviewData.content || reviewData.text || '',
      createdAt: reviewData.createdAt || new Date().toISOString(),
    };
  }

  // Handle case where author field exists but might be just an ID reference
  if (reviewData._id && reviewData.author) {
    let authorData: any = {};
    
    // If author is just an ID string
    if (typeof reviewData.author === 'string') {
      authorData = {
        _id: reviewData.author,
        fullName: reviewData.authorName || 'User',
        profilePic: reviewData.authorPic || '',
      };
    } 
    // If author is an object but missing some fields
    else if (typeof reviewData.author === 'object') {
      authorData = {
        _id: reviewData.author._id || `author-${Date.now()}`,
        fullName: reviewData.author.fullName || reviewData.author.name || reviewData.authorName || 'User',
        profilePic: reviewData.author.profilePic || reviewData.author.avatar || reviewData.author.picture || '',
      };
    }

    return {
      _id: reviewData._id,
      author: authorData,
      rating: reviewData.rating || 0,
      content: reviewData.content || reviewData.text || '',
      createdAt: reviewData.createdAt || new Date().toISOString(),
    };
  }

  // Fallback for unexpected structure - create a properly structured review
  return {
    _id: reviewData._id || `temp-${Date.now()}`,
    author: {
      _id: reviewData.userId || reviewData.authorId || `author-${Date.now()}`,
      fullName: reviewData.authorName || reviewData.userName || 'User',
      profilePic: reviewData.authorPic || reviewData.authorAvatar || '',
    },
    rating: reviewData.rating || reviewData.stars || 0,
    content: reviewData.content || reviewData.text || reviewData.description || '',
    createdAt: reviewData.createdAt || reviewData.date || new Date().toISOString(),
  };
};

/**
 * Processes an array of reviews to ensure they all match the expected structure
 */
export const normalizeReviews = (reviews: any[] = []): Review[] => {
  // If no reviews, return empty array
  if (!reviews || !Array.isArray(reviews)) return [];
  
  // Map each review through the normalizer
  return reviews.map(review => normalizeReview(review));
};

/**
 * Gets a default review for testing or when data is not available
 */
export const getDefaultReviews = (): Review[] => {
  return [
    {
      _id: 'default-review-1',
      author: {
        _id: 'default-author-1',
        fullName: 'Alex Johnson',
        profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      rating: 4,
      content: 'Wonderful destination! The views were breathtaking and the local cuisine was fantastic. Highly recommend visiting during spring when the weather is perfect.',
      createdAt: '2024-12-01T10:23:45Z',
    },
    {
      _id: 'default-review-2',
      author: {
        _id: 'default-author-2',
        fullName: 'Maria Garcia',
        profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      rating: 5,
      content: 'One of the best travel experiences I\'ve ever had! The local guide was knowledgeable and the accommodations were excellent. Can\'t wait to visit again.',
      createdAt: '2025-01-15T15:18:22Z',
    },
  ];
};
