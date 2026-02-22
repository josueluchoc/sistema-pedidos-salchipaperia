import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../services/mockData';
import type { Product } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ProductForm } from '../components/admin/ProductForm';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import './AdminView.css';

export const AdminView: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);

    const handleAddNew = () => {
        setCurrentProduct(undefined);
        setIsEditing(true);
    };

    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleSubmit = (data: Partial<Product>) => {
        if (data.id) {
            // Edit
            setProducts(prev => prev.map(p => p.id === data.id ? { ...p, ...data } as Product : p));
        } else {
            // Add new
            const newProduct: Product = {
                ...(data as Product),
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
            };
            setProducts(prev => [...prev, newProduct]);
        }
        setIsEditing(false);
    };

    return (
        <div className="admin-layout">
            {/* Left Area: Product List */}
            <div className="admin-list-area">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Gestión de Productos</h2>
                    <Button variant="primary" icon={PlusCircle} onClick={handleAddNew}>
                        Nuevo Producto
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 custom-scroll overflow-y-auto">
                    {products.map(product => (
                        <GlassCard key={product.id} className="p-4 flex gap-4" hoverEffect>
                            <div className="w-20 h-20 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl opacity-50">🍔</span>
                                )}
                            </div>
                            <div className="flex-grow flex flex-col">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-lg leading-tight">{product.name}</h4>
                                    <span className="font-bold text-success">S/ {product.price.toFixed(2)}</span>
                                </div>
                                <span className="text-sm text-white/50 capitalize mt-1 border border-white/10 px-2 py-0.5 rounded-full inline-block w-max">
                                    {product.category}
                                </span>

                                <div className="flex gap-2 mt-auto pt-3">
                                    <Button size="sm" variant="glass" className="flex-1" icon={Edit2} onClick={() => handleEdit(product)}>
                                        Editar
                                    </Button>
                                    <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDelete(product.id)} />
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* Right Area: Form */}
            <div className="admin-form-area">
                {isEditing ? (
                    <ProductForm
                        initialData={currentProduct}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/20 rounded-2xl bg-white/5">
                        <SettingsIcon className="w-16 h-16 opacity-20 mb-4" />
                        <h3 className="text-xl font-medium text-white/70 mb-2">Editor de Productos</h3>
                        <p className="text-white/40 max-w-xs">
                            Selecciona un producto de la lista para editarlo o crea uno nuevo para agregarlo al menú virtual.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper simple icon for empty state
const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
