export interface Post {
  id: string;
  content: string;
  images: string[];
  authorId: string;
  likes: string[];
  comments: Comment[];
  destination?: {
    id: string;
    name: string;
    image: string;
  };
  createdAt: string;
  gallery: string[];
}

export interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    profileImage: string;
  };
  likes: string[];
  createdAt: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    profileImage: string;
  };
  likes: string[];
  createdAt: string;
}

export interface SuggestedConnection {
  id: string;
  name: string;
  profileImage: string;
  role: string;
}

export interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onCopyLink: (postId: string) => void;
  onFollow: (userId: string) => void;
  isLiked: boolean;
  isSaved: boolean;
  isCopied: boolean;
  isFollowing: boolean;
}

export interface RightSidebarProps {
  suggestedConnections: SuggestedConnection[];
  following: string[];
  onFollow: (userId: string) => void;
  newsItems: string[];
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  about: string;
  status: string;
  birthDate: string;
  profileImage: string;
  coverImage: string;
  connections: { id: string; name: string; profileImage: string }[];
  following: { id: string; name: string; profileImage: string }[];
  followers: { id: string; name: string; profileImage: string }[];
  skills: string[];
  experience: {
    company: string;
    role: string;
    duration: string;
    logo: string;
    isPresent: boolean;
  }[];
  isVerified: boolean;
  joinedDate: string;
}
