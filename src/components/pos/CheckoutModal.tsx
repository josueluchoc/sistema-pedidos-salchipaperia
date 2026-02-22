import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Order, OrderItem } from '../../types';
import './CheckoutModal.css';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart?: OrderItem[]; // Made optional so old calls don't break but not used in logic
    total: number;
    onConfirm: (orderData: Partial<Order>) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen, onClose, cart: _cart, total, onConfirm
}) => {
    const [orderType, setOrderType] = useState<'local' | 'delivery'>('local');
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'yape' | 'plin' | 'tarjeta'>('efectivo');

    // Local Specific
    const [notes, setNotes] = useState('');

    // Delivery Specific
    const [address, setAddress] = useState('');
    const [reference, setReference] = useState('');
    const [phone, setPhone] = useState('');
    const [mapsUrl, setMapsUrl] = useState('');

    // Cash logic
    const [cashProvided, setCashProvided] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({
            customer_name: customerName,
            type: orderType,
            status: 'pending',
            total_amount: total,
            payment_method: paymentMethod,
            cash_amount_provided: cashProvided ? parseFloat(cashProvided) : undefined,
            change_amount: cashProvided ? parseFloat(cashProvided) - total : undefined,
            general_notes: notes,
            ...(orderType === 'delivery' && {
                delivery_address: address,
                delivery_reference: reference,
                contact_phone: phone,
                delivery_maps_url: mapsUrl
            })
        });
    };

    const calculateChange = () => {
        if (!cashProvided) return 0;
        const provided = parseFloat(cashProvided);
        if (isNaN(provided) || provided < total) return 0;
        return provided - total;
    };

    return (
        <div className="modal-overlay">
            <GlassCard className="modal-content" hoverEffect={false}>
                <div className="modal-header border-b border-white/10 pb-4 mb-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Completar Pedido</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center transition-colors">✕</button>
                </div>

                <div className="flex gap-2 mb-6">
                    <Button
                        variant={orderType === 'local' ? 'primary' : 'glass'}
                        fullWidth
                        onClick={() => setOrderType('local')}
                    >
                        🏪 Local / Llevar
                    </Button>
                    <Button
                        variant={orderType === 'delivery' ? 'primary' : 'glass'}
                        fullWidth
                        onClick={() => setOrderType('delivery')}
                    >
                        🛵 Delivery
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto pr-2 max-h-[60vh] custom-scroll">
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        <Input
                            label="Nombre del Cliente"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                        />

                        <div className="form-group">
                            <label className="text-sm font-medium text-white/80 ml-1 mb-1.5 block">Método de Pago</label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as any)}
                            >
                                <option value="efectivo" className="bg-slate-800">Efectivo</option>
                                <option value="yape" className="bg-slate-800">Yape</option>
                                <option value="plin" className="bg-slate-800">Plin</option>
                                <option value="tarjeta" className="bg-slate-800">Tarjeta (POS)</option>
                            </select>
                        </div>

                        {paymentMethod === 'efectivo' && (
                            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                <Input
                                    label="Efectivo Recibido (S/)"
                                    type="number"
                                    step="0.10"
                                    min={total}
                                    value={cashProvided}
                                    onChange={(e) => setCashProvided(e.target.value)}
                                    placeholder={total.toFixed(2)}
                                />
                                <div className="flex flex-col justify-end pb-3">
                                    <span className="text-sm text-white/60">Vuelto:</span>
                                    <span className="text-xl font-bold text-success">S/ {calculateChange().toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {orderType === 'delivery' ? (
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <h3 className="font-semibold text-lg border-b border-white/10 pb-2">Datos de Delivery</h3>
                            <Input
                                label="Dirección de Entrega"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                            <Input
                                label="Referencia"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                            />
                            <Input
                                label="Teléfono de Contacto"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                            <Input
                                label="Link de Google Maps (Opcional)"
                                type="url"
                                value={mapsUrl}
                                onChange={(e) => setMapsUrl(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="mb-6">
                            <Input
                                label="Notas Adicionales (Ej: Para llevar)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                multiline
                            />
                        </div>
                    )}

                    <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-md pt-4 border-t border-white/10 mt-6">
                        <div className="flex justify-between items-center mb-4 text-xl">
                            <span className="font-bold">Total a Cobrar:</span>
                            <span className="font-bold text-success">S/ {total.toFixed(2)}</span>
                        </div>
                        <Button type="submit" size="lg" fullWidth>
                            Confirmar y Enviar a Cocina
                        </Button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};
