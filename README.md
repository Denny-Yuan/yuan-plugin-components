# Yuan Plugin Components

> 浏览器插件通用组件库，为 Yuan 系列插件提供统一的 UI 组件和交互体验

## 🌟 特性

- 🎨 **统一设计** - 一致的视觉风格和交互体验
- 🧩 **模块化** - 可按需引入单个组件
- 📱 **响应式** - 适配不同屏幕尺寸
- 🚀 **轻量级** - 最小化依赖，高性能
- 🔧 **易用性** - 简单的 API 设计
- 🌐 **CDN 支持** - 通过 CDN 快速引入

## 📦 安装使用

### 方式一：CDN 引入（推荐）

```html
<!-- 完整版本 -->
<script src="https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/dist/yuan-components.min.js"></script>

<!-- 或者在 manifest.json 中 -->
{
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": [
      "https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/dist/yuan-components.min.js",
      "your-script.js"
    ]
  }]
}
```

### 方式二：本地文件

1. 下载 `dist/yuan-components.min.js`
2. 放入插件目录
3. 在 HTML 或 manifest.json 中引入

### 方式三：按需引入

```html
<!-- 只引入需要的组件 -->
<script src="https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/dist/components/core.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/dist/components/shortcuts.js"></script>
```

## 🚀 快速开始

### 基础使用

```javascript
// 组件库会自动初始化，直接使用即可

// 创建快捷键组件
const shortcuts = YuanComponents.Shortcuts.create({
    shortcuts: [
        {
            title: '基本操作',
            items: [
                { key: 'Ctrl+F', description: '搜索' },
                { key: 'Ctrl+S', description: '保存' },
                { key: 'Esc', description: '取消' }
            ]
        },
        {
            title: '高级功能',
            items: [
                { key: 'Ctrl+Shift+D', description: '开发者工具' },
                { key: 'F12', description: '调试模式' }
            ]
        }
    ],
    container: '#shortcuts-container', // 按钮容器
    showButton: true, // 是否显示触发按钮
    buttonText: '快捷键', // 按钮文字
    buttonIcon: '⌨️' // 按钮图标
});

// 显示通知
YuanComponents.Toast.success('操作成功！');
YuanComponents.Toast.error('操作失败！');
YuanComponents.Toast.warning('请注意！');
YuanComponents.Toast.info('提示信息');
```

### 在不同插件中使用

#### 书签管理插件

```javascript
// popup.js
class BookmarkManager {
    initShortcuts() {
        const shortcuts = YuanComponents.Shortcuts.create({
            shortcuts: [
                {
                    title: '书签操作',
                    items: [
                        { key: 'Ctrl+D', description: '添加书签' },
                        { key: 'Ctrl+F', description: '搜索书签' },
                        { key: 'Ctrl+E', description: '导出书签' }
                    ]
                }
            ],
            container: '.plugin-info'
        });
    }

    showMessage(text, type = 'info') {
        YuanComponents.Toast[type](text);
    }
}
```

#### 密码管理插件

```javascript
// content.js
class PasswordManager {
    init() {
        // 创建快捷键
        YuanComponents.Shortcuts.create({
            shortcuts: [
                {
                    title: '密码操作',
                    items: [
                        { key: 'Ctrl+Shift+L', description: '自动填充' },
                        { key: 'Ctrl+Shift+G', description: '生成密码' }
                    ]
                }
            ],
            container: 'body',
            position: 'bottom-right'
        });
    }

    onPasswordFilled() {
        YuanComponents.Toast.success('密码已自动填充');
    }
}
```

## 📚 组件文档

### YuanShortcuts - 快捷键组件

#### 创建实例

```javascript
const shortcuts = YuanComponents.Shortcuts.create(options);
```

#### 配置选项

```javascript
{
    shortcuts: [        // 快捷键数据
        {
            title: '分组标题',
            items: [
                { key: '快捷键', description: '功能描述' }
            ]
        }
    ],
    container: null,    // 按钮容器选择器或元素
    showButton: true,   // 是否显示触发按钮
    buttonText: '快捷键', // 按钮文字
    buttonIcon: '⌨️',   // 按钮图标
    position: 'bottom-right', // 按钮位置
    theme: 'default'    // 主题
}
```

#### 方法

```javascript
shortcuts.show();              // 显示面板
shortcuts.hide();              // 隐藏面板
shortcuts.toggle();            // 切换显示
shortcuts.updateShortcuts([]); // 更新快捷键数据
```

### YuanToast - 通知组件

#### 基本用法

```javascript
// 显示不同类型的通知
YuanComponents.Toast.success('成功消息');
YuanComponents.Toast.error('错误消息');
YuanComponents.Toast.warning('警告消息');
YuanComponents.Toast.info('信息消息');

// 自定义配置
YuanComponents.Toast.show('自定义消息', 'info', {
    duration: 5000,     // 显示时长（毫秒）
    closable: true,     // 是否可关闭
    showIcon: true      // 是否显示图标
});
```

#### 方法

```javascript
const toastId = YuanComponents.Toast.show(message, type, options);
YuanComponents.Toast.hide(toastId);  // 隐藏指定通知
YuanComponents.Toast.hideAll();      // 隐藏所有通知
```

### YuanCore - 核心库

#### 工具函数

```javascript
// 生成唯一ID
const id = YuanComponents.utils.generateId('prefix');

// 防抖函数
const debouncedFn = YuanComponents.utils.debounce(fn, 300);

// 节流函数
const throttledFn = YuanComponents.utils.throttle(fn, 100);

// 深度合并对象
const merged = YuanComponents.utils.deepMerge(obj1, obj2);

// 转义HTML
const safe = YuanComponents.utils.escapeHtml(userInput);

// 创建元素
const element = YuanComponents.utils.createElement('div', {
    className: 'my-class',
    innerHTML: '<span>内容</span>'
});
```

## 🎨 主题定制

### CSS 变量

组件使用 CSS 变量，可以轻松定制主题：

```css
:root {
    --yuan-primary: #667eea;        /* 主色调 */
    --yuan-secondary: #764ba2;      /* 次要色 */
    --yuan-success: #28a745;        /* 成功色 */
    --yuan-error: #dc3545;          /* 错误色 */
    --yuan-warning: #ffc107;        /* 警告色 */
    --yuan-info: #17a2b8;           /* 信息色 */
    
    --yuan-bg-primary: #ffffff;     /* 主背景 */
    --yuan-bg-secondary: #f8f9fa;   /* 次背景 */
    
    --yuan-text-primary: #212529;   /* 主文字 */
    --yuan-text-secondary: #495057; /* 次文字 */
    --yuan-text-muted: #6c757d;     /* 弱化文字 */
}
```

### 自定义样式

```css
/* 自定义快捷键按钮 */
.yuan-shortcuts-btn {
    background: linear-gradient(45deg, #ff6b6b, #feca57);
}

/* 自定义通知样式 */
.yuan-toast {
    border-radius: 20px;
    backdrop-filter: blur(10px);
}
```

## 🔧 开发指南

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/Denny-Yuan/yuan-plugin-components.git

# 安装依赖
cd yuan-plugin-components
npm install

# 构建
npm run build

# 开发模式（监听文件变化）
npm run dev
```

### 添加新组件

1. 在 `src/components/` 目录创建新组件文件
2. 继承 YuanCore 的基础功能
3. 注册到组件库：`YuanCore.register('componentName', Component)`
4. 运行构建脚本

### 目录结构

```
yuan-plugin-components/
├── src/
│   ├── core/
│   │   └── yuan-core.js      # 核心库
│   └── components/
│       ├── shortcuts.js      # 快捷键组件
│       └── toast.js          # 通知组件
├── dist/                     # 构建输出
├── cdn/                      # CDN 页面
├── build.js                  # 构建脚本
└── package.json
```

## 📋 版本历史

### v1.0.0
- ✨ 初始版本发布
- 🧩 快捷键组件 (YuanShortcuts)
- 📢 通知组件 (YuanToast)
- 🔧 核心库 (YuanCore)
- 🌐 CDN 支持

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [GitHub 仓库](https://github.com/Denny-Yuan/yuan-plugin-components)
- [CDN 服务](https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/)
- [问题反馈](https://github.com/Denny-Yuan/yuan-plugin-components/issues)
- [作者主页](https://github.com/Denny-Yuan)

## 💬 支持

如果这个项目对你有帮助，请给个 ⭐️ Star！

有问题或建议？欢迎提交 [Issue](https://github.com/Denny-Yuan/yuan-plugin-components/issues)！

---

**Yuan Plugin Components** - 让浏览器插件开发更简单、更统一！ 🚀
