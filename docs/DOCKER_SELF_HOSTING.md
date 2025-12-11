# Docker 自托管完整部署指南

本指南详细说明如何在自己的服务器上完全自托管部署 VapeFinder 平台。

> 📌 本指南同时支持 **Linux (Ubuntu)** 和 **Windows** 环境

## 系统要求

| 组件 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | 2核 | 4核 |
| 内存 | 4GB | 8GB |
| 硬盘 | 40GB SSD | 100GB SSD |
| 系统 | Ubuntu 22.04 LTS / Windows 10+ | Ubuntu 22.04 LTS / Windows 11 |

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

---

## 第一部分：安装 Docker

### 🐧 Linux (Ubuntu)

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

### 🪟 Windows

1. 下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
2. 安装时勾选 "Use WSL 2 instead of Hyper-V"
3. 安装完成后重启电脑
4. 验证安装：
```powershell
docker --version
docker compose version
```

---

## 第二部分：安装 Node.js

### 🐧 Linux

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

### 🪟 Windows

1. 下载并安装 [Node.js LTS](https://nodejs.org/) (推荐 v20)
2. 或使用 nvm-windows：
```powershell
# 使用 winget 安装 nvm-windows
winget install CoreyButler.NVMforWindows

# 重启终端后安装 Node.js
nvm install 20
nvm use 20

# 验证安装
node --version
npm --version
```

---

## 第三部分：安装 Git

### 🐧 Linux

```bash
sudo apt install -y git
git --version
```

### 🪟 Windows

1. 下载并安装 [Git for Windows](https://git-scm.com/download/win)
2. 安装时选择默认选项
3. 验证：
```powershell
git --version
```

---

## 第四部分：部署 Supabase 自托管

> ⚠️ **重要说明**: Supabase Docker 是从 **Supabase 官方 GitHub 仓库** 克隆的，不是项目中的 `supabase/` 配置文件夹。项目中的 `supabase/` 文件夹只包含 Lovable Cloud 的配置文件（config.toml），没有 docker 目录。

### 4.1 克隆 Supabase Docker 配置

#### 🐧 Linux

```bash
# 创建项目目录
mkdir -p /opt/vapefinder
cd /opt/vapefinder

# 克隆 Supabase 官方仓库（包含 docker 目录）
git clone --depth 1 https://github.com/supabase/supabase supabase-docker
cd supabase-docker/docker

# 复制环境配置
cp .env.example .env
```

#### 🪟 Windows (PowerShell 管理员模式)

```powershell
# 创建项目目录
New-Item -ItemType Directory -Force -Path C:\vapefinder
Set-Location C:\vapefinder

# 克隆 Supabase 官方仓库（包含 docker 目录）
git clone --depth 1 https://github.com/supabase/supabase supabase-docker
Set-Location supabase-docker\docker

# 复制环境配置
Copy-Item .env.example .env
```

> 📁 **目录结构说明**:
> ```
> C:\vapefinder\
> ├── supabase-docker\    ← 从 GitHub 克隆的 Supabase 官方仓库
> │   └── docker\         ← Docker 配置文件在这里
> │       ├── .env
> │       └── docker-compose.yml
> └── frontend\           ← 你的 VapeFinder 前端项目
>     └── supabase\       ← Lovable 配置（不是 Docker！）
>         └── config.toml
> ```

### 4.2 配置 Supabase 环境变量

#### 🐧 Linux

```bash
nano .env
```

#### 🪟 Windows

```powershell
# 使用记事本编辑
notepad .env

# 或使用 VS Code
code .env
```

**重要配置项：**

```env
############
# Secrets - 必须修改！
############

# 生成安全密钥 (见下方生成方法)
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

### 4.3 生成 JWT 密钥

#### 🐧 Linux

```bash
# 生成 JWT Secret
openssl rand -base64 32
```

#### 🪟 Windows (PowerShell)

```powershell
# 方法1: 使用 PowerShell 生成随机字符串
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])

# 方法2: 如果安装了 Git Bash，可以使用 openssl
# 打开 Git Bash 运行:
openssl rand -base64 32
```

**生成 ANON_KEY 和 SERVICE_ROLE_KEY：**

访问 https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys

或使用 https://jwt.io 手动生成：

**ANON_KEY Payload:**
```json
{
  "role": "anon",
  "iss": "supabase",
  "iat": 1704067200,
  "exp": 1861920000
}
```

**SERVICE_ROLE_KEY Payload:**
```json
{
  "role": "service_role",
  "iss": "supabase",
  "iat": 1704067200,
  "exp": 1861920000
}
```

使用你的 `JWT_SECRET` 作为签名密钥，算法选择 `HS256`。

### 4.4 启动 Supabase

#### 🐧 Linux

```bash
cd /opt/vapefinder/supabase-docker/docker

# 拉取镜像
docker compose pull

# 启动所有服务
docker compose up -d

# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f
```

#### 🪟 Windows (PowerShell)

```powershell
Set-Location C:\vapefinder\supabase-docker\docker

# 拉取镜像
docker compose pull

# 启动所有服务
docker compose up -d

# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f
```

### 4.5 初始化数据库

#### 🐧 Linux

```bash
# 进入 PostgreSQL 容器
docker compose exec db psql -U postgres

# 在 psql 中执行建表 SQL
\i /path/to/docs/database_schema.sql
```

#### 🪟 Windows

```powershell
# 进入 PostgreSQL 容器
docker compose exec db psql -U postgres

# 在 psql 中，复制 database_schema.sql 内容粘贴执行
# 或者先将文件复制到容器中：
docker cp C:\vapefinder\frontend\docs\database_schema.sql supabase-db-1:/tmp/
docker compose exec db psql -U postgres -f /tmp/database_schema.sql
```

---

## 第五部分：部署前端应用

### 5.1 克隆项目

#### 🐧 Linux

```bash
cd /opt/vapefinder

# 公开仓库
git clone https://github.com/your-username/vapefinder-app.git frontend

# 私有仓库 (使用 Personal Access Token)
git clone https://<用户名>:<PAT令牌>@github.com/<用户名>/<仓库名>.git frontend

cd frontend
```

#### 🪟 Windows (PowerShell)

```powershell
Set-Location C:\vapefinder

# 公开仓库
git clone https://github.com/your-username/vapefinder-app.git frontend

# 私有仓库方法1: 使用 Personal Access Token
git clone https://<用户名>:<PAT令牌>@github.com/<用户名>/<仓库名>.git frontend

# 私有仓库方法2: Windows Credential Manager 自动弹窗
git clone https://github.com/<用户名>/<仓库名>.git frontend

Set-Location frontend
```

**获取 GitHub Personal Access Token (PAT)：**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → 勾选 `repo` 权限
3. 复制生成的 token

### 5.2 安装依赖并构建

#### 🐧 Linux

```bash
cd /opt/vapefinder/frontend

# 安装依赖
npm install

# 创建环境变量文件
cat > .env.production << EOF
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=self-hosted
EOF

# 构建生产版本
npm run build
```

#### 🪟 Windows (PowerShell)

```powershell
Set-Location C:\vapefinder\frontend

# 安装依赖
npm install

# 创建环境变量文件
@"
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=self-hosted
"@ | Out-File -FilePath .env.production -Encoding UTF8

# 构建生产版本
npm run build
```

### 5.3 创建前端 Docker 镜像

创建 `Dockerfile`：

#### 🐧 Linux

```bash
cat > Dockerfile << 'EOF'
FROM nginx:alpine

# 复制构建产物
COPY dist/ /usr/share/nginx/html/

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF
```

#### 🪟 Windows (PowerShell)

```powershell
@"
FROM nginx:alpine

# 复制构建产物
COPY dist/ /usr/share/nginx/html/

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
"@ | Out-File -FilePath Dockerfile -Encoding UTF8 -NoNewline
```

创建 `nginx.conf`：

#### 🐧 Linux

```bash
cat > nginx.conf << 'EOF'
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
EOF
```

#### 🪟 Windows (PowerShell)

```powershell
@"
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
        try_files `$uri `$uri/ /index.html;
    }

    # 健康检查
    location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
"@ | Out-File -FilePath nginx.conf -Encoding UTF8 -NoNewline
```

### 5.4 构建并运行

#### 🐧 Linux

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

#### 🪟 Windows (PowerShell)

```powershell
Set-Location C:\vapefinder\frontend

# 构建镜像
docker build -t vapefinder-frontend:latest .

# 运行容器
docker run -d `
  --name vapefinder-frontend `
  --restart unless-stopped `
  -p 3000:80 `
  vapefinder-frontend:latest
```

---

## 第六部分：访问应用

部署完成后：

| 服务 | 地址 |
|------|------|
| 前端应用 | http://localhost:3000 |
| Supabase API | http://localhost:8000 |
| Supabase Studio | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

---

## 第七部分：配置 Nginx 反向代理 (Linux 生产环境)

> ⚠️ 以下内容仅适用于 Linux 生产服务器部署

### 7.1 安装 Nginx 和 Certbot

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 7.2 创建 Nginx 配置

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

### 7.3 启用站点并获取 SSL 证书

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

---

## 第八部分：维护与监控

### 8.1 常用命令

#### 🐧 Linux

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

#### 🪟 Windows (PowerShell)

```powershell
# 查看所有容器状态
docker ps -a

# 查看日志
docker logs -f vapefinder-frontend
Set-Location C:\vapefinder\supabase\docker
docker compose logs -f

# 重启服务
docker restart vapefinder-frontend
docker compose restart

# 更新前端
Set-Location C:\vapefinder\frontend
git pull
npm install
npm run build
docker build -t vapefinder-frontend:latest .
docker stop vapefinder-frontend
docker rm vapefinder-frontend
docker run -d --name vapefinder-frontend --restart unless-stopped -p 3000:80 vapefinder-frontend:latest
```

### 8.2 数据库备份

#### 🐧 Linux

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

#### 🪟 Windows (PowerShell)

```powershell
# 创建备份目录
New-Item -ItemType Directory -Force -Path C:\vapefinder\backups

# 手动备份命令
$date = Get-Date -Format "yyyyMMdd_HHmmss"
Set-Location C:\vapefinder\supabase\docker
docker compose exec -T db pg_dump -U postgres postgres | Out-File -FilePath "C:\vapefinder\backups\db_$date.sql" -Encoding UTF8

# 创建定时任务 (使用 Task Scheduler)
# 1. 打开 Task Scheduler (任务计划程序)
# 2. 创建基本任务 → 每日触发
# 3. 操作: 启动程序 → powershell.exe
# 4. 参数: -File "C:\vapefinder\backup.ps1"
```

创建备份脚本 `C:\vapefinder\backup.ps1`:

```powershell
$date = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "C:\vapefinder\backups"

# 确保目录存在
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

# 备份数据库
Set-Location C:\vapefinder\supabase\docker
docker compose exec -T db pg_dump -U postgres postgres | Out-File -FilePath "$backupDir\db_$date.sql" -Encoding UTF8

# 压缩 (需要安装 7-Zip 或使用 Compress-Archive)
Compress-Archive -Path "$backupDir\db_$date.sql" -DestinationPath "$backupDir\db_$date.zip"
Remove-Item "$backupDir\db_$date.sql"

# 删除7天前的备份
Get-ChildItem $backupDir -Filter "*.zip" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item

Write-Host "Backup completed: db_$date.zip"
```

---

## 第九部分：故障排查

### 常见问题

| 问题 | 排查命令 | 解决方案 |
|------|---------|---------|
| 容器无法启动 | `docker logs <container>` | 检查环境变量和端口占用 |
| 数据库连接失败 | `docker compose exec db psql -U postgres` | 检查 POSTGRES_PASSWORD |
| API 401 错误 | 检查 ANON_KEY | 重新生成 JWT 密钥 |
| SSL 证书过期 | `sudo certbot renew` | 检查定时任务 |
| 磁盘空间不足 | `docker system prune -a` | 清理无用镜像 |

### 查看服务状态

#### 🐧 Linux

```bash
# 检查所有服务
docker compose -f /opt/vapefinder/supabase/docker/docker-compose.yml ps

# 检查端口占用
sudo netstat -tlnp | grep -E '3000|8000|5432'

# 检查 Nginx 状态
sudo systemctl status nginx
```

#### 🪟 Windows (PowerShell)

```powershell
# 检查所有服务
Set-Location C:\vapefinder\supabase\docker
docker compose ps

# 检查端口占用
netstat -ano | findstr ":3000 :8000 :5432"

# 或使用 PowerShell
Get-NetTCPConnection | Where-Object {$_.LocalPort -in 3000,8000,5432}
```

---

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
