export type OrderStatus = 'pending' | 'completed' | 'deleted';
export type OrderType = 'local' | 'delivery';

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: 'salchipapas' | 'bebidas' | 'cremas' | 'otros';
    image_url?: string;
    created_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price_at_time: number; // Snapshot of price when ordered
    notes?: string;
    selected_cremas?: string[];

    // Joined relation for UI convenience
    product?: Product;
}

export interface Order {
    id: string;
    customer_name: string;
    status: OrderStatus;
    type: OrderType;
    total_amount: number;

    // Delivery specific
    delivery_address?: string;
    delivery_reference?: string;
    delivery_maps_url?: string;
    contact_phone?: string;

    // Payment specifics
    payment_method: 'efectivo' | 'yape' | 'plin' | 'tarjeta';
    cash_amount_provided?: number; // Cuánto paga en efectivo
    change_amount?: number; // Vuelto a llevar

    general_notes?: string;

    created_at: string;
    completed_at?: string;
    deleted_at?: string;

    // Joined relation
    items?: OrderItem[];
}
