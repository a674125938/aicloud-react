/// <reference types="vite/client" />

interface Window {
  __GARFISH__?: boolean;
  // 主应用挂载的全局依赖，供子应用使用
  __MAIN_APP_REACT__?: any;
  __MAIN_APP_REACT_DOM__?: any;
  __MAIN_APP_ANTD__?: any;
  __MAIN_APP_ZUSTAND__?: any;
}

