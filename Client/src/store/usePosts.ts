// store/usePosts.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Only include fields that users can edit
type EditablePostFields = {
  title: string;
  content: string;
  destination: string;
  tags: string[];
  mentions: string[];
  coverImage?: string;
  contentImages?: string[];
};

type Post = EditablePostFields & {
  id: string;
  createdAt: string;
  updatedAt?: string;
};

type PostsStore = {
  posts: Post[];
  addPost: (post: EditablePostFields) => void;
  editPost: (id: string, updatedFields: Partial<EditablePostFields>) => void;
  deletePost: (id: string) => void;
  getPostById: (id: string) => Post | undefined;
};

export const usePosts = create<PostsStore>()(
  persist(
    (set, get) => ({
      posts: [],

      // Add new post with auto-generated metadata
      addPost: (post) => {
        const newPost: Post = {
          ...post,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ posts: [newPost, ...state.posts] }));
      },

      // Only update editable fields and set updatedAt
      editPost: (id, updatedFields) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  ...updatedFields,
                  updatedAt: new Date().toISOString(),
                }
              : post
          ),
        }));
      },

      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        }));
      },

      getPostById: (id) => {
        return get().posts.find((post) => post.id === id);
      },
    }),
    {
      name: "posts-storage",
      storage: {
        getItem: (key) => {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : undefined;
        },
        setItem: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      },
    }
  )
);
