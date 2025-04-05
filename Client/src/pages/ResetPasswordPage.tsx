import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Check } from "lucide-react";
import AuthInput from "../components/ui/auth-input";
import AuthButton from "../components/ui/auth-button";
import AuthLayout from "../components/layout/AuthLayout";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

interface PasswordErrors {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const { token } = useParams();
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
    confirmPassword: "",
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        await axiosInstance.get(`/auth/validate-reset-token/${token}`);
        setIsTokenValid(true);
      } catch (error) {
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const validateForm = () => {
    let isValid = true;
    const newErrors: PasswordErrors = {
      password: "",
      confirmPassword: "",
    };

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      setIsSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={isSuccess ? "Password Reset Successful" : "Create New Password"}
      subtitle={
        !isSuccess
          ? "Enter your new password below"
          : "Your password has been reset successfully"
      }
    >
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

      {isTokenValid && !isSuccess && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightIcon={
              showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )
            }
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
            rightIcon={
              showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )
            }
            onRightIconClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
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
      )}

      {isSuccess && (
        <div className="text-center">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-green-800">
              Your password has been reset successfully!
            </p>
            <p className="text-gray-600 text-sm mt-2">
              You will be redirected to the login page shortly.
            </p>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
