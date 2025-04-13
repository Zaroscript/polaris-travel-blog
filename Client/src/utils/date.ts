import { formatDistanceToNow, isValid } from "date-fns";

/**
 * Safely formats a date string to a relative time string (e.g., "5 minutes ago")
 * with proper validation to prevent "Invalid time value" errors
 * 
 * @param dateString - The date string to format
 * @param fallback - The fallback string to use if the date is invalid (default: "Recently")
 * @returns A formatted relative time string
 */
export const formatRelativeTime = (dateString: string | Date, fallback: string = "Recently") => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    // Check if date is valid
    if (!dateString || !isValid(date)) {
      return fallback;
    }
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Invalid date format:", dateString);
    return fallback;
  }
};
