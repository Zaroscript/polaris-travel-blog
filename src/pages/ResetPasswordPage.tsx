import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Check } from "lucide-react";
import AuthImagePattern from "../components/ui/AuthImagePattern";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import AuthInput from "../components/ui/auth-input";
import AuthButton from "../components/ui/auth-button";

interface PasswordErrors {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [errors, setErrors] = useState<PasswordErrors>({
    password: "",
    confirmPassword: ""
  });

  // Check token validity
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      toast.error("Invalid password reset link");
      return;
    }
  }, [token]);

  const validatePasswords = () => {
    const newErrors: PasswordErrors = {
      password: "",
      confirmPassword: ""
    };
    
    let valid = true;
    
    if (!password.trim()) {
      newErrors.password = "Please enter a new password";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;
    
    setIsSubmitting(true);
    
    try {
      await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword: password
      });
      
      setIsSuccess(true);
      toast.success("Password reset successful");
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: unknown) {
      toast.error(error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to reset password. The link may have expired.");
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
              <h1 className="text-2xl font-bold mt-2 text-gray-900">
                {isSuccess ? "Password Reset Successful" : "Create New Password"}
              </h1>
              <p className="text-gray-500">
                {!isSuccess 
                  ? "Enter your new password below" 
                  : "Your password has been reset successfully"}
              </p>
            </div>
          </div>

          {!isTokenValid && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
              <p className="text-red-800 mb-2">
                Invalid or expired password reset link
              </p>
              <p className="text-gray-600 text-sm">
                Please request a new password reset link from the login page.
              </p>
            </div>
          )}

          {isTokenValid && !isSuccess ? (
            /* Reset Password Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <AuthInput
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                rightIcon={showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                onRightIconClick={() => setShowPassword(!showPassword)}
                error={errors.password}
              />

              <AuthInput
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                rightIcon={showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                error={errors.confirmPassword}
              />

              <AuthButton
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
                loadingText="Resetting..."
              >
                Reset Password
              </AuthButton>
            </form>
          ) : isSuccess && (
            /* Success Message */
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-green-800 mb-4">
                Your password has been reset successfully!
              </p>
              <p className="text-gray-600 text-sm mb-4">
                You will be redirected to the login page in a few seconds.
              </p>
              <div className="w-full bg-gray-200 h-1 rounded overflow-hidden">
                <div className="bg-green-500 h-1 animate-progress"></div>
              </div>
            </div>
          )}

          <div className="text-center pt-4">
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title="Secure your account"
        subtitle="Create a strong password to keep your account safe and protected."
      />
    </div>
  );
};

export default ResetPasswordPage;