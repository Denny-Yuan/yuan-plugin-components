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