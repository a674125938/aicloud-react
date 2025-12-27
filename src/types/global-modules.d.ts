// 声明全局模块类型，用于 TypeScript 类型检查
// 在微前端环境中，这些模块由主应用提供，挂载在 window 上

// 注意：为了获得完整的类型支持，建议安装对应的类型定义包
// 但这些模块在运行时由主应用提供，不会被打包到子应用中

declare module 'antd' {
  // 声明 antd 模块存在，类型从全局变量获取
  // 如果需要完整的类型支持，可以安装 antd 的类型定义
  const antd: any;
  export = antd;
  export const Button: any;
  export const Card: any;
  export const Space: any;
  export const message: any;
  export const Input: any;
  export const Select: any;
  // 可以添加更多需要的导出
}

declare module 'zustand' {
  // 声明 zustand 模块存在
  const zustand: any;
  export = zustand;
  export function create<T>(initializer: any): any;
  // 可以添加更多需要的导出
}

// 全局变量类型声明
declare global {
  interface Window {
    __MAIN_APP_ANTD__?: any;
    __MAIN_APP_ZUSTAND__?: any;
  }
}

