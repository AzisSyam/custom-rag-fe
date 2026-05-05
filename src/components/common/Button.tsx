import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-38 disabled:pointer-events-none active:scale-[0.97]";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary/90 rounded-full elevation-1 hover:elevation-2",
    secondary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 rounded-full",
    outline: "border border-outline text-primary hover:bg-primary/5 rounded-full",
    text: "text-primary hover:bg-primary/5 rounded-full"
  };
  
  const sizes = {
    sm: "px-4 py-1.5 text-xs h-8",
    md: "px-6 py-2.5 text-sm h-10",
    lg: "px-8 py-3 text-base h-12"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
