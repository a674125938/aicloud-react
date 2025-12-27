import React, { useEffect, useState, Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { reactBridge } from '@garfish/bridge-react-v18';
import './index.css';
import { setExternalStore } from './store/useAppStore';

// 等待 React 渲染和 antd 样式注入完成后再显示内容
// 这个逻辑由 HTML 中的脚本处理，这里不需要立即显示

// 延迟加载 App 组件，确保 store 初始化后再引入
const App = React.lazy(() => import('./App'));

// 创建一个包装组件，用于接收 props 并设置 store
function RootComponent(GarfishProps: any) {
  const [storeInitialized, setStoreInitialized] = useState(false);
  // 使用 useEffect 确保在组件挂载时设置 store
  useEffect(() => {
    console.log('GarfishProps', GarfishProps?.props?.store);
    
    const store = GarfishProps?.props?.store;
    if (store) {
      // store 应该是 Zustand 的 hook 函数（即 useAppStore 本身）
      if (typeof store === 'function') {
        setExternalStore(store);
        setStoreInitialized(true);
        // 验证 store 是否正确，并同步主题色
        try {
          const testState = store.getState?.();
          console.log('子应用已接收主应用的 Zustand store，当前语言:', testState?.language);
          // 同步主题色到 CSS 变量
          if (testState?.primaryColor && typeof window !== 'undefined') {
            document.documentElement.style.setProperty('--primary-color', testState.primaryColor);
          }
        } catch (e) {
          console.warn('Store 验证失败:', e);
        }
      } else {
        console.warn('主应用传递的 store 不是函数类型');
        setStoreInitialized(true);
      }
    } else {
      // 如果没有从主应用传入 store，也标记为已初始化（使用本地 store）
      setStoreInitialized(true);
    }

    // 同步 Tailwind CSS 配置（从主应用传递）
    const tailwindConfig = GarfishProps?.props?.tailwindConfig;
    if (tailwindConfig && typeof window !== 'undefined') {
      console.log('子应用已接收主应用的 Tailwind 配置:', tailwindConfig);
      // Tailwind CSS v4 使用 CSS 变量配置，这里可以应用配置
      // 如果需要动态应用配置，可以在这里处理
      // 注意：Tailwind CSS v4 主要通过 CSS 变量和 @theme 指令配置
    }
  }, [GarfishProps?.props?.store, GarfishProps?.props?.tailwindConfig]);
  
  // 等待 store 初始化完成后再渲染 App
  if (!storeInitialized) {
    return <div>Loading...</div>;
  }
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  );
}

// 导出 provider 函数供 Garfish 使用
// 使用 reactBridge 来支持 React 19 的 createRoot API
// 注意：@garfish/bridge-react-v18 虽然包名是 v18，但它使用的 createRoot API 在 React 19 中仍然可用
export const provider = reactBridge({
  React,
  createRoot,
  hydrateRoot,
  rootComponent: RootComponent,
  errorBoundary: (err: Error) => {
    console.error('React 子应用错误:', err);
    return React.createElement('div', null, '加载出错，请刷新重试');
  },
});

// 同时导出 default，确保 Garfish 和 Next.js Turbopack 能正确加载
export default provider;

// 独立运行时的逻辑（使用 React 19 的 createRoot API）
if (!window.__GARFISH__) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    // 独立运行时直接导入 App，不需要延迟加载
    // 确保样式加载后再渲染
    Promise.all([
      import('./App'),
      // 等待 CSS 加载完成
      new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve(void 0);
        } else {
          window.addEventListener('load', resolve);
        }
      })
    ]).then(([module]) => {
      const App = module.default;
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    });
  }
}

