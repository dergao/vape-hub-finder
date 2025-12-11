# 本地部署指南 (Self-Hosting Guide)

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
