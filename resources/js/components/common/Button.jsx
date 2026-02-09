import React from "react";
import clsx from "clsx";

const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    loading = false,
    onClick,
    className,
    ...props
}) => {
    const baseClasses =
        "btn inline-flex items-center justify-center font-medium transition-all duration-200";

    const variantClasses = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        success: "btn-success",
        danger: "btn-danger",
        outline: "btn-outline",
    };

    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={clsx(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                fullWidth && "w-full",
                (disabled || loading) && "opacity-50 cursor-not-allowed",
                className,
            )}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
