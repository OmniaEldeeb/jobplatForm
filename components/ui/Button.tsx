import { forwardRef } from "react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-950",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.98]",
          // Sizes
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "md" && "px-4 py-2.5 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          // Variants
          variant === "primary" && [
            "bg-primary-600 hover:bg-primary-700 text-white",
            "focus:ring-primary-500",
            "dark:bg-primary-500 dark:hover:bg-primary-600",
          ],
          variant === "secondary" && [
            "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200",
            "border border-gray-200 dark:border-gray-700",
            "hover:bg-gray-50 dark:hover:bg-gray-700",
            "focus:ring-gray-400",
          ],
          variant === "ghost" && [
            "text-gray-600 dark:text-gray-400",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "hover:text-gray-900 dark:hover:text-gray-100",
            "focus:ring-gray-400",
          ],
          variant === "danger" && [
            "bg-red-600 hover:bg-red-700 text-white",
            "focus:ring-red-500",
          ],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";