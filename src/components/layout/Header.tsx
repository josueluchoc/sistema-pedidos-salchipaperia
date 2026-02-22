import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Store, ChefHat, Settings, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '../../services/supabase';
import './Header.css';

export const Header: React.FC = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    const navItems = [
        { to: '/caja', icon: <Store size={20} />, label: 'Caja' },
        { to: '/cocina', icon: <ChefHat size={20} />, label: 'Cocina' },
        { to: '/admin', icon: <Settings size={20} />, label: 'Admin' },
    ];

    return (
        <header className="app-header">
            <div className="header-container">
                <NavLink to="/caja" className="header-logo" onClick={() => setIsMobileOpen(false)}>
                    <Flame size={28} className="header-icon" />
                    <span>La Santa Papa</span>
                </NavLink>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <nav className={`nav-links ${isMobileOpen ? 'mobile-open' : ''}`}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setIsMobileOpen(false)}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}

                    <button
                        className="nav-link"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', justifyContent: isMobileOpen ? 'flex-start' : 'center' }}
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        Salir
                    </button>
                </nav>
            </div>
        </header>
    );
};
