import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { useAppStore } from '../store/useAppStore';
import { messages, defaultLocale, type Locale } from '../locales';

export default function IntlProvider({ children }: { children: React.ReactNode }) {
  // 从主应用的 store 获取语言设置，使用 selector 确保响应式更新
  const language = useAppStore((state) => state.language) || defaultLocale;
  console.log('language',language);
  
  const locale = language as Locale;
  const currentMessages = messages[locale] || messages[defaultLocale];

  return (
    <ReactIntlProvider locale={locale} messages={currentMessages}>
      {children}
    </ReactIntlProvider>
  );
}
