import { useChatStore } from "../../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { useNotificationStore } from "../../store/useNotificationStore";
import { formatMessageTime } from "../../lib/utils";
import { Message } from "../../types";
import { format } from "date-fns";
import { Check, CheckCheck, Image, Paperclip, SendHorizontal, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
  const [isTyping, setIsTyping] = useState(false);
  const [messageText, setMessageText] = useState("");

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
      const unreadNotifications = notifications.filter((notification) => {
        const sender =
          typeof notification.sender === "object"
            ? notification.sender
            : { _id: notification.sender };

        return sender._id === selectedUser._id && !notification.read;
      });

      // Mark each notification as read
      unreadNotifications.forEach((notification) => {
        markAsRead(notification._id).catch((error) => {
          console.error("Failed to mark notification as read:", error);
        });
      });
    }
  }, [selectedUser, authUser, notifications, markAsRead]);

  // Simulate typing indicator for demo purposes
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    
    if (messageText.length > 0) {
      // Randomly show typing indicator
      if (Math.random() > 0.7) {
        setIsTyping(true);
        typingTimeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    }
    
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [messageText]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = new Date(message.createdAt);
    const dateKey = format(date, 'MMM dd, yyyy');
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(message);
    return groups;
  }, {});

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
    <div className="flex flex-1 flex-col overflow-hidden border-r border-b border-t border-border rounded-tr-lg rounded-br-lg bg-background relative">
      <ChatHeader />

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 bg-gradient-to-b from-muted/10 to-background scroll-smooth">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-4">
              <div className="flex-grow h-px bg-border/50"></div>
              <Badge variant="outline" className="mx-2 bg-background/80 text-xs font-medium">
                {date}
              </Badge>
              <div className="flex-grow h-px bg-border/50"></div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-4">
              {dateMessages.map((message: Message, index: number) => {
                const isOwnMessage = message.senderId === authUser._id;
                const isFirstInGroup = index === 0 || dateMessages[index - 1].senderId !== message.senderId;
                const isLastInGroup = index === dateMessages.length - 1 || dateMessages[index + 1].senderId !== message.senderId;
                
                return (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} ${isLastInGroup ? 'mb-3' : 'mb-1'}`}
                    ref={index === dateMessages.length - 1 && date === Object.keys(groupedMessages)[Object.keys(groupedMessages).length - 1] ? messageEndRef : null}
                  >
                    <div
                      className={`flex max-w-[85%] ${
                        isOwnMessage ? "flex-row-reverse" : "flex-row"
                      } items-end`}
                    >
                      {/* Avatar - only show for first message in group */}
                      {isFirstInGroup && (
                        <div className={`flex-shrink-0 ${isOwnMessage ? "ml-2" : "mr-2"} mb-1`}>
                          <Avatar className="h-8 w-8 border border-border">
                            <AvatarImage
                              src={
                                isOwnMessage
                                  ? authUser.profilePic || "/avatar.png"
                                  : selectedUser.profilePic || "/avatar.png"
                              }
                              alt="profile pic"
                            />
                            <AvatarFallback>
                              {isOwnMessage 
                                ? authUser.fullName?.charAt(0) || "U"
                                : selectedUser.fullName?.charAt(0) || "U"
                              }
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}

                      {/* Message content */}
                      <div className="flex flex-col">
                        {/* Sender name - only show for first message in group from others */}
                        {isFirstInGroup && !isOwnMessage && (
                          <div className="mb-1 ml-1">
                            <span className="text-xs font-medium text-foreground/80">
                              {selectedUser.fullName}
                            </span>
                          </div>
                        )}

                        {/* Message bubble */}
                        <div
                          className={`px-4 py-2.5 max-w-full ${
                            isOwnMessage
                              ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                              : "bg-muted rounded-2xl rounded-bl-sm"
                          } ${
                            message.image ? "p-2" : ""
                          }`}
                        >
                          {message.image && (
                            <div className="mb-2 overflow-hidden rounded-lg">
                              <img
                                src={message.image}
                                alt="Attachment"
                                className="max-w-full sm:max-w-[250px] rounded-md hover:scale-[0.98] transition-transform cursor-pointer"
                              />
                            </div>
                          )}
                          {message.text && <p className="break-words">{message.text}</p>}
                        </div>

                        {/* Timestamp and read status */}
                        <div className={`flex items-center mt-1 text-xs text-muted-foreground ${isOwnMessage ? 'justify-end mr-1' : 'justify-start ml-1'}`}>
                          <time className="text-2xs">
                            {format(new Date(message.createdAt), 'h:mm a')}
                          </time>
                          
                          {isOwnMessage && (
                            <span className="ml-1">
                              {/* Message read status indicator - For future implementation */}
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-start mb-4"
            >
              <div className="flex items-end">
                <Avatar className="h-8 w-8 mr-2 border border-border">
                  <AvatarImage
                    src={selectedUser.profilePic || "/avatar.png"}
                    alt="profile pic"
                  />
                  <AvatarFallback>
                    {selectedUser.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex space-x-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Empty space to allow scrolling past last message */}
        <div className="h-4"></div>
      </div>

      {/* Enhanced message input */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="flex items-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 flex-shrink-0">
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex-grow relative">
            <textarea
              placeholder="Type a message..."
              className="w-full rounded-2xl border border-border bg-background resize-none p-3 pr-12 min-h-[50px] max-h-[120px] focus:outline-none focus:ring-1 focus:ring-primary"
              rows={1}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{ overflowY: 'auto' }}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 absolute right-2 bottom-2">
                    <Smile className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add emoji</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="rounded-full h-10 w-10 flex-shrink-0">
                  <SendHorizontal className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
