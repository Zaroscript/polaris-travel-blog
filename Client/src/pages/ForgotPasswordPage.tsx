import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import AuthInput from "../components/ui/auth-input";
import AuthButton from "../components/ui/auth-button";
import AuthLayout from "../components/layout/AuthLayout";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

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
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Something went wrong. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle={
        !isSuccess
          ? "Enter your email to receive a password reset link"
          : "Check your email for password reset instructions"
      }
    >
      {!isSuccess ? (
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
        <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
          <p className="text-green-800 mb-4">
            We've sent an email to <strong>{email}</strong> with instructions to
            reset your password.
          </p>
          <p className="text-gray-600 text-sm">
            Please check your inbox and follow the link in the email. If you
            don't see it, check your spam folder.
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
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
