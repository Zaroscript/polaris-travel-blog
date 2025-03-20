import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import AuthImagePattern from "../components/ui/AuthImagePattern";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import AuthInput from "../components/ui/auth-input";
import AuthButton from "../components/ui/auth-button";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
        await axiosInstance.post("/auth/forgot-password", { email });
        setIsSuccess(true);
        toast.success("Password reset instructions sent to your email");
      } catch (error: unknown) {
        // Type guard to handle axios error
        const errorMessage = error instanceof Error 
          ? error.message 
          : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Something went wrong. Please try again.";
        
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200
                transition-colors"
              >
                <img src="/logo.svg" alt="Logo" className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold mt-2 text-gray-900">Forgot Password</h1>
              <p className="text-gray-500">
                {!isSuccess 
                  ? "Enter your email to receive a password reset link" 
                  : "Check your email for password reset instructions"}
              </p>
            </div>
          </div>

          {!isSuccess ? (
            /* Reset Request Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <AuthInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />

              <AuthButton
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
                loadingText="Sending..."
              >
                Send Reset Link
              </AuthButton>
            </form>
          ) : (
            /* Success Message */
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
              <p className="text-green-800 mb-4">
                We've sent an email to <strong>{email}</strong> with instructions to reset your password.
              </p>
              <p className="text-gray-600 text-sm">
                Please check your inbox and follow the link in the email. If you don't see it, check your spam folder.
              </p>
            </div>
          )}

          <div className="text-center pt-4">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title="Reset your password"
        subtitle="We'll help you get back into your account safely and securely."
      />
    </div>
  );
};

export default ForgotPasswordPage;