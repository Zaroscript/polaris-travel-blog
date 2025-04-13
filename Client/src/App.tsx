import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/globals.css";
import "./styles/main.css";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import NotificationListener from "./components/NotificationListener";
import Index from "./pages/Index";
import About from "./pages/About";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import Social from "./pages/Social";
import NotFound from "./pages/NotFound";
import ChatPage from "./pages/ChatPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Profile from "@/pages/Profile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import { TravelLoader } from "./components/ui/travel-loader";
import ComingSoon from "./pages/ComingSoon";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <TravelLoader variant="default" text="Loading..." size="lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      {authUser && <NotificationListener />}

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/social" element={!authUser ? <Navigate to="/login" /> : <Social />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/coming-soon" element={<ComingSoon />} />

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

        <Route
          path="user/profile/:id"
          element={!authUser ? <Navigate to="/login" /> : <Profile />}
        />


       
        <Route path="*" element={<NotFound />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="user/settings/*" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
