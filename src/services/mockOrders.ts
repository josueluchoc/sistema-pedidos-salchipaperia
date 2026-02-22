import type { Order } from '../types';

export const MOCK_ORDERS: Order[] = [
    {
        id: 'o1',
        customer_name: 'Martha Araujo',
        status: 'pending',
        type: 'delivery',
        total_amount: 15,
        delivery_address: 'Jr Luis Agurto 387',
        delivery_reference: 'Mercado Venezuela - Panaderia Giovanis',
        delivery_maps_url: 'https://maps.app.goo.gl/CUFwm86UrbUdS45Y9',
        contact_phone: '922 437 504',
        payment_method: 'efectivo',
        cash_amount_provided: 50,
        change_amount: 35,
        created_at: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
        items: [
            {
                id: 'i1',
                order_id: 'o1',
                product_id: 'p1',
                quantity: 1,
                price_at_time: 13,
                product: { id: 'p1', name: 'Salchipapa Grande', price: 13, category: 'salchipapas', created_at: '' }
            },
            {
                id: 'i2',
                order_id: 'o1',
                product_id: 'p6',
                quantity: 1,
                price_at_time: 0,
                product: { id: 'p6', name: 'Mayonesa', price: 0, category: 'cremas', created_at: '' }
            },
            {
                id: 'i3',
                order_id: 'o1',
                product_id: 'p7',
                quantity: 1,
                price_at_time: 0,
                product: { id: 'p7', name: 'Ketchup', price: 0, category: 'cremas', created_at: '' }
            }
        ]
    },
    {
        id: 'o2',
        customer_name: 'Estefania Perez',
        status: 'pending',
        type: 'local',
        total_amount: 13,
        payment_method: 'efectivo',
        cash_amount_provided: 50,
        change_amount: 37,
        general_notes: 'Empaquetar para llevar',
        created_at: new Date(Date.now() - 12 * 60000).toISOString(), // 12 mins ago
        items: [
            {
                id: 'i4',
                order_id: 'o2',
                product_id: 'p1',
                quantity: 1,
                price_at_time: 13,
                product: { id: 'p1', name: 'Salchipapa Grande', price: 13, category: 'salchipapas', created_at: '' }
            },
            {
                id: 'i5',
                order_id: 'o2',
                product_id: 'p6',
                quantity: 1,
                price_at_time: 0,
                product: { id: 'p6', name: 'Mayonesa', price: 0, category: 'cremas', created_at: '' }
            },
            {
                id: 'i6',
                order_id: 'o2',
                product_id: 'p7',
                quantity: 1,
                price_at_time: 0,
                product: { id: 'p7', name: 'Ketchup', price: 0, category: 'cremas', created_at: '' }
            }
        ]
    }
];
