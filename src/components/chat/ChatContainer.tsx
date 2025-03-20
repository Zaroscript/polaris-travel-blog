import { useChatStore } from "../../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { useNotificationStore } from "../../store/useNotificationStore";
import { formatMessageTime } from "../../lib/utils";
import { Message } from "../../types";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const { notifications, markAsRead } = useNotificationStore();
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark notifications as read when viewing messages
  useEffect(() => {
    if (selectedUser && authUser) {
      // Find notifications from the selected user that are unread
      const unreadNotifications = notifications.filter(notification => {
        const sender = typeof notification.sender === 'object' 
          ? notification.sender 
          : { _id: notification.sender };
          
        return sender._id === selectedUser._id && !notification.read;
      });

      // Mark each notification as read
      unreadNotifications.forEach(notification => {
        markAsRead(notification._id).catch(error => {
          console.error("Failed to mark notification as read:", error);
        });
      });
    }
  }, [selectedUser, authUser, notifications, markAsRead]);

  if (isMessagesLoading || !selectedUser || !authUser) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto border-r border-b border-t border-gray-200 rounded-tr-lg rounded-br-lg">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message, index: number) => {
          const isOwnMessage = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div className={`flex max-w-[80%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${isOwnMessage ? 'ml-2' : 'mr-2'}`}>
                  <div className="w-10 h-10 rounded-full border overflow-hidden">
                    <img
                      src={
                        isOwnMessage
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Message content */}
                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  {/* Timestamp */}
                  <div className="mb-1">
                    <time className="text-xs text-gray-500">
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                  
                  {/* Message bubble */}
                  <div className={`rounded-lg px-4 py-2 ${
                    isOwnMessage 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-full sm:max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;