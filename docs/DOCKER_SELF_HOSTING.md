# Docker 自托管完整部署指南

本指南详细说明如何在自己的服务器上完全自托管部署 VapeFinder 平台。

## 系统要求

| 组件 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | 2核 | 4核 |
| 内存 | 4GB | 8GB |
| 硬盘 | 40GB SSD | 100GB SSD |
| 系统 | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                        Nginx (反向代理)                       │
│                    SSL/TLS + 静态文件缓存                      │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Frontend      │ │   Supabase      │ │   Supabase      │
│   (静态文件)     │ │   Kong API      │ │   Studio        │
│   Port: 3000    │ │   Port: 8000    │ │   Port: 3001    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
                              │
                              ▼
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │   GoTrue        │ │   Storage       │
│   Port: 5432    │ │   (Auth)        │ │   (S3兼容)       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 第一部分：服务器初始化

### 1.1 安装 Docker 和 Docker Compose

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装依赖
sudo apt install -y ca-certificates curl gnupg lsb-release

# 添加 Docker GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 添加 Docker 仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER

# 验证安装
docker --version
docker compose version
```

### 1.2 安装 Node.js (用于构建前端)

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 安装 Node.js 20 LTS
nvm install 20
nvm use 20

# 验证安装
node --version
npm --version
```

## 第二部分：部署 Supabase 自托管

### 2.1 克隆 Supabase Docker 配置

```bash
# 创建项目目录
mkdir -p /opt/vapefinder
cd /opt/vapefinder

# 克隆 Supabase
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# 复制环境配置
cp .env.example .env
```

### 2.2 配置 Supabase 环境变量

编辑 `.env` 文件：

```bash
nano .env
```

**重要配置项：**

```env
############
# Secrets - 必须修改！
############

# 生成安全密钥: openssl rand -base64 32
POSTGRES_PASSWORD=your-super-secret-postgres-password
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters
ANON_KEY=生成的-anon-key
SERVICE_ROLE_KEY=生成的-service-role-key

############
# Database
############
POSTGRES_HOST=db
POSTGRES_DB=postgres
POSTGRES_PORT=5432

############
# API
############
SITE_URL=https://your-domain.com
API_EXTERNAL_URL=https://api.your-domain.com

############
# Auth
############
GOTRUE_SITE_URL=https://your-domain.com
GOTRUE_EXTERNAL_EMAIL_ENABLED=true
GOTRUE_MAILER_AUTOCONFIRM=true  # 开发时设为true，生产建议false

############
# Studio (可选，管理后台)
############
STUDIO_PORT=3001
SUPABASE_PUBLIC_URL=https://api.your-domain.com
```

### 2.3 生成 JWT 密钥

使用 Supabase 提供的工具生成密钥：

```bash
# 安装 supabase CLI
npm install -g supabase

# 或使用在线工具生成: https://supabase.com/docs/guides/self-hosting#api-keys
# 需要生成:
# 1. JWT_SECRET (至少32字符)
# 2. ANON_KEY (基于 JWT_SECRET 生成)
# 3. SERVICE_ROLE_KEY (基于 JWT_SECRET 生成)
```

**在线生成工具：** https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys

### 2.4 启动 Supabase

```bash
cd /opt/vapefinder/supabase/docker

# 拉取镜像
docker compose pull

# 启动所有服务
docker compose up -d

# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f
```

### 2.5 初始化数据库

```bash
# 进入 PostgreSQL 容器
docker compose exec db psql -U postgres

# 或从外部连接
psql -h localhost -p 5432 -U postgres -d postgres

# 执行建表 SQL
\i /path/to/docs/database_schema.sql
```

## 第三部分：部署前端应用

### 3.1 克隆项目并构建

```bash
cd /opt/vapefinder

# 克隆你的项目
git clone https://github.com/your-username/vapefinder-app.git frontend
cd frontend

# 安装依赖
npm install

# 创建环境变量文件
cat > .env.production << EOF
VITE_SUPABASE_URL=https://api.your-domain.com
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=self-hosted
EOF

# 构建生产版本
npm run build
```

### 3.2 创建前端 Docker 镜像

创建 `Dockerfile`：

```dockerfile
# /opt/vapefinder/frontend/Dockerfile
FROM nginx:alpine

# 复制构建产物
COPY dist/ /usr/share/nginx/html/

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

创建 `nginx.conf`：

```nginx
# /opt/vapefinder/frontend/nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;
    gzip_comp_level 6;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 健康检查
    location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
```

构建并运行：

```bash
cd /opt/vapefinder/frontend

# 构建镜像
docker build -t vapefinder-frontend:latest .

# 运行容器
docker run -d \
  --name vapefinder-frontend \
  --restart unless-stopped \
  -p 3000:80 \
  vapefinder-frontend:latest
```

## 第四部分：配置 Nginx 反向代理

### 4.1 安装 Nginx 和 Certbot

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 4.2 创建 Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/vapefinder
```

```nginx
# 前端站点
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书 (Certbot 自动配置)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 前端代理
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Supabase API
server {
    listen 80;
    server_name api.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/api.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.your-domain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Supabase Kong API Gateway
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # WebSocket 支持 (Realtime)
        proxy_read_timeout 86400;
    }
}
```

### 4.3 启用站点并获取 SSL 证书

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/vapefinder /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com

# 重启 Nginx
sudo systemctl restart nginx

# 设置自动续期
sudo certbot renew --dry-run
```

## 第五部分：Docker Compose 一键部署

创建统一的 `docker-compose.yml`：

```yaml
# /opt/vapefinder/docker-compose.yml
version: '3.8'

services:
  # 前端应用
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: vapefinder-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - kong
    networks:
      - vapefinder-network

  # 以下为 Supabase 服务 (从 supabase/docker 引入)
  # ... 参考 supabase/docker/docker-compose.yml

networks:
  vapefinder-network:
    driver: bridge

volumes:
  postgres-data:
  storage-data:
```

## 第六部分：维护与监控

### 6.1 常用命令

```bash
# 查看所有容器状态
docker ps -a

# 查看日志
docker logs -f vapefinder-frontend
docker compose -f /opt/vapefinder/supabase/docker/docker-compose.yml logs -f

# 重启服务
docker restart vapefinder-frontend
docker compose -f /opt/vapefinder/supabase/docker/docker-compose.yml restart

# 更新前端
cd /opt/vapefinder/frontend
git pull
npm install
npm run build
docker build -t vapefinder-frontend:latest .
docker stop vapefinder-frontend
docker rm vapefinder-frontend
docker run -d --name vapefinder-frontend --restart unless-stopped -p 3000:80 vapefinder-frontend:latest
```

### 6.2 数据库备份

```bash
# 创建备份脚本
cat > /opt/vapefinder/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/vapefinder/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# 备份 PostgreSQL
docker compose -f /opt/vapefinder/supabase/docker/docker-compose.yml exec -T db pg_dump -U postgres postgres > $BACKUP_DIR/db_$DATE.sql

# 压缩
gzip $BACKUP_DIR/db_$DATE.sql

# 保留最近 7 天备份
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: db_$DATE.sql.gz"
EOF

chmod +x /opt/vapefinder/backup.sh

# 添加定时任务 (每天凌晨2点备份)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/vapefinder/backup.sh") | crontab -
```

### 6.3 监控 (可选)

```bash
# 安装 ctop 监控容器
sudo wget https://github.com/bcicen/ctop/releases/download/v0.7.7/ctop-0.7.7-linux-amd64 -O /usr/local/bin/ctop
sudo chmod +x /usr/local/bin/ctop

# 运行监控
ctop
```

## 第七部分：故障排查

### 常见问题

| 问题 | 排查命令 | 解决方案 |
|------|---------|---------|
| 容器无法启动 | `docker logs <container>` | 检查环境变量和端口占用 |
| 数据库连接失败 | `docker compose exec db psql -U postgres` | 检查 POSTGRES_PASSWORD |
| API 401 错误 | 检查 ANON_KEY | 重新生成 JWT 密钥 |
| SSL 证书过期 | `sudo certbot renew` | 检查定时任务 |
| 磁盘空间不足 | `docker system prune -a` | 清理无用镜像 |

### 查看服务状态

```bash
# 检查所有服务
docker compose -f /opt/vapefinder/supabase/docker/docker-compose.yml ps

# 检查端口占用
sudo netstat -tlnp | grep -E '3000|8000|5432'

# 检查 Nginx 状态
sudo systemctl status nginx
```

## 费用估算

| 配置 | 月费用 (美元) |
|------|-------------|
| 基础 VPS (2核4G) | $10-20 |
| 推荐 VPS (4核8G) | $20-40 |
| 域名 | $10-15/年 |
| **总计** | **$10-40/月** |

**推荐 VPS 提供商：**
- Vultr、DigitalOcean、Linode (国际)
- 阿里云、腾讯云 (国内)
