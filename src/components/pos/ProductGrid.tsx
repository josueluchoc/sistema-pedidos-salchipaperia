import React from 'react';
import type { Product } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import './ProductGrid.css';

interface ProductGridProps {
    products: Product[];
    onAddProduct: (product: Product) => void;
    category: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddProduct, category }) => {
    const filteredProducts = products.filter(p => p.category === category);

    return (
        <div className="product-grid">
            {filteredProducts.map((product) => (
                <GlassCard
                    key={product.id}
                    className="product-card"
                    hoverEffect
                    onClick={() => onAddProduct(product)}
                >
                    {product.image_url ? (
                        <div className="product-image-container">
                            <img src={product.image_url} alt={product.name} className="product-image" />
                        </div>
                    ) : (
                        <div className="product-image-placeholder">
                            <span className="text-white/20 text-4xl">🍟</span>
                        </div>
                    )}
                    <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <span className="product-price">S/ {product.price.toFixed(2)}</span>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
};
