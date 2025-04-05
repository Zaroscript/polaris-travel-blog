import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthInput from "../components/ui/auth-input";
import AuthButton from "../components/ui/auth-button";
import AuthLayout from "../components/layout/AuthLayout";
import toast from "react-hot-toast";

interface FormErrors {
  fullName: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = {
      fullName: "",
      email: "",
      password: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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

    try {
      await signup(formData);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Get started with your free account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={User}
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          error={errors.fullName}
        />

        <AuthInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

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
          error={errors.password}
        />

        <AuthButton
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSigningUp}
          loadingText="Creating account..."
        >
          Create Account
        </AuthButton>
      </form>

      <div className="text-center">
        <p className="text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;
