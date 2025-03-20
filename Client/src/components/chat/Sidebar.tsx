import { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { User } from "../../types";

// User item component to keep the main component cleaner
const UserItem = ({ 
  user, 
  isSelected, 
  isOnline, 
  onClick 
}: { 
  user: User; 
  isSelected: boolean; 
  isOnline: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      w-full p-1 lg:p-2 border-b border-gray-200 flex items-center gap-1
      hover:bg-gray-100 transition-colors
      ${isSelected ? "bg-gray-100 border-l-4 border-blue-500" : ""}
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

    {/* User info - only visible on larger screens */}
    <div className="hidden lg:block text-left min-w-0">
      <div className="font-medium truncate text-gray-900">{user.fullName}</div>
      <div className="text-xs text-gray-500">
        {isOnline ? "Online" : "Offline"}
      </div>
    </div>
  </button>
);

// Toggle switch component
const ToggleSwitch = ({
  checked,
  onChange,
  label
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
      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer 
                     peer-checked:after:translate-x-full peer-checked:after:border-white 
                     after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                     after:bg-white after:border-gray-300 after:border after:rounded-full 
                     after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600">
      </div>
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

// Main Sidebar component
const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on online status if needed
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  // Show loading skeleton when users are being loaded
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-b border-t border-l rounded-tl-lg rounded-bl-lg border-gray-200 flex flex-col transition-all duration-200">
      {/* Header Section */}
      <div className="border-b border-gray-200 w-full p-3">
        <div className="hidden lg:flex items-center gap-2">
          <Users className="w-6 h-6 text-gray-700" />
          <span className="font-medium hidden lg:block text-gray-800">Contacts</span>
          <span className="text-xs text-gray-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
        
        {/* Filter Controls - Only visible on larger screens */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
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