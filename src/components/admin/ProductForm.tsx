import React, { useState } from 'react';
import type { Product } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CheckCircle, XCircle } from 'lucide-react';

interface ProductFormProps {
    initialData?: Product;
    onSubmit: (data: Partial<Product>) => void;
    onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [price, setPrice] = useState(initialData?.price?.toString() || '');
    const [category, setCategory] = useState<'salchipapas' | 'bebidas' | 'cremas' | 'otros'>(initialData?.category || 'salchipapas');
    const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
    const [description, setDescription] = useState(initialData?.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            id: initialData?.id,
            name,
            price: parseFloat(price),
            category,
            image_url: imageUrl,
            description
        });
    };

    return (
        <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-2">
                {initialData ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Nombre del Producto"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Precio (S/)"
                        type="number"
                        step="0.10"
                        min="0"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-white/80 ml-1">Categoría</label>
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                            value={category}
                            onChange={e => setCategory(e.target.value as any)}
                        >
                            <option value="salchipapas" className="bg-slate-800">Salchipapas</option>
                            <option value="bebidas" className="bg-slate-800">Bebidas</option>
                            <option value="cremas" className="bg-slate-800">Cremas</option>
                            <option value="otros" className="bg-slate-800">Otros</option>
                        </select>
                    </div>
                </div>

                <Input
                    label="URL de Imagen (Opcional)"
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                />

                <Input
                    label="Descripción (Opcional)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    multiline
                />

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
                    <Button type="button" variant="ghost" icon={XCircle} onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" icon={CheckCircle}>
                        Guardar Producto
                    </Button>
                </div>
            </form>
        </GlassCard>
    );
};
