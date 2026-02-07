import React from "react";
import clsx from "clsx";
import {
    HiCheckCircle,
    HiExclamationCircle,
    HiInformationCircle,
    HiXCircle,
} from "react-icons/hi";

const Alert = ({ type = "info", title, message, onClose, className }) => {
    const icons = {
        success: <HiCheckCircle className="h-5 w-5" />,
        error: <HiXCircle className="h-5 w-5" />,
        warning: <HiExclamationCircle className="h-5 w-5" />,
        info: <HiInformationCircle className="h-5 w-5" />,
    };

    const colors = {
        success: "bg-success-50 text-success-800 border-success-200",
        error: "bg-danger-50 text-danger-800 border-danger-200",
        warning: "bg-warning-50 text-warning-800 border-warning-200",
        info: "bg-primary-50 text-primary-800 border-primary-200",
    };

    return (
        <div className={clsx("rounded-lg border p-4", colors[type], className)}>
            <div className="flex items-start">
                <div className="flex-shrink-0">{icons[type]}</div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className="text-sm font-medium mb-1">{title}</h3>
                    )}
                    {message && <div className="text-sm">{message}</div>}
                </div>
                {onClose && (
                    <button
                        type="button"
                        className="ml-3 flex-shrink-0 inline-flex rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 transition-colors"
                        onClick={onClose}
                    >
                        <HiXCircle className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;
