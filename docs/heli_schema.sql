-- Schema setup for Heli Smart Massage Chair (All 4 Tables)

-- 1. Table for Bookings (Pre-orders & Showroom Trials)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    company_name TEXT, -- Used to store order type e.g. 'Individual Pre-order' or 'Showroom Booking'
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    employee_count TEXT, -- Stores details of items/models e.g. 'comfort (x1)'
    preferred_date TEXT, -- Showroom date
    location TEXT, -- Shipping address or showroom location
    details TEXT, -- Holds status dropdown state, admin note, and additional details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS policies for bookings
CREATE POLICY "Allow public insert for bookings" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated admin manage bookings" ON bookings
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 2. Table for Contacts (Messages)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL, -- Holds message text, status and notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on contacts
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- RLS policies for contacts
CREATE POLICY "Allow public insert for contacts" ON contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated admin manage contacts" ON contacts
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 3. Table for Favorites
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chair_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, chair_id)
);

-- Index for quick favorites check
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- Enable RLS on favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS policy for favorites
CREATE POLICY "Users can manage their own favorites" ON favorites
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 4. Table for Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chair_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, chair_id)
);

-- Index for quick cart lookup
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS policy for cart_items
CREATE POLICY "Users can manage their own cart items" ON cart_items
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
