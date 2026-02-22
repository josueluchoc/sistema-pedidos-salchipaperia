import React, { useState, useEffect } from 'react';

import { ProductGrid } from '../components/pos/ProductGrid';
import { CartItem } from '../components/pos/CartItem';
import { CheckoutModal } from '../components/pos/CheckoutModal';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import type { Product, OrderItem, Order } from '../types';
import { supabase } from '../services/supabase';
import './CajaView.css';

export const CajaView: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<'salchipapas' | 'bebidas'>('salchipapas');
    const [cartItems, setCartItems] = useState<OrderItem[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [, setIsSubmitting] = useState(false);

    useEffect(() => {
        supabase.from('products').select('*').then(({ data }) => {
            if (data) setProducts(data);
        });
    }, []);

    const handleAddProduct = (product: Product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.product_id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                id: crypto.randomUUID(),
                order_id: '', // Will be set on submit
                product_id: product.id,
                quantity: 1,
                price_at_time: product.price,
                product: product
            }];
        });
    };

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const handleUpdateCremas = (id: string, cremas: string[]) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, selected_cremas: cremas } : item
        ));
    };

    const handleRemoveItem = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const total = cartItems.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0);

    const handleConfirmOrder = async (orderData: Partial<Order>) => {
        setIsSubmitting(true);
        const toastId = toast.loading('Enviando pedido a cocina...');
        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    ...orderData,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (orderError) throw orderError;

            const itemsToInsert = cartItems.map(item => {
                let finalNotes = item.notes || '';
                if (item.selected_cremas && item.selected_cremas.length > 0) {
                    finalNotes = `Cremas: ${item.selected_cremas.join(', ')}. ${finalNotes}`.trim();
                }

                return {
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price_at_time: item.price_at_time,
                    notes: finalNotes || null
                };
            });

            const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
            if (itemsError) throw itemsError;

            toast.success('¡Pedido enviado a cocina con éxito!', { id: toastId });
            setCartItems([]);
            setIsCheckoutOpen(false);
        } catch (error) {
            console.error('Error saving order:', error);
            toast.error('Hubo un error al procesar el pedido.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="caja-layout">
            {/* Left Area: Products */}
            <div className="caja-products-area">
                <GlassCard className="category-tabs" hoverEffect={false}>
                    <button
                        className={`category-tab ${activeCategory === 'salchipapas' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('salchipapas')}
                    >
                        🍟 Salchipapas
                    </button>
                    <button
                        className={`category-tab ${activeCategory === 'bebidas' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('bebidas')}
                    >
                        🥤 Bebidas
                    </button>
                </GlassCard>

                <div className="products-scroll-area">
                    <ProductGrid
                        products={products}
                        category={activeCategory}
                        onAddProduct={handleAddProduct}
                    />
                </div>
            </div>

            {/* Right Area: Order Cart */}
            <div className="caja-cart-area">
                <GlassCard className="h-full flex flex-col p-4 w-full">
                    <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Facturación Actual</h2>

                    <div className="cart-items-container flex-grow overflow-y-auto pr-2 custom-scroll">
                        {cartItems.length === 0 ? (
                            <div className="text-white/40 text-center py-8">
                                No hay productos en la orden.<br />
                                Selecciona productos de la izquierda.
                            </div>
                        ) : (
                            cartItems.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onUpdateCremas={handleUpdateCremas}
                                    onRemove={handleRemoveItem}
                                />
                            ))
                        )}
                    </div>

                    <div className="cart-totals mt-auto pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white/80">Subtotal</span>
                            <span className="font-semibold">S/ {total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-xl">
                            <span className="font-bold">Total</span>
                            <span className="font-bold text-success">S/ {total.toFixed(2)}</span>
                        </div>

                        <Button
                            size="lg"
                            fullWidth
                            disabled={cartItems.length === 0}
                            onClick={() => setIsCheckoutOpen(true)}
                        >
                            Proceder al Cobro
                        </Button>
                    </div>
                </GlassCard>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cartItems}
                total={total}
                onConfirm={handleConfirmOrder}
            />
        </div>
    );
};
