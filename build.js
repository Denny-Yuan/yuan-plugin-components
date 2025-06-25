const fs = require('fs-extra');
const path = require('path');

class ComponentBuilder {
    constructor() {
        this.srcDir = path.join(__dirname, 'src');
        this.distDir = path.join(__dirname, 'dist');
        this.components = [];
    }

    async build() {
        console.log('🚀 开始构建 Yuan Components...');
        
        // 清理输出目录
        await fs.emptyDir(this.distDir);
        
        // 读取所有组件
        await this.loadComponents();
        
        // 构建合并文件
        await this.buildCombined();
        
        // 构建单独文件
        await this.buildSeparate();
        
        // 复制资源文件
        await this.copyAssets();
        
        console.log('✅ 构建完成！');
    }

    async loadComponents() {
        const coreFile = path.join(this.srcDir, 'core/yuan-core.js');
        const componentsDir = path.join(this.srcDir, 'components');
        
        // 读取核心文件
        const coreContent = await fs.readFile(coreFile, 'utf8');
        this.components.push({
            name: 'core',
            content: coreContent
        });
        
        // 读取组件文件
        const componentFiles = await fs.readdir(componentsDir);
        for (const file of componentFiles) {
            if (file.endsWith('.js')) {
                const filePath = path.join(componentsDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                const name = path.basename(file, '.js');
                
                this.components.push({
                    name,
                    content
                });
            }
        }
        
        console.log(`📦 加载了 ${this.components.length} 个组件`);
    }

    async buildCombined() {
        const header = this.generateHeader();
        const combinedContent = this.components.map(comp => comp.content).join('\n\n');
        const footer = this.generateFooter();
        
        const fullContent = `${header}\n${combinedContent}\n${footer}`;
        
        // 写入完整版本
        await fs.writeFile(
            path.join(this.distDir, 'yuan-components.js'),
            fullContent
        );
        
        // 写入压缩版本（简单压缩）
        const minified = this.minify(fullContent);
        await fs.writeFile(
            path.join(this.distDir, 'yuan-components.min.js'),
            minified
        );
        
        console.log('📄 生成合并文件: yuan-components.js');
    }

    async buildSeparate() {
        const separateDir = path.join(this.distDir, 'components');
        await fs.ensureDir(separateDir);
        
        for (const component of this.components) {
            const content = `${this.generateHeader()}\n${component.content}\n${this.generateFooter()}`;
            await fs.writeFile(
                path.join(separateDir, `${component.name}.js`),
                content
            );
        }
        
        console.log('📁 生成单独组件文件');
    }

    async copyAssets() {
        // 复制 package.json
        const packageJson = await fs.readJson(path.join(__dirname, 'package.json'));
        await fs.writeJson(path.join(this.distDir, 'package.json'), packageJson, { spaces: 2 });
        
        // 复制 README
        if (await fs.pathExists(path.join(__dirname, 'README.md'))) {
            await fs.copy(
                path.join(__dirname, 'README.md'),
                path.join(this.distDir, 'README.md')
            );
        }
        
        console.log('📋 复制资源文件');
    }

    generateHeader() {
        const packageJson = require('./package.json');
        return `/*!
 * Yuan Plugin Components v${packageJson.version}
 * ${packageJson.description}
 * 
 * Author: ${packageJson.author}
 * Homepage: ${packageJson.homepage}
 * 
 * Built on: ${new Date().toISOString()}
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
`;
    }

    generateFooter() {
        return `
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
}));`;
    }

    minify(content) {
        // 简单的压缩：移除注释和多余空白
        return content
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除块注释
            .replace(/\/\/.*$/gm, '') // 移除行注释
            .replace(/\s+/g, ' ') // 压缩空白
            .replace(/;\s*}/g, ';}') // 压缩分号
            .trim();
    }
}

// 执行构建
const builder = new ComponentBuilder();
builder.build().catch(console.error);
