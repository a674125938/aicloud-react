// 使用标准的 antd 命名导入（子应用使用自身的 antd 依赖）
import React, { useState } from 'react';
import { Button, Card, Space, message, Input, Select } from 'antd';
import { useAppStore } from '../store/useAppStore';
import './AntdDemo.css';

const { Option } = Select;

export default function AntdDemo() {
  const { user, theme, language, setUser, setTheme, setLanguage, addNotification } = useAppStore();
  const [inputValue, setInputValue] = useState('');

  const handleAntdMessage = () => {
    message.success('这是来自 Ant Design 的消息提示！');
    addNotification({
      message: 'Ant Design 消息已发送',
      type: 'success',
    });
  };

  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark');
    message.info(`主题已切换为: ${value === 'light' ? '亮色' : '暗色'}`);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'zh-CN' | 'en-US');
    message.info(`语言已切换为: ${value === 'zh-CN' ? '中文' : 'English'}`);
  };

  return (
    <div className="antd-demo">
      <Card title="Ant Design 6 组件演示" extra={<span>使用主应用提供的 Ant Design</span>}>
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <h4>按钮组件</h4>
            <Space>
              <Button type="primary" onClick={handleAntdMessage}>
                主要按钮
              </Button>
              <Button onClick={() => message.info('信息提示')}>默认按钮</Button>
              <Button type="dashed" onClick={() => message.warning('警告提示')}>
                虚线按钮
              </Button>
              <Button danger onClick={() => message.error('错误提示')}>
                危险按钮
              </Button>
            </Space>
          </div>

          <div>
            <h4>输入框组件</h4>
            <Input
              placeholder="请输入内容"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <p style={{ marginTop: '8px', color: '#666' }}>
              输入值: {inputValue || '(空)'}
            </p>
          </div>

          <div>
            <h4>选择器组件</h4>
            <Space>
              <Select
                value={theme}
                onChange={handleThemeChange}
                style={{ width: 120 }}
              >
                <Option value="light">亮色</Option>
                <Option value="dark">暗色</Option>
              </Select>
              <Select
                value={language}
                onChange={handleLanguageChange}
                style={{ width: 120 }}
              >
                <Option value="zh-CN">中文</Option>
                <Option value="en-US">English</Option>
              </Select>
            </Space>
          </div>

          <div>
            <h4>状态信息</h4>
            <Card size="small">
              <p><strong>用户:</strong> {user ? user.name : '未登录'}</p>
              <p><strong>主题:</strong> {theme === 'light' ? '亮色' : '暗色'}</p>
              <p><strong>语言:</strong> {language === 'zh-CN' ? '中文' : 'English'}</p>
            </Card>
          </div>

          <div>
            <h4>说明</h4>
            <p style={{ color: '#666', fontSize: '12px' }}>
              ✅ 这些 Ant Design 组件来自子应用自身的依赖
              <br />
              ✅ 子应用使用自身的 antd 版本，与主应用隔离
              <br />
              ✅ 状态管理使用主应用下发的 Zustand store
            </p>
          </div>
        </Space>
      </Card>
    </div>
  );
}

