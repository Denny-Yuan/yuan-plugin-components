# Yuan Plugin Components 部署指南

## 🚀 部署方案

### 方案一：GitHub + jsDelivr CDN（推荐）

这是最简单且免费的部署方案：

#### 1. 创建 GitHub 仓库
```bash
# 创建新仓库
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Denny-Yuan/yuan-plugin-components.git
git push -u origin main
```

#### 2. 自动 CDN 链接
一旦推送到 GitHub，jsDelivr 会自动提供 CDN 服务：

```html
<!-- 最新版本 -->
<script src="https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/dist/yuan-components.min.js"></script>

<!-- 指定版本 -->
<script src="https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@v1.0.0/dist/yuan-components.min.js"></script>

<!-- 指定分支 -->
<script src="https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@main/dist/yuan-components.min.js"></script>
```

#### 3. 版本发布
```bash
# 构建
npm run build

# 创建版本标签
git tag v1.0.0
git push origin v1.0.0

# 或使用 npm 自动版本管理
npm run release
```

### 方案二：自建 CDN 服务器

#### 1. 服务器配置
```nginx
# nginx.conf
server {
    listen 80;
    server_name cdn.your-domain.com;
    
    location / {
        root /var/www/yuan-components;
        add_header Access-Control-Allow-Origin *;
        add_header Cache-Control "public, max-age=31536000";
        
        # 启用 gzip 压缩
        gzip on;
        gzip_types text/javascript application/javascript;
    }
}
```

#### 2. 自动部署脚本
```bash
#!/bin/bash
# deploy.sh

# 构建
npm run build

# 上传到服务器
rsync -avz --delete dist/ user@your-server:/var/www/yuan-components/

# 重启 nginx
ssh user@your-server "sudo systemctl reload nginx"

echo "部署完成！"
```

### 方案三：NPM 包发布

#### 1. 发布到 NPM
```bash
# 登录 NPM
npm login

# 发布
npm publish

# 更新版本
npm version patch
npm publish
```

#### 2. 通过 unpkg 使用
```html
<script src="https://unpkg.com/yuan-plugin-components@latest/dist/yuan-components.min.js"></script>
```

## 📦 在插件中使用

### 方法一：Manifest V3 (推荐)

```json
{
  "manifest_version": 3,
  "name": "Your Plugin",
  "version": "1.0.0",
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": [
      "https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/dist/yuan-components.min.js",
      "content.js"
    ]
  }],
  "action": {
    "default_popup": "popup.html"
  }
}
```

### 方法二：动态加载

```javascript
// background.js 或 content.js
function loadYuanComponents() {
    return new Promise((resolve, reject) => {
        if (window.YuanComponents) {
            resolve(window.YuanComponents);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/dist/yuan-components.min.js';
        script.onload = () => resolve(window.YuanComponents);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 使用
loadYuanComponents().then(YuanComponents => {
    // 创建组件
    const shortcuts = YuanComponents.Shortcuts.create({
        shortcuts: [/* ... */],
        container: 'body'
    });
});
```

### 方法三：本地文件

```bash
# 下载文件到插件目录
curl -o yuan-components.min.js https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/dist/yuan-components.min.js
```

```json
{
  "content_scripts": [{
    "js": [
      "yuan-components.min.js",
      "your-script.js"
    ]
  }]
}
```

## 🔄 版本管理策略

### 语义化版本控制

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 版本发布流程

```bash
# 1. 开发完成后构建
npm run build

# 2. 测试
npm test

# 3. 更新版本号
npm version patch  # 修复版本
npm version minor  # 功能版本
npm version major  # 重大版本

# 4. 推送标签
git push origin --tags

# 5. 创建 GitHub Release
# 在 GitHub 上创建 Release，触发 CDN 更新
```

### 版本兼容性

```javascript
// 检查版本兼容性
if (YuanComponents.version >= '1.0.0') {
    // 使用新功能
} else {
    // 降级处理
}
```

## 🌐 多插件共享策略

### 1. 统一版本管理

所有插件使用相同的组件库版本：

```javascript
// config.js - 所有插件共享的配置
const YUAN_COMPONENTS_VERSION = 'v1.0.0';
const YUAN_COMPONENTS_URL = `https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@${YUAN_COMPONENTS_VERSION}/dist/yuan-components.min.js`;
```

### 2. 缓存策略

```javascript
// 检查是否已加载
if (!window.YuanComponents) {
    // 加载组件库
    const script = document.createElement('script');
    script.src = YUAN_COMPONENTS_URL;
    document.head.appendChild(script);
}
```

### 3. 插件间通信

```javascript
// 插件 A
YuanComponents.Core.register('pluginA', {
    data: 'some data',
    method: () => console.log('Plugin A method')
});

// 插件 B
const pluginA = YuanComponents.Core.get('pluginA');
pluginA.method(); // 调用插件 A 的方法
```

## 📊 性能优化

### 1. 文件大小优化

```bash
# 构建时启用压缩
npm run build

# 检查文件大小
ls -lh dist/
```

### 2. 加载优化

```javascript
// 预加载关键组件
const link = document.createElement('link');
link.rel = 'preload';
link.href = 'https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/dist/yuan-components.min.js';
link.as = 'script';
document.head.appendChild(link);
```

### 3. 缓存策略

```javascript
// 设置长期缓存
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@v1.0.0/dist/yuan-components.min.js';
script.crossOrigin = 'anonymous';
script.integrity = 'sha384-...'; // 添加完整性检查
```

## 🔧 开发环境配置

### 本地开发服务器

```javascript
// dev-server.js
const express = require('express');
const app = express();

app.use(express.static('dist'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.listen(3000, () => {
    console.log('Dev server running on http://localhost:3000');
});
```

### 热重载开发

```bash
# 监听文件变化并自动构建
npm run dev

# 在插件中使用本地版本
# http://localhost:3000/yuan-components.js
```

## 📋 部署检查清单

- [ ] 代码构建成功
- [ ] 所有测试通过
- [ ] 版本号已更新
- [ ] GitHub 标签已创建
- [ ] CDN 链接可访问
- [ ] 文件完整性检查
- [ ] 向下兼容性测试
- [ ] 文档已更新
- [ ] 示例代码已验证

## 🚨 故障排除

### CDN 访问问题

```javascript
// 降级方案
function loadWithFallback() {
    const cdnUrl = 'https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/dist/yuan-components.min.js';
    const fallbackUrl = 'https://unpkg.com/yuan-plugin-components@latest/dist/yuan-components.min.js';
    
    return fetch(cdnUrl)
        .then(response => {
            if (!response.ok) throw new Error('CDN failed');
            return cdnUrl;
        })
        .catch(() => fallbackUrl);
}
```

### 版本冲突

```javascript
// 版本检查
if (window.YuanComponents) {
    const currentVersion = window.YuanComponents.version;
    const requiredVersion = '1.0.0';
    
    if (currentVersion < requiredVersion) {
        console.warn(`Yuan Components version ${currentVersion} is outdated. Required: ${requiredVersion}`);
    }
}
```

---

通过以上部署方案，您可以轻松地让所有插件共享同一套组件库，实现真正的代码复用和统一体验！
