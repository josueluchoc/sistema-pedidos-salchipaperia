-- ==========================================
-- LA SANTA PAPA POS - SUPABASE SETUP SCRIPT
-- ==========================================

-- 1. Create custom types for our enums
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'deleted');
CREATE TYPE order_type AS ENUM ('local', 'delivery');
CREATE TYPE payment_method AS ENUM ('efectivo', 'yape', 'plin', 'tarjeta');
CREATE TYPE product_category AS ENUM ('salchipapas', 'bebidas', 'cremas', 'otros');
CREATE TYPE user_role AS ENUM ('admin', 'caja', 'cocina');

-- 2. Create Custom User Roles Table (Extend Auth User)
CREATE TABLE public.user_roles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'caja',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Turn on RLS for user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read user_roles (so the frontend can check)
CREATE POLICY "Allow public read of user roles" ON public.user_roles FOR SELECT USING (true);


-- 3. Create Products Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category product_category NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Realtime for Products
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read of products" ON public.products FOR SELECT USING (true);
-- In a real production app, only admins should insert/update. Allowing all authenticated for simplicity here:
CREATE POLICY "Allow auth all on products" ON public.products FOR ALL USING (auth.role() = 'authenticated');


-- 4. Create Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',
    type order_type NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Delivery fields
    delivery_address TEXT,
    delivery_reference TEXT,
    delivery_maps_url TEXT,
    contact_phone TEXT,
    
    -- Payment fields
    payment_method payment_method NOT NULL,
    cash_amount_provided DECIMAL(10,2),
    change_amount DECIMAL(10,2),
    general_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    completed_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Realtime for Orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read of orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow auth all on orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');


-- 5. Create Order Items Table
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time DECIMAL(10,2) NOT NULL,
    notes TEXT
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read of order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow auth all on order_items" ON public.order_items FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- INITIAL DATA INSERTION
-- ==========================================

-- Insert sample products so you have something to see in Caja View
INSERT INTO public.products (name, price, category, image_url) VALUES
('Salchipapa Grande', 13.00, 'salchipapas', 'https://images.unsplash.com/photo-1626202418579-05d21338575a?auto=format&fit=crop&q=80&w=500'),
('Salchipapa Chica', 8.00, 'salchipapas', 'https://images.unsplash.com/photo-1626202418579-05d21338575a?auto=format&fit=crop&q=80&w=500'),
('Salchipapa Picante Grande', 15.00, 'salchipapas', 'https://images.unsplash.com/photo-1626202418579-05d21338575a?auto=format&fit=crop&q=80&w=500'),
('Salchipapa Picante Chica', 10.00, 'salchipapas', 'https://images.unsplash.com/photo-1626202418579-05d21338575a?auto=format&fit=crop&q=80&w=500'),
('Inca Kola 500ml', 3.00, 'bebidas', 'https://supermercadossanmarcos.com/wp-content/uploads/2021/08/Gaseosa-Inca-Kola-500-ml.jpg'),
('Coca Cola 500ml', 3.00, 'bebidas', 'https://jumbocolombiafood.vteximg.com.br/arquivos/ids/192451-1000-1000/7702535010613.jpg'),
('Mayonesa', 0.00, 'cremas', null),
('Ketchup', 0.00, 'cremas', null),
('Aji Pollero', 0.00, 'cremas', null),
('Mostaza', 0.00, 'cremas', null);
