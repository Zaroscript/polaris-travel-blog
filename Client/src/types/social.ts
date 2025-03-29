export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  gallery?: string[];
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  travelTips?: string[];
  tags?: string[];
  destination?: string;
  mentions?: string[];
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  isLiked: boolean;
  createdAt: Date;
  replies: Reply[];
}

export interface Reply {
  id: string;
  text: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface SuggestedConnection {
  name: string;
  avatar: string;
  role: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  travelTips: string[];
  tags: string[];
  destination: string;
  gallery: string[];
  mentions: string[];
  coverImage: string;
}
