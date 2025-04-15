import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const FloatingChatIcon = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/messages");
  };

  return (
    <button
      className="floating-chat-button"
      onClick={handleClick}
      aria-label="Chat"
      title="Chat"
    >
      <MessageCircle size={28} color="white" />
    </button>
  );
};

export default FloatingChatIcon;
