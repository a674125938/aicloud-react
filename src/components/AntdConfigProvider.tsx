import ConfigProvider from 'antd/es/config-provider';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useAppStore } from '../store/useAppStore';
import { ReactNode, useEffect } from 'react';

export default function AntdConfigProvider({ children }: { children: ReactNode }) {
  // 从主应用的 store 获取语言和主题色设置
  const language = useAppStore((state) => state.language) || 'zh-CN';
  const primaryColor = useAppStore((state) => state.primaryColor) || '#667eea';
  
  // 根据语言设置 Ant Design 的 locale
  const locale = language === 'zh-CN' ? zhCN : enUS;
  
  // 更新 CSS 变量
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--primary-color', primaryColor);
    }
  }, [primaryColor]);
  
  // 配置 Ant Design 的主题色
  const themeConfig = {
    token: {
      colorPrimary: primaryColor,
    },
  };
  
  
  return (
    <ConfigProvider locale={locale} theme={themeConfig}>
      {children}
    </ConfigProvider>
  );
}
