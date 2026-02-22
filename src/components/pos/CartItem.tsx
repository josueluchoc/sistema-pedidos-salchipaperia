import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { OrderItem } from '../../types';
import './CartItem.css';

interface CartItemProps {
    item: OrderItem;
    onUpdateQuantity: (id: string, newQuantity: number) => void;
    onRemove: (id: string) => void;
    onUpdateCremas?: (id: string, cremas: string[]) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove, onUpdateCremas }) => {
    const cremasOptions = ['Mayonesa', 'Ketchup', 'Mostaza', 'Ají', 'Golf', 'Tártara'];

    const toggleCrema = (crema: string) => {
        if (!onUpdateCremas) return;
        const current = item.selected_cremas || [];
        if (current.includes(crema)) {
            onUpdateCremas(item.id, current.filter(c => c !== crema));
        } else {
            onUpdateCremas(item.id, [...current, crema]);
        }
    };

    return (
        <div className="cart-item">
            <div className="cart-item-header">
                <h4 className="cart-item-title">{item.product?.name}</h4>
                <button className="cart-item-remove" onClick={() => onRemove(item.id)}>
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="cart-item-controls">
                <div className="cart-qty-control">
                    <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                        <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <div className="cart-item-price">
                    S/ {(item.price_at_time * item.quantity).toFixed(2)}
                </div>
            </div>

            {item.product?.category === 'salchipapas' && (
                <div className="cart-item-cremas mt-3 pt-3 border-t border-white/5">
                    <span className="text-xs text-white/50 mb-2 block uppercase tracking-wider">Cremas a elegir:</span>
                    <div className="flex flex-wrap gap-2">
                        {cremasOptions.map(crema => {
                            const isSelected = (item.selected_cremas || []).includes(crema);
                            return (
                                <label key={crema} className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors border ${isSelected ? 'bg-primary/20 border-primary/50 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isSelected}
                                        onChange={() => toggleCrema(crema)}
                                    />
                                    {crema}
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
