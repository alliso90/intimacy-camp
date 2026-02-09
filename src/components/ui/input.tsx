import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200",
                        "placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "dark:border-gray-700 dark:placeholder:text-gray-500",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
