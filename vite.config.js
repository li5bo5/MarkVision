import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // 静态资源基础路径
  base: './',
  
  // 构建选项
  build: {
    // 目标目录
    outDir: 'dist',
    
    // 生成 ES 模块
    target: 'esnext',
    
    // 启用 minify
    minify: 'esbuild',
    
    // 启用 Source Map
    sourcemap: false,
    
    // 复制静态文件
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  
  // 解析选项
  resolve: {
    alias: {
      // 添加别名
      '@': '/src',
    },
  },
  
  // 开发服务器选项
  server: {
    port: 5173,
    strictPort: true,
    // 监听所有地址，包括局域网和公网地址
    host: true
  },
  
  // 插件
  plugins: [
    // 复制MarkdownParser.js到构建目录
    {
      name: 'copy-markdownparser',
      buildStart() {
        this.emitFile({
          type: 'asset',
          fileName: 'MarkdownParser.js',
          source: `
class MarkdownParser {
  constructor() {
    this.marked = window.marked;
  }

  /**
   * 编译Markdown节点
   * @param {NodeList} nodes - 包含Markdown文本的DOM节点列表
   * @returns {string} - 转换后的HTML
   */
  compile(nodes) {
    if (!nodes || nodes.length === 0) return '';
    
    // 将节点集合转换为数组
    const nodeArray = Array.from(nodes);
    let html = '';
    
    // 处理每个节点
    nodeArray.forEach(node => {
      if (node.textContent) {
        // 使用marked解析Markdown文本
        const parsedHtml = this.marked.parse(node.textContent);
        
        // 保留data-index属性
        if (node.dataset && node.dataset.index !== undefined) {
          // 将解析后的HTML包装在带有data-index的div中
          html += \`<div data-index="\${node.dataset.index}">\${parsedHtml}</div>\`;
        } else {
          html += parsedHtml;
        }
      }
    });
    
    return html;
  }
}

// 将MarkdownParser暴露为全局变量
window.MarkdownParser = MarkdownParser;
          `
        });
      }
    }
  ]
});