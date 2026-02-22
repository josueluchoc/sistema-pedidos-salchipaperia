import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Mail, Lock } from 'lucide-react';
import { supabase } from '../services/supabase';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import './Login.css';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Navigate to Caja by default after login
            navigate('/caja');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container app-background">
            <GlassCard className="login-card" hoverEffect={false}>
                <div>
                    <div className="login-logo">
                        <Flame size={48} />
                    </div>
                    <h1 className="login-title">La Santa Papa</h1>
                    <p className="login-subtitle">Sistema de Pedidos POS</p>
                </div>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form className="login-form" onSubmit={handleLogin}>
                    <Input
                        label="Correo Electrónico"
                        type="email"
                        placeholder="usuario@sanjose.com"
                        icon={Mail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        icon={Lock}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        isLoading={loading}
                        className="mt-4"
                    >
                        Ingresar al Sistema
                    </Button>
                </form>
            </GlassCard>
        </div>
    );
};
