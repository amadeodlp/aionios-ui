'use client';

import React from 'react';
import Link from 'next/link';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
};

const Button = ({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  href,
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center transition-colors font-medium';
  
  const variantStyles = {
    primary: 'bg-foreground text-background hover:bg-foreground/90',
    secondary: 'border border-foreground/50 hover:bg-foreground/5',
    text: 'hover:bg-foreground/5'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-3 text-lg'
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className} rounded-md`;
  
  // If href is provided, render as Link component
  if (href) {
    return (
      <Link 
        href={href} 
        className={buttonClasses} 
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }
  
  // Otherwise, render as button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;