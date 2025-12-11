# 本地部署指南 (Self-Hosting Guide)

> 📖 **完整 Docker 部署指南:** 参见 [DOCKER_SELF_HOSTING.md](./DOCKER_SELF_HOSTING.md)

## 部署方案对比

| 方案 | 难度 | 月费用 | 适合场景 |
|------|------|--------|---------|
| **Vercel + Supabase Cloud** | ⭐ | 免费起步 | 快速上线、小流量 |
| **Docker 自托管** | ⭐⭐⭐ | $10-40 | 完全控制、大流量 |

## 环境要求

- **Node.js**: v18+ (推荐 v20 LTS)
- **包管理器**: npm / yarn / pnpm / bun
- **数据库**: PostgreSQL 15+ (或 Supabase 自托管/云服务)

## 1. 克隆项目

```bash
git clone <your-github-repo-url>
cd <project-folder>
npm install
```

## 2. 环境变量配置

创建 `.env` 文件：

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### Supabase 选项

**选项 A: Supabase 云服务 (推荐)**
1. 前往 [supabase.com](https://supabase.com) 创建免费项目
2. 在 Project Settings > API 获取 URL 和 anon key

**选项 B: Supabase 自托管**
```bash
# 使用 Docker 部署 Supabase
git clone https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env
docker compose up -d
```

## 3. 数据库初始化

在 Supabase SQL Editor 或 psql 中执行 `docs/database_schema.sql` 文件。

## 4. 存储桶配置

在 Supabase Dashboard > Storage 创建以下桶：
- `city-images` (Public)
- `store-images` (Public)

或使用 SQL 创建：
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('city-images', 'city-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('store-images', 'store-images', true);
```

## 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

## 6. 生产部署

```bash
npm run build
```

部署 `dist` 文件夹到任何静态托管服务：
- Vercel
- Netlify
- Cloudflare Pages
- Nginx / Apache

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/vape-finder/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 7. 环境变量（生产）

确保在生产环境中设置：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## 数据导入

### 文件清单

| 文件 | 说明 |
|------|------|
| `database_schema.sql` | 完整建表SQL + 演示数据 |
| `bulk_import_complete.sql` | 所有表的批量导入SQL指南 |
| `import_template_cities.csv` | 城市数据模板 |
| `import_template_stores.csv` | 店铺数据模板 |
| `import_template_brands.csv` | 品牌数据模板 |
| `import_template_store_brands.csv` | 店铺-品牌关联模板 |
| `import_template_products.csv` | 店铺产品模板 |
| `import_template_reviews.csv` | 评论数据模板 |
| `import_template_store_images.csv` | 店铺图库模板 |
| `import_template_advertisements.csv` | 广告数据模板 |
| `import_template_coupons.csv` | 优惠券数据模板 |
| `import_template_social_groups.csv` | 社交群组模板 |

### 导入顺序

⚠️ **必须按以下顺序导入以满足外键约束：**

1. 城市 (cities)
2. 品牌 (brands)
3. 店铺 (stores)
4. 店铺-品牌关联 (store_brands)
5. 店铺产品 (store_products)
6. 店铺图库 (store_images)
7. 评论 (reviews)
8. 优惠券 (coupons)
9. 广告 (advertisements)
10. 社交群组 (social_groups)
11. 运行统计更新SQL

### 使用 psql 批量导入

```bash
# 连接数据库
psql -h your-host -U postgres -d postgres

# 执行导入SQL
\i docs/bulk_import_complete.sql
```

### 使用 Node.js 脚本导入

参考 `bulk_import_complete.sql` 中的 JavaScript 示例代码。
