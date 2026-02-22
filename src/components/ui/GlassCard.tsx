import React from 'react';
import './GlassCard.css';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    hoverEffect = false,
    className = '',
    ...props
}) => {
    return (
        <div
            className={`glass-panel glass-card-wrapper overflow-hidden ${hoverEffect ? 'hover-effect' : ''} ${className}`}
            {...props}
        >
            <div className="glass-card-highlight"></div>
            {children}
        </div>
    );
};
