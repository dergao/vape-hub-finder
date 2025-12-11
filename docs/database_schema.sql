-- =====================================================
-- Vape Store Finder - Database Schema
-- PostgreSQL / Supabase
-- =====================================================

-- 1. 城市表
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(10) NOT NULL DEFAULT 'us',
    store_count INTEGER DEFAULT 0,
    avg_rating DECIMAL(2,1) DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 店铺表
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    city_slug VARCHAR(100) NOT NULL REFERENCES public.cities(slug) ON DELETE CASCADE,
    address TEXT NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip VARCHAR(20),
    phone VARCHAR(30),
    description TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    service_rating DECIMAL(2,1) DEFAULT 0,
    inventory_rating DECIMAL(2,1) DEFAULT 0,
    pricing_rating DECIMAL(2,1) DEFAULT 0,
    is_open BOOLEAN DEFAULT true,
    is_sponsored BOOLEAN DEFAULT false,
    main_image_url TEXT,
    hours JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(city_slug, slug)
);

-- 3. 店铺图库表
CREATE TABLE IF NOT EXISTS public.store_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 品牌表
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 店铺-品牌关联表
CREATE TABLE IF NOT EXISTS public.store_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    url TEXT,
    UNIQUE(store_id, brand_id)
);

-- 6. 店铺产品表
CREATE TABLE IF NOT EXISTS public.store_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 评论表
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    user_avatar TEXT,
    overall_rating DECIMAL(2,1) NOT NULL,
    service_rating DECIMAL(2,1),
    inventory_rating DECIMAL(2,1),
    pricing_rating DECIMAL(2,1),
    content TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 广告表
CREATE TABLE IF NOT EXISTS public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('sponsored_store', 'list_banner', 'detail_banner')),
    title VARCHAR(200),
    image_url TEXT,
    target_url TEXT,
    store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
    city_slug VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. 社交群组表
CREATE TABLE IF NOT EXISTS public.social_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('whatsapp', 'telegram', 'facebook')),
    url TEXT NOT NULL,
    member_count INTEGER DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 优惠券表
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2),
    min_purchase DECIMAL(10,2),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    claim_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. 优惠券领取记录表
CREATE TABLE IF NOT EXISTS public.coupon_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(30),
    claimed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 索引
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_stores_city_slug ON public.stores(city_slug);
CREATE INDEX IF NOT EXISTS idx_stores_is_sponsored ON public.stores(is_sponsored);
CREATE INDEX IF NOT EXISTS idx_stores_rating ON public.stores(rating DESC);
CREATE INDEX IF NOT EXISTS idx_stores_location ON public.stores(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_reviews_store_id ON public.reviews(store_id);
CREATE INDEX IF NOT EXISTS idx_store_products_brand ON public.store_products(brand_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_type ON public.advertisements(type);
CREATE INDEX IF NOT EXISTS idx_advertisements_active ON public.advertisements(is_active);

-- =====================================================
-- 触发器：自动更新 updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cities_updated_at
    BEFORE UPDATE ON public.cities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON public.stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertisements_updated_at
    BEFORE UPDATE ON public.advertisements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_groups_updated_at
    BEFORE UPDATE ON public.social_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS 策略（可选，用于 Supabase）
-- =====================================================

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_claims ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "Public read cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public read stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Public read store_images" ON public.store_images FOR SELECT USING (true);
CREATE POLICY "Public read brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Public read store_brands" ON public.store_brands FOR SELECT USING (true);
CREATE POLICY "Public read store_products" ON public.store_products FOR SELECT USING (true);
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read active ads" ON public.advertisements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active groups" ON public.social_groups FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active coupons" ON public.coupons FOR SELECT USING (is_active = true);

-- 公开插入评论和优惠券领取
CREATE POLICY "Public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert coupon_claims" ON public.coupon_claims FOR INSERT WITH CHECK (true);

-- =====================================================
-- 演示数据
-- =====================================================

-- 城市数据
INSERT INTO public.cities (name, slug, state, country, store_count, avg_rating, image_url) VALUES
('Los Angeles', 'los-angeles', 'California', 'us', 5, 4.3, NULL),
('New York', 'new-york', 'New York', 'us', 4, 4.1, NULL),
('Miami', 'miami', 'Florida', 'us', 3, 4.2, NULL),
('Chicago', 'chicago', 'Illinois', 'us', 3, 4.0, NULL),
('Houston', 'houston', 'Texas', 'us', 2, 4.4, NULL),
('Phoenix', 'phoenix', 'Arizona', 'us', 2, 3.9, NULL),
('Seattle', 'seattle', 'Washington', 'us', 2, 4.5, NULL),
('Denver', 'denver', 'Colorado', 'us', 2, 4.2, NULL);

-- 品牌数据
INSERT INTO public.brands (name, website_url) VALUES
('JUUL', 'https://www.juul.com'),
('Puff Bar', 'https://www.puffbar.com'),
('SMOK', 'https://www.smoktech.com'),
('Vaporesso', 'https://www.vaporesso.com'),
('GeekVape', 'https://www.geekvape.com'),
('Voopoo', 'https://www.voopoo.com'),
('Lost Vape', 'https://www.lostvape.com'),
('Aspire', 'https://www.aspirecig.com'),
('Uwell', 'https://www.myuwell.com'),
('Innokin', 'https://www.innokin.com');

-- 店铺数据
INSERT INTO public.stores (name, slug, city_slug, address, state, zip, phone, description, latitude, longitude, rating, review_count, service_rating, inventory_rating, pricing_rating, is_open, is_sponsored, hours) VALUES
-- Los Angeles
('Cloud 9 Vape Lounge', 'cloud-9-vape-lounge', 'los-angeles', '1234 Sunset Blvd', 'California', '90028', '(323) 555-0101', 'Premier vape lounge in Hollywood with extensive selection of premium e-liquids and devices.', 34.0928, -118.3287, 4.5, 128, 4.6, 4.7, 4.2, true, true, '{"monday": {"open": "10:00", "close": "21:00"}, "tuesday": {"open": "10:00", "close": "21:00"}, "wednesday": {"open": "10:00", "close": "21:00"}, "thursday": {"open": "10:00", "close": "21:00"}, "friday": {"open": "10:00", "close": "22:00"}, "saturday": {"open": "11:00", "close": "22:00"}, "sunday": {"open": "12:00", "close": "18:00"}}'),
('Vapor Kings LA', 'vapor-kings-la', 'los-angeles', '5678 Venice Blvd', 'California', '90019', '(323) 555-0102', 'Your one-stop shop for all vaping needs in West LA.', 34.0369, -118.3612, 4.2, 89, 4.3, 4.1, 4.2, true, false, '{"monday": {"open": "09:00", "close": "20:00"}, "tuesday": {"open": "09:00", "close": "20:00"}, "wednesday": {"open": "09:00", "close": "20:00"}, "thursday": {"open": "09:00", "close": "20:00"}, "friday": {"open": "09:00", "close": "21:00"}, "saturday": {"open": "10:00", "close": "21:00"}, "sunday": {"open": "11:00", "close": "18:00"}}'),
('The Vape Spot', 'the-vape-spot', 'los-angeles', '910 Melrose Ave', 'California', '90038', '(323) 555-0103', 'Trendy vape shop with knowledgeable staff and great prices.', 34.0838, -118.3365, 4.0, 65, 4.2, 3.8, 4.0, false, false, '{"monday": {"open": "10:00", "close": "19:00"}, "tuesday": {"open": "10:00", "close": "19:00"}, "wednesday": {"open": "10:00", "close": "19:00"}, "thursday": {"open": "10:00", "close": "19:00"}, "friday": {"open": "10:00", "close": "20:00"}, "saturday": {"open": "10:00", "close": "20:00"}, "sunday": {"closed": true}}'),

-- New York
('Manhattan Vape Co', 'manhattan-vape-co', 'new-york', '456 Broadway', 'New York', '10013', '(212) 555-0201', 'Downtown Manhattan''s favorite vape destination since 2015.', 40.7195, -74.0010, 4.3, 156, 4.4, 4.5, 4.0, true, true, '{"monday": {"open": "08:00", "close": "22:00"}, "tuesday": {"open": "08:00", "close": "22:00"}, "wednesday": {"open": "08:00", "close": "22:00"}, "thursday": {"open": "08:00", "close": "22:00"}, "friday": {"open": "08:00", "close": "23:00"}, "saturday": {"open": "09:00", "close": "23:00"}, "sunday": {"open": "10:00", "close": "20:00"}}'),
('Brooklyn Clouds', 'brooklyn-clouds', 'new-york', '789 Bedford Ave', 'New York', '11211', '(718) 555-0202', 'Williamsburg''s hipster vape haven with artisan e-liquids.', 40.7142, -73.9614, 4.1, 98, 4.0, 4.3, 4.0, true, false, '{"monday": {"open": "11:00", "close": "21:00"}, "tuesday": {"open": "11:00", "close": "21:00"}, "wednesday": {"open": "11:00", "close": "21:00"}, "thursday": {"open": "11:00", "close": "21:00"}, "friday": {"open": "11:00", "close": "22:00"}, "saturday": {"open": "10:00", "close": "22:00"}, "sunday": {"open": "12:00", "close": "19:00"}}'),

-- Miami
('South Beach Vapor', 'south-beach-vapor', 'miami', '123 Ocean Drive', 'Florida', '33139', '(305) 555-0301', 'Miami''s premier beachside vape shop with tropical flavors.', 25.7825, -80.1304, 4.4, 112, 4.5, 4.4, 4.3, true, false, '{"monday": {"open": "09:00", "close": "21:00"}, "tuesday": {"open": "09:00", "close": "21:00"}, "wednesday": {"open": "09:00", "close": "21:00"}, "thursday": {"open": "09:00", "close": "21:00"}, "friday": {"open": "09:00", "close": "22:00"}, "saturday": {"open": "09:00", "close": "22:00"}, "sunday": {"open": "10:00", "close": "20:00"}}'),
('Wynwood Vape Gallery', 'wynwood-vape-gallery', 'miami', '456 NW 2nd Ave', 'Florida', '33127', '(305) 555-0302', 'Art district vape shop with unique flavors and creative atmosphere.', 25.8010, -80.1994, 4.2, 76, 4.3, 4.1, 4.2, true, true, '{"monday": {"open": "10:00", "close": "20:00"}, "tuesday": {"open": "10:00", "close": "20:00"}, "wednesday": {"open": "10:00", "close": "20:00"}, "thursday": {"open": "10:00", "close": "20:00"}, "friday": {"open": "10:00", "close": "22:00"}, "saturday": {"open": "10:00", "close": "22:00"}, "sunday": {"open": "11:00", "close": "18:00"}}'),

-- Chicago
('Windy City Vapes', 'windy-city-vapes', 'chicago', '789 N Michigan Ave', 'Illinois', '60611', '(312) 555-0401', 'Chicago''s finest vape shop on the Magnificent Mile.', 41.8962, -87.6243, 4.1, 134, 4.2, 4.0, 4.1, true, false, '{"monday": {"open": "09:00", "close": "20:00"}, "tuesday": {"open": "09:00", "close": "20:00"}, "wednesday": {"open": "09:00", "close": "20:00"}, "thursday": {"open": "09:00", "close": "20:00"}, "friday": {"open": "09:00", "close": "21:00"}, "saturday": {"open": "10:00", "close": "21:00"}, "sunday": {"open": "11:00", "close": "18:00"}}'),
('Lincoln Park Vapor', 'lincoln-park-vapor', 'chicago', '321 W Armitage Ave', 'Illinois', '60614', '(773) 555-0402', 'Neighborhood vape shop with friendly service and great selection.', 41.9181, -87.6362, 3.9, 67, 4.0, 3.8, 3.9, true, false, '{"monday": {"open": "10:00", "close": "19:00"}, "tuesday": {"open": "10:00", "close": "19:00"}, "wednesday": {"open": "10:00", "close": "19:00"}, "thursday": {"open": "10:00", "close": "19:00"}, "friday": {"open": "10:00", "close": "20:00"}, "saturday": {"open": "10:00", "close": "20:00"}, "sunday": {"open": "12:00", "close": "17:00"}}'),

-- Houston
('Space City Vapes', 'space-city-vapes', 'houston', '555 Westheimer Rd', 'Texas', '77006', '(713) 555-0501', 'Houston''s largest selection of vape products and accessories.', 29.7421, -95.3898, 4.5, 189, 4.6, 4.5, 4.4, true, true, '{"monday": {"open": "08:00", "close": "21:00"}, "tuesday": {"open": "08:00", "close": "21:00"}, "wednesday": {"open": "08:00", "close": "21:00"}, "thursday": {"open": "08:00", "close": "21:00"}, "friday": {"open": "08:00", "close": "22:00"}, "saturday": {"open": "09:00", "close": "22:00"}, "sunday": {"open": "10:00", "close": "19:00"}}'),

-- Seattle
('Emerald City Vapor', 'emerald-city-vapor', 'seattle', '123 Pike St', 'Washington', '98101', '(206) 555-0601', 'Seattle''s craft vape shop near Pike Place Market.', 47.6097, -122.3417, 4.6, 145, 4.7, 4.6, 4.5, true, false, '{"monday": {"open": "09:00", "close": "20:00"}, "tuesday": {"open": "09:00", "close": "20:00"}, "wednesday": {"open": "09:00", "close": "20:00"}, "thursday": {"open": "09:00", "close": "20:00"}, "friday": {"open": "09:00", "close": "21:00"}, "saturday": {"open": "10:00", "close": "21:00"}, "sunday": {"open": "11:00", "close": "18:00"}}'),

-- Denver
('Mile High Vapes', 'mile-high-vapes', 'denver', '420 Larimer St', 'Colorado', '80202', '(303) 555-0701', 'Denver''s premier vape destination in historic LoDo.', 39.7508, -104.9997, 4.3, 167, 4.4, 4.3, 4.2, true, false, '{"monday": {"open": "09:00", "close": "20:00"}, "tuesday": {"open": "09:00", "close": "20:00"}, "wednesday": {"open": "09:00", "close": "20:00"}, "thursday": {"open": "09:00", "close": "20:00"}, "friday": {"open": "09:00", "close": "21:00"}, "saturday": {"open": "10:00", "close": "21:00"}, "sunday": {"open": "11:00", "close": "18:00"}}');

-- 店铺-品牌关联
INSERT INTO public.store_brands (store_id, brand_id)
SELECT s.id, b.id FROM public.stores s, public.brands b
WHERE s.slug = 'cloud-9-vape-lounge' AND b.name IN ('JUUL', 'SMOK', 'Vaporesso', 'GeekVape');

INSERT INTO public.store_brands (store_id, brand_id)
SELECT s.id, b.id FROM public.stores s, public.brands b
WHERE s.slug = 'manhattan-vape-co' AND b.name IN ('JUUL', 'Puff Bar', 'SMOK', 'Voopoo', 'Aspire');

INSERT INTO public.store_brands (store_id, brand_id)
SELECT s.id, b.id FROM public.stores s, public.brands b
WHERE s.slug = 'space-city-vapes' AND b.name IN ('SMOK', 'Vaporesso', 'GeekVape', 'Lost Vape', 'Uwell');

-- 店铺产品（关联品牌）
INSERT INTO public.store_products (store_id, brand_id, name, url)
SELECT s.id, b.id, 'Vaporesso XROS 3', 'https://www.vaporesso.com/xros-3' 
FROM public.stores s, public.brands b WHERE s.slug = 'cloud-9-vape-lounge' AND b.name = 'Vaporesso'
UNION ALL
SELECT s.id, b.id, 'SMOK Nord 5', NULL 
FROM public.stores s, public.brands b WHERE s.slug = 'cloud-9-vape-lounge' AND b.name = 'SMOK'
UNION ALL
SELECT s.id, b.id, 'GeekVape Aegis Legend 2', 'https://www.geekvape.com/aegis-legend-2' 
FROM public.stores s, public.brands b WHERE s.slug = 'cloud-9-vape-lounge' AND b.name = 'GeekVape';

-- 评论数据
INSERT INTO public.reviews (store_id, user_name, overall_rating, service_rating, inventory_rating, pricing_rating, content, is_approved, created_at)
SELECT 
    s.id,
    'John D.',
    4.5,
    5.0,
    4.5,
    4.0,
    'Great selection and super friendly staff! They helped me find the perfect setup for my needs. Will definitely be coming back.',
    true,
    NOW() - INTERVAL '5 days'
FROM public.stores s WHERE s.slug = 'cloud-9-vape-lounge'
UNION ALL
SELECT 
    s.id,
    'Sarah M.',
    4.0,
    4.0,
    4.5,
    3.5,
    'Good variety of products. Prices are a bit high but the quality makes up for it.',
    true,
    NOW() - INTERVAL '12 days'
FROM public.stores s WHERE s.slug = 'cloud-9-vape-lounge'
UNION ALL
SELECT 
    s.id,
    'Mike R.',
    5.0,
    5.0,
    5.0,
    4.5,
    'Best vape shop in LA! The staff really knows their stuff and always has the latest products.',
    true,
    NOW() - INTERVAL '3 days'
FROM public.stores s WHERE s.slug = 'cloud-9-vape-lounge'
UNION ALL
SELECT 
    s.id,
    'Emily K.',
    4.5,
    4.5,
    4.0,
    4.5,
    'Love the atmosphere here. Great place to hang out and try new flavors.',
    true,
    NOW() - INTERVAL '8 days'
FROM public.stores s WHERE s.slug = 'manhattan-vape-co';

-- 社交群组
INSERT INTO public.social_groups (name, platform, url, member_count, description, is_active) VALUES
('Vape Deals Daily', 'whatsapp', 'https://chat.whatsapp.com/example1', 2500, 'Daily vape deals and giveaways!', true),
('Cloud Chasers Community', 'telegram', 'https://t.me/cloudchasers', 5200, 'Join the largest vape community on Telegram', true),
('Vape Nation USA', 'facebook', 'https://facebook.com/groups/vapenationusa', 15000, 'Connect with vapers across the USA', true);

-- 优惠券
INSERT INTO public.coupons (store_id, code, description, discount_type, discount_value, min_purchase, expires_at, is_active)
SELECT 
    id,
    'CLOUD10',
    '10% off your first purchase',
    'percentage',
    10,
    20.00,
    NOW() + INTERVAL '30 days',
    true
FROM public.stores WHERE slug = 'cloud-9-vape-lounge'
UNION ALL
SELECT 
    id,
    'WELCOME5',
    '$5 off orders over $30',
    'fixed',
    5,
    30.00,
    NOW() + INTERVAL '60 days',
    true
FROM public.stores WHERE slug = 'manhattan-vape-co';

-- 广告
INSERT INTO public.advertisements (type, title, store_id, city_slug, is_active, start_date, end_date)
SELECT 
    'sponsored_store',
    'Featured Store',
    id,
    'los-angeles',
    true,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days'
FROM public.stores WHERE slug = 'cloud-9-vape-lounge';

INSERT INTO public.advertisements (type, title, image_url, target_url, city_slug, is_active, start_date, end_date) VALUES
('list_banner', 'SMOK New Arrivals', 'https://via.placeholder.com/728x90?text=SMOK+New+Arrivals', 'https://www.smoktech.com', 'los-angeles', true, CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days'),
('detail_banner', 'Vaporesso Holiday Sale', 'https://via.placeholder.com/728x90?text=Vaporesso+Sale', 'https://www.vaporesso.com', NULL, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days');

-- =====================================================
-- 完成
-- =====================================================
SELECT 'Database schema and demo data created successfully!' as status;
