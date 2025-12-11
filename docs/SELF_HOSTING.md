# 本地部署指南 (Self-Hosting Guide)

> 📖 **完整 Docker 部署指南:** 参见 [DOCKER_SELF_HOSTING.md](./DOCKER_SELF_HOSTING.md)
> 
> 📌 本指南同时支持 **Linux** 和 **Windows** 环境

## 部署方案对比

| 方案 | 难度 | 月费用 | 适合场景 |
|------|------|--------|---------|
| **Vercel + Supabase Cloud** | ⭐ | 免费起步 | 快速上线、小流量 |
| **Docker 自托管** | ⭐⭐⭐ | $10-40 | 完全控制、大流量 |

## 环境要求

- **Node.js**: v18+ (推荐 v20 LTS)
- **包管理器**: npm / yarn / pnpm / bun
- **数据库**: PostgreSQL 15+ (或 Supabase 自托管/云服务)

---

## 1. 克隆项目

### 🐧 Linux / macOS

```bash
# 公开仓库
git clone <your-github-repo-url>
cd <project-folder>
npm install

# 私有仓库 (使用 Personal Access Token)
git clone https://<用户名>:<PAT令牌>@github.com/<用户名>/<仓库名>.git
cd <project-folder>
npm install
```

### 🪟 Windows (PowerShell)

```powershell
# 公开仓库
git clone <your-github-repo-url>
Set-Location <project-folder>
npm install

# 私有仓库方法1: 使用 Personal Access Token
git clone https://<用户名>:<PAT令牌>@github.com/<用户名>/<仓库名>.git
Set-Location <project-folder>
npm install

# 私有仓库方法2: Windows Credential Manager 自动弹窗
git clone https://github.com/<用户名>/<仓库名>.git
# Windows 会自动弹出登录窗口
```

**获取 GitHub Personal Access Token (PAT)：**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → 勾选 `repo` 权限
3. 复制生成的 token

---

## 2. 环境变量配置

### 🐧 Linux / macOS

```bash
cat > .env << EOF
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
EOF
```

### 🪟 Windows (PowerShell)

```powershell
@"
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
"@ | Out-File -FilePath .env -Encoding UTF8
```

或手动创建 `.env` 文件并添加以上内容。

### Supabase 选项

**选项 A: Supabase 云服务 (推荐)**
1. 前往 [supabase.com](https://supabase.com) 创建免费项目
2. 在 Project Settings > API 获取 URL 和 anon key

**选项 B: Supabase 自托管**

详见 [DOCKER_SELF_HOSTING.md](./DOCKER_SELF_HOSTING.md)

---

## 3. 数据库初始化

在 Supabase SQL Editor 或 psql 中执行 `docs/database_schema.sql` 文件。

### 🪟 Windows psql 连接示例

```powershell
# 如果安装了 PostgreSQL
psql -h your-host -U postgres -d postgres -f docs/database_schema.sql

# 或进入交互模式后粘贴 SQL
psql -h your-host -U postgres -d postgres
```

---

## 4. 存储桶配置

在 Supabase Dashboard > Storage 创建以下桶：
- `city-images` (Public)
- `store-images` (Public)

或使用 SQL 创建：
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('city-images', 'city-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('store-images', 'store-images', true);
```

---

## 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

---

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

---

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

#### 🐧 Linux / macOS

```bash
# 连接数据库
psql -h your-host -U postgres -d postgres

# 执行导入SQL
\i docs/bulk_import_complete.sql
```

#### 🪟 Windows

```powershell
# 连接数据库
psql -h your-host -U postgres -d postgres

# 在 psql 中执行 (注意使用正斜杠)
\i C:/path/to/docs/bulk_import_complete.sql

# 或复制文件内容直接粘贴执行
```

### 使用 Node.js 脚本导入

参考 `bulk_import_complete.sql` 中的 JavaScript 示例代码。
