import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
                secondary:
                    "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/30",
                outline:
                    "border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950",
                ghost: "hover:bg-white/10 hover:text-purple-600",
                link: "text-purple-600 underline-offset-4 hover:underline",
                destructive:
                    "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 px-4 text-xs",
                lg: "h-12 px-8 text-base",
                xl: "h-14 px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
