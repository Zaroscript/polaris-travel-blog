import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Social: React.FC = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user?.id) {
      const socket = io(import.meta.env.VITE_SERVER_URL, {
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      socket.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.on("new_post", (post) => {
        setPosts((prevPosts) => [post, ...prevPosts]);
      });

      socket.on("new_like", (data) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === data.postId
              ? { ...post, likes: [...post.likes, data.userId] }
              : post
          )
        );
      });

      socket.on("new_comment", (data) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === data.postId
              ? { ...post, comments: [...post.comments, data.comment] }
              : post
          )
        );
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user?.id]);

  return <div>{/* Render your component content here */}</div>;
};

export default Social;
