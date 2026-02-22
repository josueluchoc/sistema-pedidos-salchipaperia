import React from 'react';
import type { LucideIcon } from 'lucide-react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    fullWidth?: boolean;
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    fullWidth,
    isLoading,
    className = '',
    disabled,
    ...props
}) => {
    return (
        <button
            className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${isLoading ? 'loading' : ''} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Micro interaction ripple effect */}
            <div className="btn-ripple"></div>

            <span className="btn-content">
                {isLoading ? (
                    <div className="spinner" />
                ) : Icon ? (
                    <Icon size={18} />
                ) : null}
                {children}
            </span>
        </button>
    );
};
