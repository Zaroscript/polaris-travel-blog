import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

// Define the NavItemProps interface
interface NavItemProps {
  label: string; 
  hasDropdown?: boolean; 
}

export default function NavItem({ label, hasDropdown }: NavItemProps) {
  return (
    <Link
      to="#"
      className="flex items-center text-gray-600 hover:text-gray-900"
    >
      <span className="font-medium">{label}</span>
      {hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
    </Link>
  );
}
