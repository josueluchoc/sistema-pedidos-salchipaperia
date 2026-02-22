import React, { useEffect, useState } from 'react';
import { Clock, MapPin, Phone, MessageSquare, CheckCircle, Trash2, RotateCcw } from 'lucide-react';
import type { Order } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import './KitchenOrderCard.css';

interface KitchenOrderCardProps {
    order: Order;
    onComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onRestore?: (id: string) => void;
}

export const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({
    order, onComplete, onDelete, onRestore
}) => {
    const [elapsed, setElapsed] = useState('');
    const [isWarning, setIsWarning] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const start = new Date(order.created_at).getTime();
            const now = Date.now();
            const diffStr = Math.floor((now - start) / 60000); // in minutes

            setIsWarning(diffStr >= 15 && order.status === 'pending'); // highlight if > 15 mins

            setElapsed(`${diffStr} min`);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [order.created_at, order.status]);

    const isDelivery = order.type === 'delivery';

    return (
        <GlassCard className={`order-card ${isWarning ? 'warning' : ''}`} hoverEffect={false}>
            {/* Header */}
            <div className={`order-header ${isDelivery ? 'delivery' : 'local'}`}>
                <div className="flex justify-between items-center">
                    <h3 className="order-id">
                        PEDIDO {order.id.substring(0, 4).toUpperCase()}
                        <span className="order-type-badge">
                            {isDelivery ? '🛵 Delivery' : '🏪 Local'}
                        </span>
                    </h3>
                    <div className="order-timer">
                        <Clock size={16} />
                        <span>{elapsed}</span>
                    </div>
                </div>
                <div className="customer-name">{order.customer_name}</div>
            </div>

            {/* Items List */}
            <div className="order-items-list">
                {order.items?.map(item => (
                    <div key={item.id} className="order-item-row">
                        <div className="item-qty">{item.quantity}x</div>
                        <div className="item-details">
                            <span className="item-name">{item.product?.name}</span>
                            {item.notes && <span className="item-notes">({item.notes})</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Delivery / Notes Info */}
            <div className="order-info-section">
                {isDelivery ? (
                    <>
                        <div className="info-row">
                            <MapPin size={14} className="info-icon" />
                            <span>{order.delivery_address}</span>
                        </div>
                        {order.delivery_reference && (
                            <div className="info-row">
                                <span className="info-label">Ref:</span>
                                <span>{order.delivery_reference}</span>
                            </div>
                        )}
                        {order.delivery_maps_url && (
                            <div className="info-row">
                                <a href={order.delivery_maps_url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm">
                                    Ver en Google Maps
                                </a>
                            </div>
                        )}
                        <div className="info-row text-sm">
                            <Phone size={14} className="info-icon" />
                            <span>{order.contact_phone}</span>
                        </div>
                    </>
                ) : (
                    order.general_notes && (
                        <div className="info-row text-warning">
                            <MessageSquare size={14} className="info-icon" />
                            <span>{order.general_notes}</span>
                        </div>
                    )
                )}
            </div>

            {/* Payment Info */}
            <div className="order-payment">
                <span className="payment-method">Pago: {order.payment_method.toUpperCase()} (S/ {order.total_amount})</span>
                {order.payment_method === 'efectivo' && order.cash_amount_provided && (
                    <div className="payment-change">
                        Paga con S/ {order.cash_amount_provided} - Vuelto: <span className="text-success font-bold">S/ {order.change_amount}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="order-actions">
                {order.status === 'deleted' ? (
                    <Button fullWidth variant="secondary" icon={RotateCcw} onClick={() => onRestore?.(order.id)}>
                        Restaurar Pedido
                    </Button>
                ) : (
                    <>
                        <Button
                            className="flex-1"
                            variant="danger"
                            icon={Trash2}
                            onClick={() => onDelete(order.id)}
                        >
                            Eliminar
                        </Button>
                        {order.status === 'pending' && (
                            <Button
                                className="flex-[2]"
                                variant="primary"
                                icon={CheckCircle}
                                onClick={() => onComplete(order.id)}
                            >
                                Completado
                            </Button>
                        )}
                    </>
                )}
            </div>
        </GlassCard>
    );
};
