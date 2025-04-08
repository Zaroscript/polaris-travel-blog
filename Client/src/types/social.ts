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
    fullName: string;
    profilePic: string;
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
    fullName: string;
    profilePic: string;
  }[];
  createdAt: string;
  replies: Reply[];
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
    fullName: string;
    profilePic: string;
  }[];
  createdAt: string;
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
  visitedDestinations: { _id: string; name: string; image: string }[];
  interests: [];
  following: { _id: string; fullName: string; profilePic: string }[];
  followers: { _id: string; fullName: string; profilePic: string }[];
  savedPosts: { _id: string; title: string; coverImage: string }[];
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  accountSettings: {
    connections: { _id: string; fullName: string; profilePic: string }[];
    following: { _id: string; fullName: string; profilePic: string }[];
    followers: { _id: string; fullName: string; profilePic: string }[];
    savedPosts: { _id: string; title: string; coverImage: string }[];
    posts: { _id: string; title: string; coverImage: string }[];
    isVerified: boolean;
    joinedDate: string;
  };
  posts: { _id: string; title: string; coverImage: string }[];
  isVerified: boolean;
  token?: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasMore: boolean;
}

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: (page?: number, limit?: number, search?: string) => Promise<void>;
  fetchPost: (id: string) => Promise<Post>;
  createPost: (postData: Partial<Post>) => Promise<Post>;
  updatePost: (id: string, postData: Partial<Post>) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;
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
  fetchPopularPosts: () => void;
  fetchFollowingPosts: () => void;
}

export interface ProfileState {
  profile: Profile | null;
  posts: Post[];
  followers: MinimalProfile[];
  following: MinimalProfile[];
  loading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<Profile>;
  fetchUserPosts: (userId: string) => Promise<void>;
  fetchSuggestedUsers: (userId: string) => Promise<Profile[]>;
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
    profileData: Partial<Profile>
  ) => Promise<Profile>;
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
