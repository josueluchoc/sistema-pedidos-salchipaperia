import React, { useState, useEffect } from 'react';
import type { Order } from '../types';
import { KitchenOrderCard } from '../components/kitchen/KitchenOrderCard';
import { GlassCard } from '../components/ui/GlassCard';
import { supabase } from '../services/supabase';
import './CocinaView.css';

type TabType = 'activos' | 'completados' | 'eliminados';

export const CocinaView: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('activos');

    const fetchOrders = async () => {
        const { data } = await supabase
            .from('orders')
            .select(`
                *,
                items:order_items(
                    *,
                    product:products(*)
                )
            `)
            .order('created_at', { ascending: false })
            .limit(100);

        if (data) setOrders(data as any[]);
    };

    useEffect(() => {
        fetchOrders();

        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public' },
                () => {
                    fetchOrders();
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const handleComplete = async (id: string) => {
        await supabase.from('orders').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', id);
        // Optimistic UI update
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'completed', completed_at: new Date().toISOString() } : o));
    };

    const handleDelete = async (id: string) => {
        await supabase.from('orders').update({ status: 'deleted', deleted_at: new Date().toISOString() }).eq('id', id);
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'deleted', deleted_at: new Date().toISOString() } : o));
    };

    const handleRestore = async (id: string) => {
        await supabase.from('orders').update({ status: 'pending', deleted_at: null, completed_at: null }).eq('id', id);
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'pending', deleted_at: undefined, completed_at: undefined } : o));
    };

    // Filter based on tab
    const displayedOrders = orders.filter(o => {
        if (activeTab === 'activos') return o.status === 'pending';
        if (activeTab === 'completados') return o.status === 'completed';
        if (activeTab === 'eliminados') return o.status === 'deleted';
        return false;
    });

    // Sort by created_at (oldest first for activos)
    displayedOrders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return (
        <div className="cocina-layout">
            {/* Top Header / Tabs */}
            <div className="cocina-header">
                <GlassCard className="cocina-tabs" hoverEffect={false}>
                    <button
                        className={`cocina-tab ${activeTab === 'activos' ? 'active-tab' : ''}`}
                        onClick={() => setActiveTab('activos')}
                    >
                        🔥 Pedidos Activos ({orders.filter(o => o.status === 'pending').length})
                    </button>
                    <button
                        className={`cocina-tab ${activeTab === 'completados' ? 'completed-tab' : ''}`}
                        onClick={() => setActiveTab('completados')}
                    >
                        ✅ Completados ({orders.filter(o => o.status === 'completed').length})
                    </button>
                    <button
                        className={`cocina-tab ${activeTab === 'eliminados' ? 'deleted-tab' : ''}`}
                        onClick={() => setActiveTab('eliminados')}
                    >
                        🗑️ Eliminados ({orders.filter(o => o.status === 'deleted').length})
                    </button>
                </GlassCard>
            </div>

            {/* Grid */}
            <div className="cocina-grid">
                {displayedOrders.length === 0 ? (
                    <div className="cocina-empty">
                        <div className="empty-emoji">
                            {activeTab === 'activos' ? '👨‍🍳' : activeTab === 'completados' ? '🎯' : '👻'}
                        </div>
                        <p className="empty-text">
                            No hay pedidos {activeTab} en este momento.
                        </p>
                    </div>
                ) : (
                    displayedOrders.map(order => (
                        <KitchenOrderCard
                            key={order.id}
                            order={order}
                            onComplete={handleComplete}
                            onDelete={handleDelete}
                            onRestore={handleRestore}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
