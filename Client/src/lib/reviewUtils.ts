import { Review } from '@/types/destination';

interface RawReviewData {
  _id?: string;
  author?: {
    _id?: string;
    id?: string;
    fullName?: string;
    name?: string;
    profilePic?: string;
    profileImage?: string;
    avatar?: string;
  };
  user?: {
    _id?: string;
    fullName?: string;
    name?: string;
    profilePic?: string;
    profileImage?: string;
    avatar?: string;
  };
  userId?: string;
  authorId?: string;
  fullName?: string;
  userName?: string;
  profilePic?: string;
  rating?: number;
  content?: string;
  text?: string;
  createdAt?: string;
}

/**
 * Normalizes review data to ensure it matches the expected Review interface
 * Handles different API response formats for reviews
 */
export const normalizeReview = (reviewData: RawReviewData | null): Review => {
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
        profilePic: reviewData.profilePic || reviewData.user?.profilePic || reviewData.user?.profileImage || reviewData.user?.avatar || '',
      },
      rating: reviewData.rating || 0,
      content: reviewData.content || reviewData.text || '',
      createdAt: reviewData.createdAt || new Date().toISOString(),
    };
  }

  // Handle case where author field exists but might be just an ID reference
  if (reviewData._id && reviewData.author && typeof reviewData.author === 'object') {
    return {
      _id: reviewData._id,
      author: {
        _id: reviewData.author._id || reviewData.author.id || reviewData._id,
        fullName: reviewData.author.fullName || reviewData.author.name || 'User',
        profilePic: reviewData.author.profilePic || reviewData.author.profileImage || reviewData.author.avatar || '',
      },
      rating: reviewData.rating || 0,
      content: reviewData.content || reviewData.text || '',
      createdAt: reviewData.createdAt || new Date().toISOString(),
    };
  }

  // Default case for any other format
  return {
    _id: reviewData._id || `temp-${Date.now()}`,
    author: {
      _id: reviewData.author?._id || reviewData.authorId || `author-${Date.now()}`,
      fullName: reviewData.author?.fullName || reviewData.author?.name || 'User',
      profilePic: reviewData.author?.profilePic || reviewData.author?.profileImage || reviewData.author?.avatar || '',
    },
    rating: reviewData.rating || 0,
    content: reviewData.content || reviewData.text || '',
    createdAt: reviewData.createdAt || new Date().toISOString(),
  };
};

/**
 * Processes an array of reviews to ensure they all match the expected structure
 */
export const normalizeReviews = (reviews: RawReviewData[] = []): Review[] => {
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
