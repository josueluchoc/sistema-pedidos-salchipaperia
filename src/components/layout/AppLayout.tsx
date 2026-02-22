import React from 'react';
import { Header } from './Header';

interface AppLayoutProps {
    children: React.ReactNode;
    hideHeader?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, hideHeader = false }) => {
    return (
        <div className="min-h-screen app-background">
            {!hideHeader && <Header />}

            <main className="container-main">
                {children}
            </main>
        </div>
    );
};
