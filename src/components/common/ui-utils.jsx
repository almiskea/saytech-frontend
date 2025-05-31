import React from 'react';
import { useLanguage } from '../../App';
import { cn } from '../../utils/helpers';

 // --- UI Components ---
 export const Button = React.forwardRef(({ children, variant = 'default', size = 'default', className, onClick, disabled, asChild = false, type = "button", ...props }, ref) => {
    const { language } = useLanguage(); 
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variantStyles = {
        default: "bg-blue-600 text-white hover:bg-blue-700/90",
        destructive: "bg-red-500 text-destructive-foreground hover:bg-red-600/90",
        outline: "border border-gray-300 bg-white hover:bg-gray-100 hover:text-accent-foreground",
        secondary: "bg-gray-200 text-secondary-foreground hover:bg-gray-300/80",
        ghost: "hover:bg-gray-100 hover:text-accent-foreground",
        link: "text-blue-600 underline-offset-4 hover:underline",
    };
    const sizeStyles = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    };
    
    const Elem = asChild && React.isValidElement(children) ? children : <button type={type} ref={ref} className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} onClick={onClick} disabled={disabled} {...props}>{children}</button>;
    
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(Elem, {
            className: cn(baseStyles, variantStyles[variant], sizeStyles[size], className, children.props.className),
            onClick,
            disabled,
            ...props,
            ...children.props,
        });
    }
    return Elem;
});

export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    const { language } = useLanguage();
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                language === 'ar' ? 'text-right' : 'text-left', 
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    const { language } = useLanguage();
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                language === 'ar' ? 'text-right' : 'text-left', 
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

export const Label = React.forwardRef(({ className, children, ...props }, ref) => (
    <label
        ref={ref}
        className={cn("block text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        {...props}
    >
        {children}
    </label>
));

export const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("rounded-lg border bg-white text-card-foreground shadow-sm", className)}
        {...props}
    />
));

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));

export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
        {children}
    </h3>
));

export const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props}>
        {children}
    </p>
));

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ));

export const Alert = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
    const { language } = useLanguage();
    const variantStyles = {
        default: "bg-background text-foreground",
        destructive: "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500",
        success: "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600",
    };
    return (
        <div
            ref={ref}
            role="alert"
            className={cn("relative w-full rounded-lg border p-4", 
                language === 'ar' ? "[&>svg~*]:pr-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:right-4 [&>svg]:top-4" 
                                  : "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
                variantStyles[variant], 
                className)}
            {...props}
        >
            {children}
        </div>
    );
});

export const AlertDescription = React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props}>
        {children}
    </div>
));

export const AlertTitle = React.forwardRef(({ className, children, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props}>
        {children}
    </h5>
));


