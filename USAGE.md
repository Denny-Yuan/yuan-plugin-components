# Yuan Plugin Components 使用指南

## 🎉 恭喜！组件库已成功部署到GitHub

您的组件库现在可以通过以下CDN链接在所有插件中使用：

## 📦 CDN 链接

### 最新版本（推荐用于开发）
```html
<script src="https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@latest/dist/yuan-components.min.js"></script>
```

### 指定版本（推荐用于生产）
```html
<script src="https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@v1.0.0/dist/yuan-components.min.js"></script>
```

### 单独组件
```html
<!-- 只需要快捷键组件 -->
<script src="https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@v1.0.0/dist/components/core.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@v1.0.0/dist/components/shortcuts.js"></script>
```

## 🚀 在插件中使用

### 方法一：在 manifest.json 中引入

```json
{
  "manifest_version": 3,
  "name": "Your Plugin Name",
  "version": "1.0.0",
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": [
      "https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@v1.0.0/dist/yuan-components.min.js",
      "your-content-script.js"
    ]
  }],
  "action": {
    "default_popup": "popup.html"
  }
}
```

### 方法二：在 HTML 中引入

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Plugin</title>
</head>
<body>
    <!-- 你的插件内容 -->
    
    <!-- 引入组件库 -->
    <script src="https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@v1.0.0/dist/yuan-components.min.js"></script>
    <script src="your-script.js"></script>
</body>
</html>
```

## 💡 使用示例

### 快捷键组件

```javascript
// 等待组件库加载完成
document.addEventListener('DOMContentLoaded', () => {
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
        showButton: true,                  // 显示触发按钮
        buttonText: '快捷键',              // 按钮文字
        buttonIcon: '⌨️'                   // 按钮图标
    });
});
```

### Toast 通知组件

```javascript
// 显示不同类型的通知
YuanComponents.Toast.success('操作成功！');
YuanComponents.Toast.error('操作失败！');
YuanComponents.Toast.warning('请注意！');
YuanComponents.Toast.info('提示信息');

// 自定义配置
YuanComponents.Toast.show('自定义消息', 'info', {
    duration: 5000,     // 显示时长
    closable: true,     // 可手动关闭
    showIcon: true      // 显示图标
});
```

## 🔧 在不同插件中的应用

### 书签管理插件

```javascript
class BookmarkManager {
    init() {
        // 创建快捷键
        this.shortcuts = YuanComponents.Shortcuts.create({
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

    addBookmark() {
        // 添加书签逻辑
        YuanComponents.Toast.success('书签已添加！');
    }

    searchBookmarksError() {
        YuanComponents.Toast.error('搜索失败，请重试');
    }
}
```

### 密码管理插件

```javascript
class PasswordManager {
    init() {
        YuanComponents.Shortcuts.create({
            shortcuts: [
                {
                    title: '密码操作',
                    items: [
                        { key: 'Ctrl+Shift+L', description: '自动填充密码' },
                        { key: 'Ctrl+Shift+G', description: '生成新密码' },
                        { key: 'Ctrl+Shift+S', description: '保存密码' }
                    ]
                }
            ],
            container: 'body'
        });
    }

    autoFill() {
        YuanComponents.Toast.success('密码已自动填充');
    }

    generatePassword() {
        YuanComponents.Toast.info('新密码已生成');
    }
}
```

### 翻译插件

```javascript
class TranslatorPlugin {
    init() {
        YuanComponents.Shortcuts.create({
            shortcuts: [
                {
                    title: '翻译功能',
                    items: [
                        { key: 'Ctrl+Shift+T', description: '翻译选中文本' },
                        { key: 'Ctrl+Shift+R', description: '朗读翻译' },
                        { key: 'Ctrl+Shift+C', description: '复制翻译结果' }
                    ]
                }
            ],
            container: '.translator-controls'
        });
    }

    translateText() {
        YuanComponents.Toast.info('正在翻译...');
        
        // 翻译完成后
        setTimeout(() => {
            YuanComponents.Toast.success('翻译完成！');
        }, 2000);
    }
}
```

## 🎨 主题定制

### 自定义颜色

```css
:root {
    --yuan-primary: #your-primary-color;
    --yuan-secondary: #your-secondary-color;
    --yuan-success: #your-success-color;
    --yuan-error: #your-error-color;
}
```

### 自定义组件样式

```css
/* 自定义快捷键按钮 */
.yuan-shortcuts-btn {
    background: linear-gradient(45deg, #ff6b6b, #feca57);
    border-radius: 20px;
}

/* 自定义通知样式 */
.yuan-toast {
    backdrop-filter: blur(10px);
    border-radius: 15px;
}
```

## 📋 版本管理

### 检查组件库版本

```javascript
console.log('Yuan Components 版本:', YuanComponents.version);

// 版本兼容性检查
if (YuanComponents.version >= '1.0.0') {
    // 使用新功能
} else {
    // 降级处理
}
```

### 更新到新版本

1. 修改CDN链接中的版本号
2. 测试新功能
3. 更新插件代码（如需要）

## 🔍 调试和故障排除

### 检查组件库是否加载

```javascript
if (typeof YuanComponents === 'undefined') {
    console.error('Yuan Components 未加载');
} else {
    console.log('Yuan Components 已加载，版本:', YuanComponents.version);
}
```

### 降级处理

```javascript
function showMessage(text, type = 'info') {
    if (window.YuanComponents && YuanComponents.Toast) {
        YuanComponents.Toast[type](text);
    } else {
        // 降级到原生alert
        alert(`[${type.toUpperCase()}] ${text}`);
    }
}
```

### 网络问题处理

```javascript
function loadYuanComponents() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/Denny-Yuan/yuan-plugin-components@v1.0.0/dist/yuan-components.min.js';
        
        script.onload = () => resolve(window.YuanComponents);
        script.onerror = () => {
            // 尝试备用CDN
            const fallbackScript = document.createElement('script');
            fallbackScript.src = 'https://unpkg.com/yuan-plugin-components@latest/dist/yuan-components.min.js';
            fallbackScript.onload = () => resolve(window.YuanComponents);
            fallbackScript.onerror = reject;
            document.head.appendChild(fallbackScript);
        };
        
        document.head.appendChild(script);
    });
}
```

## 🚀 最佳实践

1. **使用指定版本**：生产环境建议使用具体版本号而不是`@latest`
2. **错误处理**：始终检查组件库是否加载成功
3. **性能优化**：只在需要时创建组件
4. **一致性**：在所有插件中使用相同的快捷键约定
5. **用户体验**：合理使用通知，避免过度打扰用户

## 📞 支持

- **GitHub仓库**: https://github.com/Denny-Yuan/yuan-plugin-components
- **问题反馈**: https://github.com/Denny-Yuan/yuan-plugin-components/issues
- **CDN状态**: https://www.jsdelivr.com/package/gh/Denny-Yuan/yuan-plugin-components

---

🎉 **恭喜！您现在可以在所有插件中使用统一的组件库了！**
