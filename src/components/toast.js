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
