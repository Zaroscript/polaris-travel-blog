import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import NotificationListener from "./components/NotificationListener";
import Profile from "@/pages/Profile";

import Index from "./pages/Index";
import About from "./pages/About";
import Destinations from "./pages/Destinations";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import Social from "./pages/Social";
import NotFound from "./pages/NotFound";
import ChatPage from "./pages/ChatPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const queryClient = new QueryClient();

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Toast notifications container */}
        <Toaster position="top-right" />

        {/* Notification listener for real-time updates */}
        {authUser && <NotificationListener />}
        <div data-theme="light">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/social" element={<Social />} />

            <Route
              path="/messages"
              element={authUser ? <ChatPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />

            
            <Route path="user/profile/:id" element={<Profile />} />

            <Route path="*" element={<NotFound />} />

            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
