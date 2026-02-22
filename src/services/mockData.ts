import type { Product } from '../types';

// Mock initial data as requested in prompt until Supabase DB is populated
export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: 'Salchipapa Grande',
        price: 13,
        category: 'salchipapas',
        created_at: new Date().toISOString()
    },
    {
        id: 'p2',
        name: 'Salchipapa Chica',
        price: 8,
        category: 'salchipapas',
        created_at: new Date().toISOString()
    },
    {
        id: 'p3',
        name: 'Salchipapa Picante Grande',
        price: 15,
        category: 'salchipapas',
        created_at: new Date().toISOString()
    },
    {
        id: 'p4',
        name: 'Salchipapa Picante Chica',
        price: 10,
        category: 'salchipapas',
        created_at: new Date().toISOString()
    },
    {
        id: 'p5',
        name: 'Gaseosa',
        price: 1,
        category: 'bebidas',
        created_at: new Date().toISOString()
    },
    // Cremas (usually free but as options)
    {
        id: 'p6',
        name: 'Mayonesa',
        price: 0,
        category: 'cremas',
        created_at: new Date().toISOString()
    },
    {
        id: 'p7',
        name: 'Ketchup',
        price: 0,
        category: 'cremas',
        created_at: new Date().toISOString()
    }
];
