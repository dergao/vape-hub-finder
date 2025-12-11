-- =====================================================
-- 批量导入店铺数据 SQL 模板
-- Bulk Import Stores SQL Template
-- =====================================================

-- 方法 1: 直接 SQL INSERT（推荐小批量）
INSERT INTO public.stores (name, slug, city_slug, address, state, zip, phone, description, latitude, longitude, rating, review_count, service_rating, inventory_rating, pricing_rating, is_open, is_sponsored, hours) VALUES
('Store Name 1', 'store-name-1', 'los-angeles', '123 Main St', 'California', '90001', '(323) 555-0001', 'Description here', 34.0522, -118.2437, 4.5, 100, 4.5, 4.5, 4.5, true, false, '{"monday": {"open": "09:00", "close": "21:00"}}'),
('Store Name 2', 'store-name-2', 'new-york', '456 Broadway', 'New York', '10001', '(212) 555-0002', 'Description here', 40.7128, -74.0060, 4.2, 50, 4.0, 4.3, 4.2, true, false, '{"monday": {"open": "10:00", "close": "20:00"}}');

-- =====================================================
-- 方法 2: 从 CSV 导入（使用 psql）
-- =====================================================

-- 步骤 1: 创建临时表
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

-- 步骤 2: 导入 CSV（在 psql 中执行）
-- \copy temp_stores FROM 'import_template_stores.csv' WITH (FORMAT csv, HEADER true);

-- 步骤 3: 插入到正式表
INSERT INTO public.stores (name, slug, city_slug, address, state, zip, phone, description, latitude, longitude, rating, review_count, service_rating, inventory_rating, pricing_rating, is_open, is_sponsored, hours)
SELECT 
    name, slug, city_slug, address, state, zip, phone, description,
    latitude, longitude, rating, review_count, service_rating, inventory_rating, pricing_rating,
    is_open, is_sponsored, hours_json::jsonb
FROM temp_stores;

-- 步骤 4: 清理
DROP TABLE temp_stores;

-- =====================================================
-- 方法 3: 使用 Supabase JavaScript SDK 批量导入
-- =====================================================

/*
// Node.js 脚本示例
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const csv = require('csv-parser');

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SERVICE_ROLE_KEY' // 使用 service_role key 绕过 RLS
);

const stores = [];

fs.createReadStream('import_template_stores.csv')
  .pipe(csv())
  .on('data', (row) => {
    stores.push({
      name: row.name,
      slug: row.slug,
      city_slug: row.city_slug,
      address: row.address,
      state: row.state,
      zip: row.zip,
      phone: row.phone,
      description: row.description,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      rating: parseFloat(row.rating),
      review_count: parseInt(row.review_count),
      service_rating: parseFloat(row.service_rating),
      inventory_rating: parseFloat(row.inventory_rating),
      pricing_rating: parseFloat(row.pricing_rating),
      is_open: row.is_open === 'true',
      is_sponsored: row.is_sponsored === 'true',
      hours: JSON.parse(row.hours_json)
    });
  })
  .on('end', async () => {
    // 批量插入（每次最多 1000 条）
    const batchSize = 1000;
    for (let i = 0; i < stores.length; i += batchSize) {
      const batch = stores.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('stores')
        .insert(batch);
      
      if (error) {
        console.error('Error inserting batch:', error);
      } else {
        console.log(`Inserted ${batch.length} stores`);
      }
    }
  });
*/

-- =====================================================
-- 字段说明
-- =====================================================

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
| rating          | DECIMAL(2,1)  | ❌   | 总评分 0-5                              |
| review_count    | INTEGER       | ❌   | 评论数量                                |
| service_rating  | DECIMAL(2,1)  | ❌   | 服务评分 0-5                            |
| inventory_rating| DECIMAL(2,1)  | ❌   | 库存评分 0-5                            |
| pricing_rating  | DECIMAL(2,1)  | ❌   | 价格评分 0-5                            |
| is_open         | BOOLEAN       | ❌   | 是否营业中，默认true                     |
| is_sponsored    | BOOLEAN       | ❌   | 是否赞助商，默认false                    |
| hours           | JSONB         | ❌   | 营业时间JSON                            |

hours JSON 格式示例:
{
  "monday": {"open": "09:00", "close": "21:00"},
  "tuesday": {"open": "09:00", "close": "21:00"},
  "sunday": {"closed": true}
}
*/
