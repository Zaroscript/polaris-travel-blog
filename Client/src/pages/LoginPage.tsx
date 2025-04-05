import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthInput from "../components/ui/auth-input";
import AuthButton from "../components/ui/auth-button";
import AuthLayout from "../components/layout/AuthLayout";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  const navigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <div className="space-y-1">
          <AuthInput
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={Lock}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            rightIcon={
              showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )
            }
            onRightIconClick={() => setShowPassword(!showPassword)}
          />

          <div className="text-right">
            <button
              type="button"
              onClick={navigateToForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <AuthButton
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoggingIn}
          loadingText="Signing in..."
        >
          Sign in
        </AuthButton>
      </form>

      <div className="text-center">
        <p className="text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Create account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
