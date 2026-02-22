import React from 'react';
import type { LucideIcon } from 'lucide-react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    icon?: LucideIcon;
    error?: string;
    multiline?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
    ({ label, icon: Icon, error, className = '', multiline, ...props }, ref) => {

        const fieldClasses = `input-field ${Icon ? 'has-icon' : ''} ${error ? 'has-error' : ''} ${multiline ? 'input-textarea' : ''}`;

        return (
            <div className={`input-wrapper ${className}`}>
                {label && (
                    <label className="input-label">
                        {label}
                    </label>
                )}
                <div className="input-container">
                    {Icon && (
                        <div className="input-icon">
                            <Icon size={18} />
                        </div>
                    )}

                    {multiline ? (
                        <textarea
                            ref={ref as React.Ref<HTMLTextAreaElement>}
                            className={fieldClasses}
                            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                        />
                    ) : (
                        <input
                            ref={ref as React.Ref<HTMLInputElement>}
                            className={fieldClasses}
                            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                        />
                    )}
                </div>
                {error && (
                    <span className="input-error-msg">{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
