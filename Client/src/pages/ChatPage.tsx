import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/chat/Sidebar";
import NoChatSelected from "../components/chat/NoChatSelected";
import ChatContainer from "../components/chat/ChatContainer";
import Layout from "@/components/layout/Layout";
import { useEffect } from "react";

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
      <div className="min-h-screen pt-4">
        <div className="flex items-center justify-center px-4">
          <div className="rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-6rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              <Sidebar />
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
