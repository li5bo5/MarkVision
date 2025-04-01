import { defineConfig } from 'vite';

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
  plugins: []
});