import React from "react";
import clsx from "clsx";

const Badge = ({ children, variant = "primary", size = "md", className }) => {
    const variantClasses = {
        primary: "badge-primary",
        secondary: "badge-secondary",
        success: "badge-success",
        warning: "badge-warning",
        danger: "badge-danger",
    };

    const sizeClasses = {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
    };

    return (
        <span
            className={clsx(
                "badge",
                variantClasses[variant],
                sizeClasses[size],
                className,
            )}
        >
            {children}
        </span>
    );
};

export default Badge;
