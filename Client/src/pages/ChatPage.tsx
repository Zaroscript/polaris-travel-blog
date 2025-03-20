import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/chat/Sidebar";
import NoChatSelected from "../components/chat/NoChatSelected";
import ChatContainer from "../components/chat/ChatContainer";
import Header from "@/components/layout/Header";
import { useEffect } from "react";

const ChatPage = () => {
  const { selectedUser, setSelectedUser, users, getUsers } = useChatStore();

  useEffect(() => {
    getUsers().then(loadedUsers => {
      const selectedUserId = localStorage.getItem('selectedChatUser');
      
      if (selectedUserId && loadedUsers.length > 0) {
        const userToSelect = loadedUsers.find(user => user._id === selectedUserId);
        
        if (userToSelect) {
          setSelectedUser(userToSelect);
        }
        localStorage.removeItem('selectedChatUser');
      }
    });
  }, [getUsers, setSelectedUser]);
  return (
    <>
    <Header />
    <div className="h-screen ">
      <div className="flex items-center justify-center pt-2 px-4 ">
        <div className="rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-12rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
export default ChatPage;
