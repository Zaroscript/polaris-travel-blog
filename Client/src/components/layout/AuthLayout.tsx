import { ReactNode } from "react";
import AuthImagePattern from "../ui/AuthImagePattern";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showLogo?: boolean;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  showLogo = true,
}: AuthLayoutProps) => {
  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          {showLogo && (
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200
                  transition-colors"
                >
                  <img
                    src="/logo.svg"
                    alt="Logo"
                    className="w-6 h-6 text-blue-600"
                  />
                </div>
                <h1 className="text-2xl font-bold mt-2 text-gray-900">
                  {title}
                </h1>
                <p className="text-gray-500">{subtitle}</p>
              </div>
            </div>
          )}

          {children}
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern title={title} subtitle={subtitle} />
    </div>
  );
};

export default AuthLayout;
