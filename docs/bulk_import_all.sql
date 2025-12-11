-- =====================================================
-- 批量导入指南 - 城市、品牌、产品、评论
-- Bulk Import Guide - Cities, Brands, Products, Reviews
-- =====================================================

-- =====================================================
-- 1. 城市导入 (Cities)
-- =====================================================

-- 直接 SQL 插入
INSERT INTO public.cities (name, slug, state, country, store_count, avg_rating, image_url) VALUES
('San Francisco', 'san-francisco', 'California', 'us', 0, 0, NULL),
('Boston', 'boston', 'Massachusetts', 'us', 0, 0, NULL),
('Atlanta', 'atlanta', 'Georgia', 'us', 0, 0, NULL);

-- 从 CSV 导入
CREATE TEMP TABLE temp_cities (
    name TEXT,
    slug TEXT,
    state TEXT,
    country TEXT,
    store_count INTEGER,
    avg_rating DECIMAL(2,1),
    image_url TEXT
);

-- psql: \copy temp_cities FROM 'import_template_cities.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.cities (name, slug, state, country, store_count, avg_rating, image_url)
SELECT name, slug, state, country, store_count, avg_rating, NULLIF(image_url, '')
FROM temp_cities
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    state = EXCLUDED.state,
    store_count = EXCLUDED.store_count,
    avg_rating = EXCLUDED.avg_rating;

DROP TABLE temp_cities;

/*
字段说明:
| 字段名       | 类型          | 必填 | 说明                     |
|-------------|---------------|------|-------------------------|
| name        | VARCHAR(100)  | ✅   | 城市名称                 |
| slug        | VARCHAR(100)  | ✅   | URL标识，全局唯一         |
| state       | VARCHAR(50)   | ✅   | 州/省                    |
| country     | VARCHAR(10)   | ✅   | 国家代码，默认 'us'       |
| store_count | INTEGER       | ❌   | 店铺数量，默认 0          |
| avg_rating  | DECIMAL(2,1)  | ❌   | 平均评分，默认 0          |
| image_url   | TEXT          | ❌   | 城市缩略图URL            |
*/

-- =====================================================
-- 2. 品牌导入 (Brands)
-- =====================================================

INSERT INTO public.brands (name, logo_url, website_url) VALUES
('Elfbar', NULL, 'https://www.elfbar.com'),
('Elf Bar', NULL, 'https://www.elfbar.com'),
('Hyde', NULL, 'https://www.hydevape.com')
ON CONFLICT (name) DO NOTHING;

-- 从 CSV 导入
CREATE TEMP TABLE temp_brands (
    name TEXT,
    logo_url TEXT,
    website_url TEXT
);

-- psql: \copy temp_brands FROM 'import_template_brands.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.brands (name, logo_url, website_url)
SELECT name, NULLIF(logo_url, ''), NULLIF(website_url, '')
FROM temp_brands
ON CONFLICT (name) DO NOTHING;

DROP TABLE temp_brands;

/*
字段说明:
| 字段名      | 类型          | 必填 | 说明              |
|------------|---------------|------|------------------|
| name       | VARCHAR(100)  | ✅   | 品牌名称，全局唯一 |
| logo_url   | TEXT          | ❌   | 品牌Logo URL      |
| website_url| TEXT          | ❌   | 品牌官网          |
*/

-- =====================================================
-- 3. 店铺-品牌关联导入 (Store Brands)
-- =====================================================

CREATE TEMP TABLE temp_store_brands (
    store_slug TEXT,
    city_slug TEXT,
    brand_name TEXT
);

-- psql: \copy temp_store_brands FROM 'import_template_store_brands.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.store_brands (store_id, brand_id, url)
SELECT s.id, b.id, NULL
FROM temp_store_brands t
JOIN public.stores s ON s.slug = t.store_slug AND s.city_slug = t.city_slug
JOIN public.brands b ON b.name = t.brand_name
ON CONFLICT (store_id, brand_id) DO NOTHING;

DROP TABLE temp_store_brands;

/*
字段说明:
| 字段名     | 类型 | 必填 | 说明                        |
|-----------|------|------|-----------------------------|
| store_slug| TEXT | ✅   | 店铺slug                    |
| city_slug | TEXT | ✅   | 城市slug（用于定位店铺）      |
| brand_name| TEXT | ✅   | 品牌名称（必须在brands表存在）|
*/

-- =====================================================
-- 4. 店铺产品导入 (Store Products)
-- =====================================================

CREATE TEMP TABLE temp_products (
    store_slug TEXT,
    city_slug TEXT,
    product_name TEXT,
    product_url TEXT
);

-- psql: \copy temp_products FROM 'import_template_products.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.store_products (store_id, name, url)
SELECT s.id, t.product_name, NULLIF(t.product_url, '')
FROM temp_products t
JOIN public.stores s ON s.slug = t.store_slug AND s.city_slug = t.city_slug;

DROP TABLE temp_products;

/*
字段说明:
| 字段名      | 类型          | 必填 | 说明                   |
|------------|---------------|------|------------------------|
| store_slug | TEXT          | ✅   | 店铺slug               |
| city_slug  | TEXT          | ✅   | 城市slug               |
| product_name| VARCHAR(200) | ✅   | 产品名称               |
| product_url| TEXT          | ❌   | 产品链接               |
*/

-- =====================================================
-- 5. 评论导入 (Reviews)
-- =====================================================

CREATE TEMP TABLE temp_reviews (
    store_slug TEXT,
    city_slug TEXT,
    user_name TEXT,
    user_avatar TEXT,
    overall_rating DECIMAL(2,1),
    service_rating DECIMAL(2,1),
    inventory_rating DECIMAL(2,1),
    pricing_rating DECIMAL(2,1),
    content TEXT,
    is_approved BOOLEAN,
    created_at DATE
);

-- psql: \copy temp_reviews FROM 'import_template_reviews.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.reviews (store_id, user_name, user_avatar, overall_rating, service_rating, inventory_rating, pricing_rating, content, is_approved, created_at)
SELECT 
    s.id,
    t.user_name,
    NULLIF(t.user_avatar, ''),
    t.overall_rating,
    t.service_rating,
    t.inventory_rating,
    t.pricing_rating,
    t.content,
    t.is_approved,
    t.created_at::timestamptz
FROM temp_reviews t
JOIN public.stores s ON s.slug = t.store_slug AND s.city_slug = t.city_slug;

DROP TABLE temp_reviews;

/*
字段说明:
| 字段名          | 类型          | 必填 | 说明                        |
|----------------|---------------|------|-----------------------------|
| store_slug     | TEXT          | ✅   | 店铺slug                    |
| city_slug      | TEXT          | ✅   | 城市slug                    |
| user_name      | VARCHAR(100)  | ✅   | 评论者名称                   |
| user_avatar    | TEXT          | ❌   | 评论者头像URL                |
| overall_rating | DECIMAL(2,1)  | ✅   | 总评分 0-5                   |
| service_rating | DECIMAL(2,1)  | ❌   | 服务评分 0-5                 |
| inventory_rating| DECIMAL(2,1) | ❌   | 库存评分 0-5                 |
| pricing_rating | DECIMAL(2,1)  | ❌   | 价格评分 0-5                 |
| content        | TEXT          | ❌   | 评论内容                     |
| is_approved    | BOOLEAN       | ❌   | 是否已审核，默认false         |
| created_at     | DATE          | ❌   | 评论日期，格式 YYYY-MM-DD     |
*/

-- =====================================================
-- 导入后更新店铺统计
-- =====================================================

-- 更新店铺评论数和评分
UPDATE public.stores s SET
    review_count = (SELECT COUNT(*) FROM public.reviews r WHERE r.store_id = s.id AND r.is_approved = true),
    rating = (SELECT COALESCE(AVG(overall_rating), 0) FROM public.reviews r WHERE r.store_id = s.id AND r.is_approved = true),
    service_rating = (SELECT COALESCE(AVG(service_rating), 0) FROM public.reviews r WHERE r.store_id = s.id AND r.is_approved = true),
    inventory_rating = (SELECT COALESCE(AVG(inventory_rating), 0) FROM public.reviews r WHERE r.store_id = s.id AND r.is_approved = true),
    pricing_rating = (SELECT COALESCE(AVG(pricing_rating), 0) FROM public.reviews r WHERE r.store_id = s.id AND r.is_approved = true);

-- 更新城市店铺数和评分
UPDATE public.cities c SET
    store_count = (SELECT COUNT(*) FROM public.stores s WHERE s.city_slug = c.slug),
    avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM public.stores s WHERE s.city_slug = c.slug AND s.rating > 0);
