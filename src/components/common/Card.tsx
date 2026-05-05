import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'elevated' | 'filled' | 'outlined';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'filled' 
}) => {
  const variants = {
    elevated: "bg-surface-container-low elevation-1 hover:elevation-2 transition-shadow",
    filled: "bg-surface-container",
    outlined: "bg-surface border border-outline-variant"
  };

  return (
    <div className={`rounded-xl ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
