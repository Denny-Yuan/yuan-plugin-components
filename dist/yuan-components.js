/*!
 * Yuan Plugin Components v1.0.0
 * Yuan 浏览器插件通用组件库
 * 
 * Author: Denny Yuan
 * Homepage: https://github.com/Denny-Yuan
 * 
 * Built on: 2025-06-25T08:14:43.450Z
 */

(function(global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        // CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else {
        // Browser globals
        global.YuanComponents = factory();
    }
}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
    'use strict';

/**
 * Yuan 插件组件库核心
 * 提供统一的基础功能和样式系统
 */

class YuanCore {
    static version = '1.0.0';
    static initialized = false;
    static components = new Map();
    static config = {
        theme: 'default',
        language: 'zh-CN',
        debug: false
    };

    // 初始化组件库
    static init(options = {}) {
        if (this.initialized) return;

        // 合并配置
        this.config = { ...this.config, ...options };
        
        // 注入基础样式
        this.injectBaseStyles();
        
        // 设置全局变量
        window.YuanComponents = {
            version: this.version,
            config: this.config,
            register: this.register.bind(this),
            get: this.get.bind(this),
            utils: this.utils
        };

        this.initialized = true;
        this.log('Yuan Components initialized');
    }

    // 注册组件
    static register(name, component) {
        this.components.set(name, component);
        this.log(`Component registered: ${name}`);
    }

    // 获取组件
    static get(name) {
        return this.components.get(name);
    }

    // 日志输出
    static log(message, type = 'info') {
        if (!this.config.debug) return;
        console[type](`[Yuan Components] ${message}`);
    }

    // 注入基础样式
    static injectBaseStyles() {
        if (document.getElementById('yuan-base-styles')) return;

        const style = document.createElement('style');
        style.id = 'yuan-base-styles';
        style.textContent = this.getBaseStyles();
        document.head.appendChild(style);
    }

    // 获取基础样式
    static getBaseStyles() {
        return `
            /* Yuan Components 基础样式 */
            :root {
                --yuan-primary: #667eea;
                --yuan-primary-dark: #5a6fd8;
                --yuan-secondary: #764ba2;
                --yuan-success: #28a745;
                --yuan-warning: #ffc107;
                --yuan-error: #dc3545;
                --yuan-info: #17a2b8;
                
                --yuan-bg-primary: #ffffff;
                --yuan-bg-secondary: #f8f9fa;
                --yuan-bg-tertiary: #e9ecef;
                
                --yuan-text-primary: #212529;
                --yuan-text-secondary: #495057;
                --yuan-text-muted: #6c757d;
                
                --yuan-border: #dee2e6;
                --yuan-border-light: #e9ecef;
                
                --yuan-shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
                --yuan-shadow-md: 0 4px 8px rgba(0,0,0,0.15);
                --yuan-shadow-lg: 0 8px 16px rgba(0,0,0,0.2);
                
                --yuan-radius-sm: 4px;
                --yuan-radius-md: 8px;
                --yuan-radius-lg: 12px;
                
                --yuan-transition: all 0.3s ease;
                --yuan-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Microsoft YaHei', sans-serif;
            }

            .yuan-component {
                font-family: var(--yuan-font-family);
                box-sizing: border-box;
            }

            .yuan-component *,
            .yuan-component *::before,
            .yuan-component *::after {
                box-sizing: inherit;
            }

            /* 通用工具类 */
            .yuan-hidden { display: none !important; }
            .yuan-visible { display: block !important; }
            .yuan-flex { display: flex !important; }
            .yuan-flex-center { display: flex; align-items: center; justify-content: center; }
            .yuan-text-center { text-align: center !important; }
            .yuan-text-left { text-align: left !important; }
            .yuan-text-right { text-align: right !important; }
            
            /* 动画类 */
            .yuan-fade-in {
                animation: yuanFadeIn 0.3s ease-out;
            }
            
            .yuan-slide-up {
                animation: yuanSlideUp 0.3s ease-out;
            }
            
            .yuan-scale-in {
                animation: yuanScaleIn 0.3s ease-out;
            }

            @keyframes yuanFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes yuanSlideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes yuanScaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
    }

    // 工具函数
    static utils = {
        // 生成唯一ID
        generateId: (prefix = 'yuan') => {
            return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        },

        // 防抖函数
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // 节流函数
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // 深度合并对象
        deepMerge: (target, source) => {
            const result = { ...target };
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = YuanCore.utils.deepMerge(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
            return result;
        },

        // 转义HTML
        escapeHtml: (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        // 创建元素
        createElement: (tag, options = {}) => {
            const element = document.createElement(tag);
            
            if (options.className) {
                element.className = options.className;
            }
            
            if (options.id) {
                element.id = options.id;
            }
            
            if (options.innerHTML) {
                element.innerHTML = options.innerHTML;
            }
            
            if (options.textContent) {
                element.textContent = options.textContent;
            }
            
            if (options.attributes) {
                Object.entries(options.attributes).forEach(([key, value]) => {
                    element.setAttribute(key, value);
                });
            }
            
            if (options.styles) {
                Object.assign(element.style, options.styles);
            }
            
            return element;
        }
    };
}

// 自动初始化
if (typeof window !== 'undefined') {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => YuanCore.init());
    } else {
        YuanCore.init();
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YuanCore;
} else {
    window.YuanCore = YuanCore;
}


/**
 * Yuan 快捷键组件
 * 提供统一的快捷键面板和按钮
 */

class YuanShortcuts {
    constructor(options = {}) {
        this.options = YuanCore.utils.deepMerge({
            shortcuts: [],
            container: null,
            showButton: true,
            buttonText: '快捷键',
            buttonIcon: '⌨️',
            position: 'bottom-right',
            theme: 'default'
        }, options);

        this.panelId = YuanCore.utils.generateId('shortcuts-panel');
        this.buttonId = YuanCore.utils.generateId('shortcuts-button');
        this.isVisible = false;

        this.init();
    }

    init() {
        this.injectStyles();
        if (this.options.showButton) {
            this.createButton();
        }
        this.createPanel();
        this.bindEvents();
    }

    // 创建快捷键按钮
    createButton() {
        const container = this.getContainer();
        if (!container) return;

        const button = YuanCore.utils.createElement('div', {
            className: 'yuan-shortcuts-trigger',
            innerHTML: `
                <button id="${this.buttonId}" class="yuan-shortcuts-btn" title="查看快捷键 (Ctrl+?)">
                    <span class="yuan-shortcuts-icon">${this.options.buttonIcon}</span>
                    <span class="yuan-shortcuts-text">${this.options.buttonText}</span>
                </button>
            `
        });

        container.appendChild(button);
    }

    // 创建快捷键面板
    createPanel() {
        if (document.getElementById(this.panelId)) return;

        const panel = YuanCore.utils.createElement('div', {
            id: this.panelId,
            className: 'yuan-shortcuts-panel yuan-component yuan-hidden',
            innerHTML: this.generatePanelHTML()
        });

        document.body.appendChild(panel);
    }

    // 生成面板HTML
    generatePanelHTML() {
        const groupsHTML = this.options.shortcuts.map(group => `
            <div class="yuan-shortcut-group">
                <h4>${YuanCore.utils.escapeHtml(group.title)}</h4>
                ${group.items.map(item => `
                    <div class="yuan-shortcut-item">
                        <span class="yuan-shortcut-key">${YuanCore.utils.escapeHtml(item.key)}</span>
                        <span class="yuan-shortcut-desc">${YuanCore.utils.escapeHtml(item.description)}</span>
                    </div>
                `).join('')}
            </div>
        `).join('');

        return `
            <div class="yuan-shortcuts-overlay">
                <div class="yuan-shortcuts-content yuan-scale-in">
                    <div class="yuan-shortcuts-header">
                        <h3>快捷键指南</h3>
                        <button class="yuan-close-btn" aria-label="关闭">✕</button>
                    </div>
                    <div class="yuan-shortcuts-body">
                        ${groupsHTML}
                    </div>
                    <div class="yuan-shortcuts-footer">
                        <p>按 ESC 键关闭此面板</p>
                    </div>
                </div>
            </div>
        `;
    }

    // 获取容器
    getContainer() {
        if (!this.options.container) return document.body;
        
        if (typeof this.options.container === 'string') {
            return document.querySelector(this.options.container);
        }
        
        return this.options.container;
    }

    // 绑定事件
    bindEvents() {
        // 按钮点击事件
        document.addEventListener('click', (e) => {
            if (e.target.closest(`#${this.buttonId}`)) {
                this.show();
            }
            
            if (e.target.classList.contains('yuan-close-btn')) {
                this.hide();
            }
            
            if (e.target.classList.contains('yuan-shortcuts-overlay')) {
                this.hide();
            }
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '?') {
                e.preventDefault();
                this.toggle();
            }
            
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    // 显示面板
    show() {
        const panel = document.getElementById(this.panelId);
        if (panel) {
            panel.classList.remove('yuan-hidden');
            panel.classList.add('yuan-fade-in');
            this.isVisible = true;
        }
    }

    // 隐藏面板
    hide() {
        const panel = document.getElementById(this.panelId);
        if (panel) {
            panel.classList.add('yuan-hidden');
            panel.classList.remove('yuan-fade-in');
            this.isVisible = false;
        }
    }

    // 切换显示
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    // 更新快捷键
    updateShortcuts(shortcuts) {
        this.options.shortcuts = shortcuts;
        const panel = document.getElementById(this.panelId);
        if (panel) {
            panel.innerHTML = this.generatePanelHTML();
        }
    }

    // 注入样式
    injectStyles() {
        if (document.getElementById('yuan-shortcuts-styles')) return;

        const style = document.createElement('style');
        style.id = 'yuan-shortcuts-styles';
        style.textContent = `
            .yuan-shortcuts-trigger {
                display: inline-block;
                margin: 8px 0;
            }

            .yuan-shortcuts-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 12px;
                background: linear-gradient(135deg, var(--yuan-primary) 0%, var(--yuan-secondary) 100%);
                color: white;
                border: none;
                border-radius: var(--yuan-radius-md);
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: var(--yuan-transition);
                box-shadow: var(--yuan-shadow-sm);
                font-family: var(--yuan-font-family);
            }

            .yuan-shortcuts-btn:hover {
                background: linear-gradient(135deg, var(--yuan-primary-dark) 0%, var(--yuan-secondary) 100%);
                transform: translateY(-1px);
                box-shadow: var(--yuan-shadow-md);
            }

            .yuan-shortcuts-panel {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                transition: var(--yuan-transition);
            }

            .yuan-shortcuts-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .yuan-shortcuts-content {
                background: var(--yuan-bg-primary);
                border-radius: var(--yuan-radius-lg);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: var(--yuan-shadow-lg);
            }

            .yuan-shortcuts-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 2px solid var(--yuan-border-light);
                background: linear-gradient(135deg, var(--yuan-primary) 0%, var(--yuan-secondary) 100%);
                color: white;
            }

            .yuan-shortcuts-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }

            .yuan-close-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 16px;
                color: white;
                transition: var(--yuan-transition);
            }

            .yuan-close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }

            .yuan-shortcuts-body {
                padding: 24px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .yuan-shortcut-group {
                margin-bottom: 24px;
            }

            .yuan-shortcut-group:last-child {
                margin-bottom: 0;
            }

            .yuan-shortcut-group h4 {
                font-size: 14px;
                color: var(--yuan-primary);
                margin: 0 0 12px 0;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .yuan-shortcut-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid var(--yuan-border-light);
            }

            .yuan-shortcut-item:last-child {
                border-bottom: none;
            }

            .yuan-shortcut-key {
                background: linear-gradient(135deg, var(--yuan-primary) 0%, var(--yuan-secondary) 100%);
                color: white;
                padding: 4px 8px;
                border-radius: var(--yuan-radius-sm);
                font-family: 'Courier New', monospace;
                font-size: 11px;
                font-weight: 600;
                min-width: 60px;
                text-align: center;
                box-shadow: var(--yuan-shadow-sm);
            }

            .yuan-shortcut-desc {
                font-size: 13px;
                color: var(--yuan-text-secondary);
                flex: 1;
                margin-left: 12px;
            }

            .yuan-shortcuts-footer {
                padding: 16px 24px;
                background: var(--yuan-bg-secondary);
                border-top: 1px solid var(--yuan-border);
                text-align: center;
            }

            .yuan-shortcuts-footer p {
                margin: 0;
                font-size: 12px;
                color: var(--yuan-text-muted);
            }
        `;

        document.head.appendChild(style);
    }

    // 静态创建方法
    static create(options) {
        return new YuanShortcuts(options);
    }
}

// 注册到组件库
if (typeof YuanCore !== 'undefined') {
    YuanCore.register('shortcuts', YuanShortcuts);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YuanShortcuts;
} else {
    window.YuanShortcuts = YuanShortcuts;
}


/**
 * Yuan Toast 通知组件
 * 提供统一的消息提示功能
 */

class YuanToast {
    static container = null;
    static toasts = new Map();
    static initialized = false;

    static init() {
        if (this.initialized) return;

        this.createContainer();
        this.injectStyles();
        this.initialized = true;
    }

    static createContainer() {
        if (this.container) return;

        this.container = YuanCore.utils.createElement('div', {
            id: 'yuan-toast-container',
            className: 'yuan-toast-container yuan-component'
        });

        document.body.appendChild(this.container);
    }

    static show(message, type = 'info', options = {}) {
        this.init();

        const config = YuanCore.utils.deepMerge({
            duration: 3000,
            closable: true,
            position: 'top-right',
            showIcon: true
        }, options);

        const toastId = YuanCore.utils.generateId('toast');
        const toast = this.createToast(toastId, message, type, config);
        
        this.container.appendChild(toast);
        this.toasts.set(toastId, { element: toast, config });

        // 触发显示动画
        setTimeout(() => {
            toast.classList.add('yuan-toast-show');
        }, 10);

        // 自动关闭
        if (config.duration > 0) {
            setTimeout(() => {
                this.hide(toastId);
            }, config.duration);
        }

        return toastId;
    }

    static createToast(id, message, type, config) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const toast = YuanCore.utils.createElement('div', {
            id: id,
            className: `yuan-toast yuan-toast-${type}`,
            innerHTML: `
                ${config.showIcon ? `<span class="yuan-toast-icon">${icons[type] || icons.info}</span>` : ''}
                <span class="yuan-toast-message">${YuanCore.utils.escapeHtml(message)}</span>
                ${config.closable ? '<button class="yuan-toast-close" aria-label="关闭">✕</button>' : ''}
            `
        });

        // 绑定关闭事件
        if (config.closable) {
            const closeBtn = toast.querySelector('.yuan-toast-close');
            closeBtn.addEventListener('click', () => {
                this.hide(id);
            });
        }

        return toast;
    }

    static hide(toastId) {
        const toastData = this.toasts.get(toastId);
        if (!toastData) return;

        const { element } = toastData;
        element.classList.add('yuan-toast-hide');

        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.toasts.delete(toastId);
        }, 300);
    }

    static hideAll() {
        this.toasts.forEach((_, toastId) => {
            this.hide(toastId);
        });
    }

    // 便捷方法
    static success(message, options) {
        return this.show(message, 'success', options);
    }

    static error(message, options) {
        return this.show(message, 'error', options);
    }

    static warning(message, options) {
        return this.show(message, 'warning', options);
    }

    static info(message, options) {
        return this.show(message, 'info', options);
    }

    static injectStyles() {
        if (document.getElementById('yuan-toast-styles')) return;

        const style = document.createElement('style');
        style.id = 'yuan-toast-styles';
        style.textContent = `
            .yuan-toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                pointer-events: none;
            }

            .yuan-toast {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                margin-bottom: 8px;
                background: var(--yuan-bg-primary);
                border-radius: var(--yuan-radius-md);
                box-shadow: var(--yuan-shadow-lg);
                border-left: 4px solid var(--yuan-primary);
                min-width: 300px;
                max-width: 400px;
                pointer-events: auto;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                font-family: var(--yuan-font-family);
            }

            .yuan-toast-show {
                transform: translateX(0);
                opacity: 1;
            }

            .yuan-toast-hide {
                transform: translateX(100%);
                opacity: 0;
            }

            .yuan-toast-success {
                border-left-color: var(--yuan-success);
            }

            .yuan-toast-error {
                border-left-color: var(--yuan-error);
            }

            .yuan-toast-warning {
                border-left-color: var(--yuan-warning);
            }

            .yuan-toast-info {
                border-left-color: var(--yuan-info);
            }

            .yuan-toast-icon {
                font-size: 16px;
                flex-shrink: 0;
            }

            .yuan-toast-message {
                flex: 1;
                font-size: 14px;
                color: var(--yuan-text-primary);
                line-height: 1.4;
            }

            .yuan-toast-close {
                background: none;
                border: none;
                font-size: 14px;
                color: var(--yuan-text-muted);
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: var(--yuan-transition);
                flex-shrink: 0;
            }

            .yuan-toast-close:hover {
                background: var(--yuan-bg-tertiary);
                color: var(--yuan-text-primary);
            }

            /* 响应式 */
            @media (max-width: 480px) {
                .yuan-toast-container {
                    left: 10px;
                    right: 10px;
                    top: 10px;
                }

                .yuan-toast {
                    min-width: auto;
                    max-width: none;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// 注册到组件库
if (typeof YuanCore !== 'undefined') {
    YuanCore.register('toast', YuanToast);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YuanToast;
} else {
    window.YuanToast = YuanToast;
}


    // 返回组件库对象
    return {
        version: YuanCore.version,
        Core: YuanCore,
        Shortcuts: typeof YuanShortcuts !== 'undefined' ? YuanShortcuts : null,
        Toast: typeof YuanToast !== 'undefined' ? YuanToast : null,
        init: YuanCore.init.bind(YuanCore),
        register: YuanCore.register.bind(YuanCore),
        get: YuanCore.get.bind(YuanCore),
        utils: YuanCore.utils
    };
}));