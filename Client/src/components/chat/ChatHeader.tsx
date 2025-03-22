import { X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

interface ChatHeaderProps {
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const ChatHeader = ({ onBackClick, showBackButton = false }: ChatHeaderProps) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleClose = () => {
    setSelectedUser(null);
    localStorage.removeItem('selectedChatUser');
    
    // Call back function if provided
    if (onBackClick) {
      onBackClick();
    }
  };

  if (!selectedUser) return <div className="p-2.5 border-b border-gray-200"></div>;

  return (
    <div className="p-2.5 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={selectedUser?.profilePic || "/avatar.png"} 
                alt={selectedUser?.fullName} 
                className="w-full h-full object-cover"
              />
            </div>
            {onlineUsers.includes(selectedUser?._id) && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-gray-900">{selectedUser?.fullName}</h3>
            <p className="text-sm text-gray-500">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={handleClose}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;