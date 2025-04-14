import { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { Message, User } from "../../types";
import { axiosInstance } from "../../lib/axios";

// Interface for user with last message
interface UserWithLastMessage extends User {
  lastMessage?: {
    text?: string;
    image?: string;
    createdAt: string;
  };
}

// User item component to keep the main component cleaner
const UserItem = ({
  user,
  isSelected,
  isOnline,
  onClick,
}: {
  user: UserWithLastMessage;
  isSelected: boolean;
  isOnline: boolean;
  onClick: () => void;
}) => {
  // Format and truncate last message
  const getLastMessagePreview = () => {
    if (!user.lastMessage) return "No messages yet";

    if (user.lastMessage.image && !user.lastMessage.text) {
      return "📷 Image";
    }

    if (user.lastMessage.text) {
      // Truncate text to 20 characters
      return user.lastMessage.text.length > 20
        ? user.lastMessage.text.substring(0, 20) + "..."
        : user.lastMessage.text;
    }

    return "No messages yet";
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full p-1 lg:p-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-1
        hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
        ${
          isSelected
            ? "bg-gray-100 dark:bg-gray-800 border-l-4 border-blue-500"
            : ""
        }
      `}
    >
      <div className="relative lg:mx-0">
        <img
          src={user.profilePic || "/avatar.png"}
          alt={user.fullName}
          className="w-10 h-10 object-contain rounded-full"
        />
        {isOnline && (
          <span
            className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
            rounded-full border-2 border-white"
          />
        )}
      </div>

      <div className="block text-left min-w-0 ml-2 flex-1">
        <div className="font-medium truncate text-gray-900 dark:text-gray-100">
          {user.fullName}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {getLastMessagePreview()}
        </div>
      </div>
    </button>
  );
};

// Toggle switch component
const ToggleSwitch = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => (
  <label className="cursor-pointer flex items-center gap-2">
    <div className="relative flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div
        className="w-10 h-5 bg-gray-200 dark:bg-gray-800 peer-focus:outline-none rounded-full peer 
                     peer-checked:after:translate-x-full peer-checked:after:border-white 
                     after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                     after:bg-white after:border-gray-300 after:border after:rounded-full 
                     after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-gray-900  "
      ></div>
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

// Main Sidebar component
const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    messages, // Get current messages from store
  } = useChatStore();

  const { authUser, onlineUsers, socket } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [usersWithLastMessages, setUsersWithLastMessages] = useState<
    UserWithLastMessage[]
  >([]);
  const [messageCounter, setMessageCounter] = useState(0); // Counter to trigger re-fetch

  // Fetch users when component mounts
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    // When a new message arrives, increment counter to trigger re-fetch
    const handleNewMessage = () => {
      setMessageCounter((prev) => prev + 1);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  // Update when messages array changes (when sending a new message)
  useEffect(() => {
    if (messages.length > 0 && selectedUser) {
      // Update the last message for the selected user
      setUsersWithLastMessages((prevUsers) => {
        return prevUsers.map((user) => {
          if (user._id === selectedUser._id) {
            // Find the latest message
            const latestMessage = messages[messages.length - 1];
            return {
              ...user,
              lastMessage: {
                text: latestMessage.text,
                image: latestMessage.image,
                createdAt: latestMessage.createdAt,
              },
            };
          }
          return user;
        });
      });
    }
  }, [messages, selectedUser]);

  // Fetch last messages for each user
  useEffect(() => {
    const fetchLastMessages = async () => {
      if (!users.length || !authUser) return;

      try {
        // Create a copy of users to add last messages
        const usersWithMessages: UserWithLastMessage[] = [...users];

        // Fetch last messages in parallel
        const promises = users.map(async (user) => {
          try {
            // Get all messages with this user
            const response = await axiosInstance.get<Message[]>(
              `/messages/${user._id}`
            );
            const messages = response.data;

            // Find user in our array
            const userIndex = usersWithMessages.findIndex(
              (u) => u._id === user._id
            );
            if (userIndex !== -1 && messages.length > 0) {
              // Get the most recent message
              const lastMessage = messages[messages.length - 1];
              usersWithMessages[userIndex] = {
                ...usersWithMessages[userIndex],
                lastMessage: {
                  text: lastMessage.text,
                  image: lastMessage.image,
                  createdAt: lastMessage.createdAt,
                },
              };
            }
          } catch (error) {
            console.error(
              `Failed to fetch messages for user ${user._id}:`,
              error
            );
          }
        });

        // Wait for all fetches to complete
        await Promise.all(promises);

        // Update state with users that have last messages
        setUsersWithLastMessages(usersWithMessages);
      } catch (error) {
        console.error("Failed to fetch last messages:", error);
      }
    };

    fetchLastMessages();
  }, [users, authUser, messageCounter]); // Re-fetch when messageCounter changes

  // Filter users based on online status if needed
  const filteredUsers = showOnlineOnly
    ? usersWithLastMessages.filter((user) => onlineUsers.includes(user._id))
    : usersWithLastMessages;

  // Show loading skeleton when users are being loaded
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full border-r border-b border-t border-l rounded-tl-lg rounded-bl-lg border-gray-200 dark:border-gray-800 flex  max-w-72 min-w-40 flex-col transition-all duration-200">
      {/* Header Section */}
      <div className="border-b border-gray-200  dark:border-gray-800 w-full p-3">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-gray-700" />
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Contacts
          </span>
          <span className="text-xs text-gray-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>

        {/* Filter Controls - Only visible on larger screens */}
        <div className="mt-3 flex items-center gap-2 dark:text-gray-200">
          <ToggleSwitch
            checked={showOnlineOnly}
            onChange={setShowOnlineOnly}
            label="Show online only"
          />
        </div>
      </div>

      {/* Users List Section */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              isSelected={selectedUser?._id === user._id}
              isOnline={onlineUsers.includes(user._id)}
              onClick={() => setSelectedUser(user)}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 ">
            {showOnlineOnly ? "No online users" : "No contacts available"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
