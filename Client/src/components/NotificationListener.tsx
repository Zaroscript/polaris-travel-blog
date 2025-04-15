import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useChatStore } from "@/store/useChatStore";
import { PopulatedNotification, User } from "@/types";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationListener = () => {
  const { socket } = useAuthStore();
  const { addNotification, getNotifications } = useNotificationStore();

  useEffect(() => {
    if (!socket) return;

    // Handler for new notifications
    const handleNewNotification = (data: {
      notification: PopulatedNotification;
    }) => {
      addNotification(data.notification);

      const senderName =
        typeof data.notification.sender === "object"
          ? data.notification.sender.fullName
          : "Someone";

      const messageText =
        typeof data.notification.message === "object" &&
        data.notification.message.text
          ? data.notification.message.text.substring(0, 50) +
            (data.notification.message.text.length > 50 ? "..." : "")
          : "";

      if (data.notification.type === "message") {
        toast.custom(
          (t) => (
            <div
              className={`${t.visible ? "animate-enter" : "animate-leave"} 
                        max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto 
                        flex items-center overflow-hidden cursor-pointer`}
              onClick={() => {
                // Prepare the sender data
                const sender =
                  typeof data.notification.sender === "object"
                    ? data.notification.sender
                    : {
                        _id: data.notification.sender,
                        fullName: "User",
                        email: "",
                      };

                // Store the user ID in localStorage to retrieve it after navigation
                localStorage.setItem("selectedChatUser", sender._id);

                // Dismiss toast first before navigation
                toast.dismiss(t.id);

                // Use direct window location for reliable navigation
                window.location.href = "/messages";
              }}
            >
              <div className="flex-1 w-0 p-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={
                        typeof data.notification.sender === "object" &&
                        data.notification.sender.profilePic
                          ? data.notification.sender.profilePic
                          : "/avatar.png"
                      }
                      alt=""
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {senderName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{messageText}</p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.dismiss(t.id);
                  }}
                  className="w-full border border-transparent rounded-full p-2 mx-2 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ),
          { duration: 3000 }
        );
      }
    };

    // Register event listeners
    socket.on("newNotification", handleNewNotification);

    socket.on("connect", () => {
      getNotifications();
    });

    // Cleanup event listeners
    return () => {
      socket.off("newNotification");
      socket.off("connect");
    };
  }, [socket, addNotification, getNotifications]);

  return null;
};

export default NotificationListener;
