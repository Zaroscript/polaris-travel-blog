import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/chat/Sidebar";
import NoChatSelected from "../components/chat/NoChatSelected";
import ChatContainer from "../components/chat/ChatContainer";
import Layout from "@/components/layout/Layout";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquareMore } from "lucide-react";

const ChatPage = () => {
  const { selectedUser, setSelectedUser, users, getUsers } = useChatStore();

  useEffect(() => {
    getUsers().then((loadedUsers) => {
      const selectedUserId = localStorage.getItem("selectedChatUser");

      if (selectedUserId && loadedUsers.length > 0) {
        const userToSelect = loadedUsers.find(
          (user) => user._id === selectedUserId
        );

        if (userToSelect) {
          setSelectedUser(userToSelect);
        }
        localStorage.removeItem("selectedChatUser");
      }
    });
  }, [getUsers, setSelectedUser]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 min-h-screen">
        {/* Chat Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span className="inline-block h-1 w-6 bg-primary"></span>
            CONNECT WITH TRAVELERS
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Travel Chat</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MessageSquareMore className="h-4 w-4" />
              <span>Connect with fellow travelers and local experts</span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-xl border shadow-md w-full max-w-6xl mx-auto h-[calc(100vh-12rem)]"
        >
          <div className="flex h-full rounded-xl overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ChatPage;
