import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Home from './views/Home';
import About from './views/About';
import Contact from './views/Contact';
import NotFound from './views/NotFound';
import IntlProvider from './components/IntlProvider';
import AntdConfigProvider from './components/AntdConfigProvider';
import './App.css';

function App() {
  const location = useLocation();
  const intl = useIntl();
  // 检测是否在 Garfish 环境中（通过主应用启动）
  const isInGarfish = typeof window !== 'undefined' && window.__GARFISH__;
  
  // 由于 Router 设置了 basename，location.pathname 已经是相对于 basename 的路径
  // 在 Garfish 环境中：basename='/react'，所以 pathname 是 '/', '/about', '/contact' 等
  // 在独立运行时：basename='/'，所以 pathname 也是 '/', '/about', '/contact' 等
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname === path;
  };

  return (
    <div className="react-app">
      {/* 只在独立运行时显示 header，在 Garfish 环境中不显示 */}
      {!isInGarfish && (
        <header className="react-header">
          <h1>{intl.formatMessage({ id: 'common.subApp' })}</h1>
          <nav className="react-nav">
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              {intl.formatMessage({ id: 'common.home' })}
            </Link>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>
              {intl.formatMessage({ id: 'common.about' })}
            </Link>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
              {intl.formatMessage({ id: 'common.contact' })}
            </Link>
          </nav>
        </header>
      )}
      <main className="react-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function AppWithRouter() {
  const basename = window.__GARFISH__ ? '/react' : '/';
  
  return (
    <IntlProvider>
      <AntdConfigProvider>
        <Router basename={basename}>
          <App />
        </Router>
      </AntdConfigProvider>
    </IntlProvider>
  );
}

export default AppWithRouter;

