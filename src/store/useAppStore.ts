// 动态导入 zustand
// 在微前端环境中，Garfish 会将外部依赖注入，子应用可以直接 import
// 独立运行时使用本地安装的 zustand
import { create } from 'zustand';
import { useSyncExternalStore } from 'react';

// 定义应用状态接口（与主应用保持一致）
export interface AppState {
  // 用户信息
  user: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  
  // 主题设置
  theme: 'light' | 'dark';
  
  // 主题色设置
  primaryColor: string;
  
  // 语言设置
  language: 'zh-CN' | 'en-US';
  
  // 全局通知
  notifications: Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: number;
  }>;
  
  // Actions
  setUser: (user: AppState['user']) => void;
  setTheme: (theme: AppState['theme']) => void;
  setPrimaryColor: (color: string) => void;
  setLanguage: (language: AppState['language']) => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// 从主应用接收的 store hook（Zustand 的 hook 函数）
let externalStoreHook: ReturnType<typeof create<AppState>> | null = null;

// 设置外部 store（由主应用传入，应该是 useAppStore hook 函数本身）
export const setExternalStore = (store: ReturnType<typeof create<AppState>>) => {
  externalStoreHook = store;
  console.log('子应用已设置外部 store hook，类型:', typeof store);
};

// 创建本地 store（独立运行时使用）
const createLocalStore = () => create<AppState>((set: any) => ({
  user: null,
  theme: 'light',
  primaryColor: '#667eea', // 默认主题色
  language: 'zh-CN',
  notifications: [],
  setUser: (user: AppState['user']) => set({ user }),
  setTheme: (theme: AppState['theme']) => set({ theme }),
  setPrimaryColor: (color: string) => {
    set({ primaryColor: color });
    // 同步到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-primary-color', color);
      // 更新 CSS 变量
      document.documentElement.style.setProperty('--primary-color', color);
    }
  },
  setLanguage: (language: AppState['language']) => set({ language }),
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    set((state: AppState) => ({
      notifications: [...state.notifications, newNotification],
    }));
  },
  removeNotification: (id: string) => {
    set((state: AppState) => ({
      notifications: state.notifications.filter((n: AppState['notifications'][0]) => n.id !== id),
    }));
  },
  clearNotifications: () => set({ notifications: [] }),
}));

// 创建本地 store 实例（独立运行时使用）
const localStore = createLocalStore();

// 导出 store hook（优先使用外部 store，否则使用本地 store）
// 使用 useSyncExternalStore 来订阅外部 store，避免跨 React 实例的 hook 调用问题
export function useAppStore<T = AppState>(
  selector?: (state: AppState) => T
): T extends AppState ? AppState : T {
  // 如果存在外部 store hook（来自主应用），使用 useSyncExternalStore 来订阅
  if (externalStoreHook) {
    // 使用 useSyncExternalStore 来订阅外部 store 的变化
    // 这样可以避免跨 React 实例调用 hook 的问题
    const getSnapshot = () => {
      try {
        // 通过 getState 获取当前状态
        const state = externalStoreHook!.getState();
        return selector ? selector(state) : state;
      } catch (e) {
        console.warn('获取外部 store 状态失败:', e);
        const localState = localStore.getState();
        return selector ? selector(localState) : localState;
      }
    };
    
    const subscribe = (callback: () => void) => {
      // 订阅外部 store 的变化
      try {
        const unsubscribe = externalStoreHook!.subscribe((state) => {
          // 当主题色变化时，同步更新 CSS 变量
          if (state?.primaryColor && typeof window !== 'undefined') {
            document.documentElement.style.setProperty('--primary-color', state.primaryColor);
          }
          callback();
        });
        return unsubscribe;
      } catch (e) {
        console.warn('订阅外部 store 失败:', e);
        // 如果订阅失败，返回一个空函数
        return () => {};
      }
    };
    
    return useSyncExternalStore(
      subscribe,
      getSnapshot,
      getSnapshot // 服务端渲染时的快照（这里不需要）
    ) as any;
  }
  
  // 否则使用本地 store（正常的 hook 调用）
  return localStore(selector as any) as any;
}

