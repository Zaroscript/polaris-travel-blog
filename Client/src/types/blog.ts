export interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
    role?: string;
  };
  text: string;
  date: string;
  likes: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  tags: string[];
  likes: number;
  comments: Comment[];
  featured?: boolean;
  readTime?: string;
}

export interface BlogCardProps {
  post: BlogPost;
}
