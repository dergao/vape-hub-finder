-- =====================================================
-- 完整批量导入指南
-- Complete Bulk Import Guide
-- 包含所有表的导入SQL和字段说明
-- =====================================================

-- =====================================================
-- 导入顺序（必须按此顺序执行以满足外键约束）
-- =====================================================
-- 1. cities (城市)
-- 2. brands (品牌)
-- 3. stores (店铺)
-- 4. store_brands (店铺-品牌关联)
-- 5. store_products (店铺产品)
-- 6. store_images (店铺图库)
-- 7. reviews (评论)
-- 8. coupons (优惠券)
-- 9. advertisements (广告)
-- 10. social_groups (社交群组)
-- 11. 统计更新

-- =====================================================
-- 1. 城市导入 (Cities)
-- =====================================================

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
SELECT name, slug, state, country, COALESCE(store_count, 0), COALESCE(avg_rating, 0), NULLIF(image_url, '')
FROM temp_cities
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    state = EXCLUDED.state,
    store_count = EXCLUDED.store_count,
    avg_rating = EXCLUDED.avg_rating,
    image_url = EXCLUDED.image_url;

DROP TABLE temp_cities;

/*
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

CREATE TEMP TABLE temp_brands (
    name TEXT,
    logo_url TEXT,
    website_url TEXT
);

-- psql: \copy temp_brands FROM 'import_template_brands.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.brands (name, logo_url, website_url)
SELECT name, NULLIF(logo_url, ''), NULLIF(website_url, '')
FROM temp_brands
ON CONFLICT (name) DO UPDATE SET
    logo_url = EXCLUDED.logo_url,
    website_url = EXCLUDED.website_url;

DROP TABLE temp_brands;

/*
| 字段名      | 类型          | 必填 | 说明              |
|------------|---------------|------|------------------|
| name       | VARCHAR(100)  | ✅   | 品牌名称，全局唯一 |
| logo_url   | TEXT          | ❌   | 品牌Logo URL      |
| website_url| TEXT          | ❌   | 品牌官网          |
*/

-- =====================================================
-- 3. 店铺导入 (Stores)
-- =====================================================

CREATE TEMP TABLE temp_stores (
    name TEXT,
    slug TEXT,
    city_slug TEXT,
    address TEXT,
    state TEXT,
    zip TEXT,
    phone TEXT,
    description TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    rating DECIMAL(2,1),
    review_count INTEGER,
    service_rating DECIMAL(2,1),
    inventory_rating DECIMAL(2,1),
    pricing_rating DECIMAL(2,1),
    is_open BOOLEAN,
    is_sponsored BOOLEAN,
    hours_json TEXT
);

-- psql: \copy temp_stores FROM 'import_template_stores.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.stores (name, slug, city_slug, address, state, zip, phone, description, latitude, longitude, rating, review_count, service_rating, inventory_rating, pricing_rating, is_open, is_sponsored, hours)
SELECT 
    name, slug, city_slug, address, state, zip, phone, description,
    latitude, longitude, 
    COALESCE(rating, 0), COALESCE(review_count, 0), 
    COALESCE(service_rating, 0), COALESCE(inventory_rating, 0), COALESCE(pricing_rating, 0),
    COALESCE(is_open, true), COALESCE(is_sponsored, false), 
    COALESCE(hours_json::jsonb, '{}'::jsonb)
FROM temp_stores
ON CONFLICT (city_slug, slug) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    description = EXCLUDED.description,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    is_open = EXCLUDED.is_open,
    is_sponsored = EXCLUDED.is_sponsored,
    hours = EXCLUDED.hours;

DROP TABLE temp_stores;

/*
| 字段名           | 类型          | 必填 | 说明                                    |
|-----------------|---------------|------|----------------------------------------|
| name            | VARCHAR(200)  | ✅   | 店铺名称                                |
| slug            | VARCHAR(200)  | ✅   | URL友好标识，同城市内唯一                 |
| city_slug       | VARCHAR(100)  | ✅   | 所属城市slug，必须在cities表中存在        |
| address         | TEXT          | ✅   | 完整地址                                |
| state           | VARCHAR(50)   | ✅   | 州/省                                   |
| zip             | VARCHAR(20)   | ❌   | 邮编                                    |
| phone           | VARCHAR(30)   | ❌   | 电话号码                                |
| description     | TEXT          | ❌   | 店铺描述                                |
| latitude        | DECIMAL(10,7) | ❌   | 纬度（用于距离计算）                      |
| longitude       | DECIMAL(10,7) | ❌   | 经度（用于距离计算）                      |
| rating          | DECIMAL(2,1)  | ❌   | 总评分 0-5，默认0                        |
| review_count    | INTEGER       | ❌   | 评论数量，默认0                          |
| service_rating  | DECIMAL(2,1)  | ❌   | 服务评分 0-5                            |
| inventory_rating| DECIMAL(2,1)  | ❌   | 库存评分 0-5                            |
| pricing_rating  | DECIMAL(2,1)  | ❌   | 价格评分 0-5                            |
| is_open         | BOOLEAN       | ❌   | 是否营业中，默认true                     |
| is_sponsored    | BOOLEAN       | ❌   | 是否赞助商，默认false                    |
| hours_json      | TEXT(JSON)    | ❌   | 营业时间JSON字符串                       |

hours_json 格式示例:
{"monday": {"open": "09:00", "close": "21:00"}, "sunday": {"closed": true}}
*/

-- =====================================================
-- 4. 店铺-品牌关联导入 (Store Brands)
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
| 字段名     | 类型 | 必填 | 说明                        |
|-----------|------|------|-----------------------------|
| store_slug| TEXT | ✅   | 店铺slug                    |
| city_slug | TEXT | ✅   | 城市slug                    |
| brand_name| TEXT | ✅   | 品牌名称（需在brands表存在）  |
*/

-- =====================================================
-- 5. 店铺产品导入 (Store Products) - 关联品牌
-- =====================================================

CREATE TEMP TABLE temp_products (
    store_slug TEXT,
    city_slug TEXT,
    brand_name TEXT,
    product_name TEXT,
    product_url TEXT
);

-- psql: \copy temp_products FROM 'import_template_products.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.store_products (store_id, brand_id, name, url)
SELECT s.id, b.id, t.product_name, NULLIF(t.product_url, '')
FROM temp_products t
JOIN public.stores s ON s.slug = t.store_slug AND s.city_slug = t.city_slug
LEFT JOIN public.brands b ON b.name = t.brand_name;

DROP TABLE temp_products;

/*
| 字段名      | 类型          | 必填 | 说明                          |
|------------|---------------|------|-------------------------------|
| store_slug | TEXT          | ✅   | 店铺slug                      |
| city_slug  | TEXT          | ✅   | 城市slug                      |
| brand_name | TEXT          | ❌   | 品牌名称（需在brands表中存在）  |
| product_name| VARCHAR(200) | ✅   | 产品名称                      |
| product_url| TEXT          | ❌   | 产品链接                      |
*/

-- =====================================================
-- 6. 店铺图库导入 (Store Images)
-- =====================================================

CREATE TEMP TABLE temp_store_images (
    store_slug TEXT,
    city_slug TEXT,
    image_url TEXT,
    sort_order INTEGER
);

-- psql: \copy temp_store_images FROM 'import_template_store_images.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.store_images (store_id, image_url, sort_order)
SELECT s.id, t.image_url, COALESCE(t.sort_order, 0)
FROM temp_store_images t
JOIN public.stores s ON s.slug = t.store_slug AND s.city_slug = t.city_slug;

DROP TABLE temp_store_images;

/*
| 字段名     | 类型    | 必填 | 说明                |
|-----------|---------|------|---------------------|
| store_slug| TEXT    | ✅   | 店铺slug            |
| city_slug | TEXT    | ✅   | 城市slug            |
| image_url | TEXT    | ✅   | 图片URL             |
| sort_order| INTEGER | ❌   | 排序顺序，默认0      |
*/

-- =====================================================
-- 7. 评论导入 (Reviews)
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
    COALESCE(t.is_approved, false),
    COALESCE(t.created_at::timestamptz, NOW())
FROM temp_reviews t
JOIN public.stores s ON s.slug = t.store_slug AND s.city_slug = t.city_slug;

DROP TABLE temp_reviews;

/*
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
-- 8. 优惠券导入 (Coupons)
-- =====================================================

CREATE TEMP TABLE temp_coupons (
    store_slug TEXT,
    city_slug TEXT,
    code TEXT,
    description TEXT,
    discount_type TEXT,
    discount_value DECIMAL(10,2),
    min_purchase DECIMAL(10,2),
    expires_at DATE,
    is_active BOOLEAN
);

-- psql: \copy temp_coupons FROM 'import_template_coupons.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.coupons (store_id, code, description, discount_type, discount_value, min_purchase, expires_at, is_active)
SELECT 
    s.id,
    t.code,
    t.description,
    t.discount_type,
    t.discount_value,
    t.min_purchase,
    t.expires_at::timestamptz,
    COALESCE(t.is_active, true)
FROM temp_coupons t
JOIN public.stores s ON s.slug = t.store_slug AND s.city_slug = t.city_slug;

DROP TABLE temp_coupons;

/*
| 字段名        | 类型          | 必填 | 说明                              |
|--------------|---------------|------|----------------------------------|
| store_slug   | TEXT          | ✅   | 店铺slug                          |
| city_slug    | TEXT          | ✅   | 城市slug                          |
| code         | VARCHAR(50)   | ✅   | 优惠码                            |
| description  | TEXT          | ❌   | 优惠描述                          |
| discount_type| TEXT          | ❌   | 折扣类型: percentage / fixed      |
| discount_value| DECIMAL(10,2)| ❌   | 折扣值（百分比或金额）             |
| min_purchase | DECIMAL(10,2) | ❌   | 最低消费要求                       |
| expires_at   | DATE          | ❌   | 过期日期，格式 YYYY-MM-DD          |
| is_active    | BOOLEAN       | ❌   | 是否激活，默认true                 |
*/

-- =====================================================
-- 9. 广告导入 (Advertisements)
-- =====================================================

CREATE TEMP TABLE temp_advertisements (
    type TEXT,
    title TEXT,
    image_url TEXT,
    target_url TEXT,
    store_slug TEXT,
    city_slug TEXT,
    is_active BOOLEAN,
    impressions INTEGER,
    clicks INTEGER,
    start_date DATE,
    end_date DATE
);

-- psql: \copy temp_advertisements FROM 'import_template_advertisements.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.advertisements (type, title, image_url, target_url, store_id, city_slug, is_active, impressions, clicks, start_date, end_date)
SELECT 
    t.type,
    t.title,
    NULLIF(t.image_url, ''),
    NULLIF(t.target_url, ''),
    s.id,
    NULLIF(t.city_slug, ''),
    COALESCE(t.is_active, true),
    COALESCE(t.impressions, 0),
    COALESCE(t.clicks, 0),
    t.start_date,
    t.end_date
FROM temp_advertisements t
LEFT JOIN public.stores s ON s.slug = t.store_slug AND s.city_slug = t.city_slug;

DROP TABLE temp_advertisements;

/*
| 字段名      | 类型          | 必填 | 说明                                          |
|------------|---------------|------|----------------------------------------------|
| type       | TEXT          | ✅   | 广告类型: sponsored_store/list_banner/detail_banner |
| title      | VARCHAR(200)  | ❌   | 广告标题                                      |
| image_url  | TEXT          | ❌   | 广告图片URL（banner类型必填）                  |
| target_url | TEXT          | ❌   | 点击跳转URL                                   |
| store_slug | TEXT          | ❌   | 店铺slug（sponsored_store类型必填）           |
| city_slug  | TEXT          | ❌   | 城市slug（限定广告显示城市）                   |
| is_active  | BOOLEAN       | ❌   | 是否激活，默认true                            |
| impressions| INTEGER       | ❌   | 展示次数，默认0                               |
| clicks     | INTEGER       | ❌   | 点击次数，默认0                               |
| start_date | DATE          | ❌   | 开始日期，格式 YYYY-MM-DD                     |
| end_date   | DATE          | ❌   | 结束日期，格式 YYYY-MM-DD                     |
*/

-- =====================================================
-- 10. 社交群组导入 (Social Groups)
-- =====================================================

CREATE TEMP TABLE temp_social_groups (
    name TEXT,
    platform TEXT,
    url TEXT,
    member_count INTEGER,
    description TEXT,
    is_active BOOLEAN
);

-- psql: \copy temp_social_groups FROM 'import_template_social_groups.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO public.social_groups (name, platform, url, member_count, description, is_active)
SELECT 
    name,
    platform,
    url,
    COALESCE(member_count, 0),
    description,
    COALESCE(is_active, true)
FROM temp_social_groups;

DROP TABLE temp_social_groups;

/*
| 字段名      | 类型          | 必填 | 说明                                    |
|------------|---------------|------|-----------------------------------------|
| name       | VARCHAR(200)  | ✅   | 群组名称                                 |
| platform   | TEXT          | ✅   | 平台: whatsapp / telegram / facebook    |
| url        | TEXT          | ✅   | 群组链接                                 |
| member_count| INTEGER      | ❌   | 成员数量，默认0                          |
| description| TEXT          | ❌   | 群组描述                                 |
| is_active  | BOOLEAN       | ❌   | 是否激活，默认true                       |
*/

-- =====================================================
-- 11. 统计更新（导入完成后执行）
-- =====================================================

-- 更新店铺评论数和评分
UPDATE public.stores s SET
    review_count = (SELECT COUNT(*) FROM public.reviews r WHERE r.store_id = s.id AND r.is_approved = true),
    rating = COALESCE((SELECT AVG(overall_rating) FROM public.reviews r WHERE r.store_id = s.id AND r.is_approved = true), s.rating),
    service_rating = COALESCE((SELECT AVG(service_rating) FROM public.reviews r WHERE r.store_id = s.id AND r.is_approved = true), s.service_rating),
    inventory_rating = COALESCE((SELECT AVG(inventory_rating) FROM public.reviews r WHERE r.store_id = s.id AND r.is_approved = true), s.inventory_rating),
    pricing_rating = COALESCE((SELECT AVG(pricing_rating) FROM public.reviews r WHERE r.store_id = s.id AND r.is_approved = true), s.pricing_rating);

-- 更新城市店铺数和评分
UPDATE public.cities c SET
    store_count = (SELECT COUNT(*) FROM public.stores s WHERE s.city_slug = c.slug),
    avg_rating = COALESCE((SELECT AVG(rating) FROM public.stores s WHERE s.city_slug = c.slug AND s.rating > 0), 0);

-- =====================================================
-- Node.js 批量导入脚本示例
-- =====================================================

/*
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const csv = require('csv-parser');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // 使用 service_role key 绕过 RLS
);

async function importCSV(filePath, tableName, transform) {
  const rows = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => rows.push(transform(row)))
      .on('end', async () => {
        const batchSize = 1000;
        for (let i = 0; i < rows.length; i += batchSize) {
          const batch = rows.slice(i, i + batchSize);
          const { error } = await supabase.from(tableName).insert(batch);
          if (error) {
            console.error(`Error inserting into ${tableName}:`, error);
            reject(error);
            return;
          }
          console.log(`Inserted ${batch.length} rows into ${tableName}`);
        }
        resolve(rows.length);
      })
      .on('error', reject);
  });
}

// 使用示例
await importCSV('import_template_cities.csv', 'cities', (row) => ({
  name: row.name,
  slug: row.slug,
  state: row.state,
  country: row.country || 'us',
  store_count: parseInt(row.store_count) || 0,
  avg_rating: parseFloat(row.avg_rating) || 0,
  image_url: row.image_url || null
}));
*/

SELECT 'Bulk import SQL ready!' as status;
