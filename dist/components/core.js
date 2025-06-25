/*!
 * Yuan Plugin Components v1.0.0
 * Yuan 浏览器插件通用组件库
 * 
 * Author: Denny Yuan
 * Homepage: https://github.com/Denny-Yuan
 * 
 * Built on: 2025-06-25T08:14:43.454Z
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