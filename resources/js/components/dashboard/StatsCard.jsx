import React from "react";
import clsx from "clsx";

const StatsCard = ({
    title,
    value,
    icon: Icon,
    color = "primary",
    change,
    changeType,
}) => {
    const colorClasses = {
        primary: "bg-primary-50 text-primary-600",
        success: "bg-success-50 text-success-600",
        warning: "bg-warning-50 text-warning-600",
        danger: "bg-danger-50 text-danger-600",
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <div className="flex items-center gap-1 mt-2">
                            <span
                                className={clsx(
                                    "text-xs font-medium",
                                    changeType === "increase"
                                        ? "text-success-600"
                                        : "text-danger-600",
                                )}
                            >
                                {changeType === "increase" ? "↑" : "↓"} {change}
                            </span>
                            <span className="text-xs text-gray-500">
                                vs last month
                            </span>
                        </div>
                    )}
                </div>
                <div className={clsx("p-3 rounded-lg", colorClasses[color])}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
