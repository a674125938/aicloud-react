import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 判断是否在微前端环境中运行
const isGarfish = process.env.GARFISH_ENV === 'true';

export default defineConfig({
  plugins: [
    react({
      // React 插件配置
      // 注意：在微前端环境中，React Fast Refresh 可能会与沙箱冲突
      // 如果遇到问题，可以考虑禁用 Fast Refresh
    }),
  ],
  css: {
    postcss: './postcss.config.js',
    // 开发环境：立即注入 CSS，减少 FOUC
    devSourcemap: true,
  },
  // 不再使用 alias，让子应用使用自身的依赖
  // 通过 Garfish 沙箱实现隔离，避免与主应用的依赖互相污染
  server: {
    host: '127.0.0.1', // 明确指定 host，避免 localhost 解析失败
    port: 8083,
    cors: true,
    origin: isGarfish ? 'http://127.0.0.1:3000' : undefined, // 主应用域名
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // 开发环境正常构建，生产环境构建为库模式
  // 注意：如果要支持沙箱，生产环境应使用 UMD 格式而不是 ES 格式
  build: process.env.NODE_ENV === 'production' ? {
    lib: {
      entry: './src/main.tsx',
      formats: ['umd'], // 改为 UMD 格式以支持沙箱
      fileName: 'index',
      name: 'ReactApp', // UMD 格式需要指定全局变量名
    },
    rollupOptions: {
      // 将主应用提供的依赖设置为外部依赖，不打包
      // external: [
      //   'react', 
      //   'react-dom', 
      //   'react-router-dom',
      //   'antd',        // 使用主应用提供的 antd
      //   'zustand',     // 使用主应用提供的 zustand
      // ],
      output: {
        format: 'umd', // 明确指定 UMD 格式
        // 不再使用 globals，让子应用打包自身的依赖
      },
    },
  } : {
    target: 'esnext',
    modulePreload: {
      polyfill: false, // 关闭 polyfill，避免沙箱内冲突
    },
    rollupOptions: {
      // 开发环境：使用 alias 指向全局变量，不打包这些依赖
      // external: isGarfish ? [
      //   'react',
      //   'react-dom',
      //   'react-router-dom',
      //   'antd',
      //   'zustand',
      // ] : [],
      output: {
        format: 'esm', // 必须输出 ESM 格式
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        // 不再使用 globals，让子应用使用自身的依赖
      },
    },
  },
  // 3. 配置基础路径：开发环境使用相对路径，确保 ES 模块能正确加载
  base: '/',
  // 4. 全局变量注入：避免 Vite 内置变量与沙箱冲突
  define: {
    'process.env': {},
    __REACT_DEVTOOLS_GLOBAL_HOOK__: 'window.__REACT_DEVTOOLS_GLOBAL_HOOK__',
  },
});
