export interface Post {
  _id: string;
  title: string;
  subtitle?: string;
  content: string;
  coverImage: string;
  author: {
    _id: string;
    fullName: string;
    profilePic: string;
  };
  likes: {
    _id: string;
    fullName?: string;
    profilePic?: string;
  }[];
  tags: string[];
  comments: Comment[];
  destination?: {
    _id: string;
    name: string;
    image: string;
  };
  destinationId?: string;
  createdAt: string;
  gallery: string[];
  travelTips?: string[];
  isSaved?: boolean;
  isLiked?: boolean;
  isShared?: boolean;
  isDeleted?: boolean;
  isEdited?: boolean;
  editedAt?: string;
  file?: File | File[]; // For file upload handling
  shares?: {
    _id: string;
    fullName?: string;
    profilePic?: string;
  }[];
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    fullName: string;
    profilePic: string;
  };
  likes: {
    _id: string;
    fullName?: string;
    profilePic?: string;
  }[];
  createdAt: string;
  replies: Reply[];
  isLoading?: boolean; // Added for optimistic UI updates
  isLiked?: boolean;
}

export interface Reply {
  _id: string;
  content: string;
  author: {
    _id: string;
    fullName: string;
    profilePic: string;
  };
  likes: {
    _id: string;
    fullName?: string;
    profilePic?: string;
  }[];
  createdAt: string;
  isLoading?: boolean; // Added for optimistic UI updates
  isLiked?: boolean;
}

export interface SuggestedConnection {
  _id: string;
  fullName: string;
  profilePic: string;
  role?: string;
}

export interface PostCardProps {
  post: Post;
  onLike?: (postId: Post['_id']) => Promise<void> | void;
  onSave?: (postId: Post['_id']) => Promise<void> | void;
  onCopyLink?: (postId: Post['_id']) => Promise<void> | void;
  onFollow?: (userId: string) => Promise<void> | void;
  isLiked?: boolean;
  isSaved?: boolean;
  isCopied?: boolean;
  isFollowing?: boolean;
  compact?: boolean;
}

export interface RightSidebarProps {
  suggestedConnections: SuggestedConnection[];
  following: string[];
  onFollow: (userId: string) => void;
  newsItems: string[];
}

export interface MinimalProfile {
  _id: string;
  fullName: string;
  profilePic: string;
  location?: string;
  coverImage?: string;
}

export interface Profile {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  location: string;
  about: string;
  birthDate: string;
  profilePic: string;
  coverImage: string;
  visitedDestinations: Destination[];
  interests: string[];
  following: MinimalProfile[];
  followers: MinimalProfile[];
  savedPosts: { _id: string; title: string; coverImage: string }[];
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  accountSettings: {
    connections: MinimalProfile[];
    following: MinimalProfile[];
    followers: MinimalProfile[];
    savedPosts: { _id: string; title: string; coverImage: string }[];
    posts: { _id: string; title: string; coverImage: string }[];
    isVerified: boolean;
    joinedDate: string;
  };
  posts: { _id: string; title: string; coverImage: string }[];
  isVerified: boolean;
  token?: string;
}

// Profile user with focused properties for the ProfileUser component
export interface ProfileUser extends Omit<Profile, 'visitedDestinations'> {
  visitedDestinations?: Destination[];
}

export interface Destination {
  _id: string;
  name: string;
  country: string;
  image: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  visitDate?: string;
  rating?: number;
  notes?: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasMore: boolean;
}

export type PostFilter = "all" | "following" | "saved" | "liked" | "trending" | "latest" | "popular" | string;

export type PostSort = "recent" | "popular" | "oldest" | string;

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  activeFilter: PostFilter;
  activeSort: PostSort;
  searchQuery: string;
  resetFilters: () => void;
  fetchPosts: (
    page?: number, 
    filter?: PostFilter, 
    sort?: PostSort, 
    search?: string, 
    append?: boolean
  ) => Promise<{ posts: Post[]; hasMore: boolean }>;
  loadMorePosts: () => Promise<void>;
  fetchPost: (id: string) => Promise<Post>;
  createPost: (postData: Partial<Post> & { file?: File | File[] }) => Promise<Post>;
  updatePost: (id: string, postData: Partial<Post> & { file?: File | File[] }) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<{ isLiked: boolean; message: string }>;
  unlikePost: (id: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<Comment>;
  likeComment: (postId: string, commentId: string) => Promise<void>;
  unlikeComment: (postId: string, commentId: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  addReply: (
    postId: string,
    commentId: string,
    content: string
  ) => Promise<Reply>;
  likeReply: (
    postId: string,
    commentId: string,
    replyId: string
  ) => Promise<void>;
  unlikeReply: (
    postId: string,
    commentId: string,
    replyId: string
  ) => Promise<void>;
  deleteReply: (
    postId: string,
    commentId: string,
    replyId: string
  ) => Promise<void>;
  toggleSavePost: (
    id: string
  ) => Promise<{ message: string; isSaved: boolean }>;
  sharePost: (id: string) => Promise<void>;
  fetchPopularPosts: () => Promise<Post[]>;
  fetchFollowingPosts: () => Promise<Post[]>;
  fetchSavedPosts: () => Promise<Post[]>;
  fetchLikedPosts: () => Promise<Post[]>;
  fetchUserPhotos: (userId?: string) => Promise<string[]>;
  fetchUserPosts: (userId: string) => Promise<Post[]>;
}

export interface ProfileState {
  profile: ProfileUser | null;
  posts: Post[];
  followers: MinimalProfile[];
  following: MinimalProfile[];
  loading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<ProfileUser>;
  fetchUserPosts: (userId: string) => Promise<void>;
  fetchSuggestedUsers: (userId: string) => Promise<ProfileUser[]>;
  fetchFollowers: (
    userId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  fetchFollowing: (
    userId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  updateProfile: (
    userId: string,
    profileData: Partial<ProfileUser>
  ) => Promise<ProfileUser>;
  followUser: (userId: string) => Promise<{
    following: boolean;
    followingCount: number;
    followerCount: number;
    message: string;
  }>;
  unfollowUser: (userId: string) => Promise<{
    following: boolean;
    followingCount: number;
    followerCount: number;
    message: string;
  }>;
  blockUser: (userId: string) => Promise<void>;
  reportUser: (userId: string, reason: string) => Promise<void>;
}

// Hook return types for better type safety
export interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: (page?: number, limit?: number, search?: string) => Promise<void>;
  fetchUserPosts: (userId: string) => Promise<Post[]>;
  fetchSavedPosts: () => Promise<Post[]>;
  fetchLikedPosts: () => Promise<Post[]>;
  fetchUserPhotos: (userId?: string) => Promise<string[]>;
  likePost: (id: string) => Promise<{ isLiked: boolean; message: string }>;
  savePost: (id: string) => Promise<{ message: string; isSaved: boolean }>;
  createPost: (postData: Partial<Post>) => Promise<Post>;
  updatePost: (id: string, postData: Partial<Post>) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<Comment>;
}

export interface UseProfileReturn {
  profile: ProfileUser | null;
  loading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<ProfileUser>;
  fetchFollowing: (userId: string, page?: number, limit?: number) => Promise<void>;
  fetchFollowers: (userId: string, page?: number, limit?: number) => Promise<void>;
  followUser: (userId: string) => Promise<{
    following: boolean;
    followingCount: number;
    followerCount: number;
    message: string;
  }>;
  unfollowUser: (userId: string) => Promise<{
    following: boolean;
    followingCount: number;
    followerCount: number;
    message: string;
  }>;
  updateProfile: (userId: string, profileData: Partial<ProfileUser>) => Promise<ProfileUser>;
  isCurrentUserFollowing: (followerId: string) => boolean;
}
