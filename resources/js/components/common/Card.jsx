import React from "react";
import clsx from "clsx";

const Card = ({
    children,
    title,
    subtitle,
    headerAction,
    noPadding = false,
    className,
}) => {
    return (
        <div className={clsx("card", noPadding && "p-0", className)}>
            {(title || subtitle || headerAction) && (
                <div className={clsx("mb-4", noPadding && "p-6 pb-0")}>
                    <div className="flex items-start justify-between">
                        <div>
                            {title && (
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {headerAction && <div>{headerAction}</div>}
                    </div>
                </div>
            )}

            <div className={clsx(noPadding && "p-6 pt-0")}>{children}</div>
        </div>
    );
};

export default Card;
