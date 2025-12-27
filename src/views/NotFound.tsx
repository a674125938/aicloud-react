import { useIntl } from 'react-intl';
import { Button } from 'antd';
import Result from 'antd/es/result';
import { HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const intl = useIntl();
  const location = useLocation();
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh',
      padding: '40px 20px'
    }}>
      <Result
        status="404"
        title={intl.formatMessage({ id: 'notFound.title' })}
        subTitle={intl.formatMessage({ id: 'notFound.subTitle' }, { path: location.pathname })}
        extra={
          <Link to="/">
            <Button type="primary" icon={<HomeOutlined />}>
              {intl.formatMessage({ id: 'notFound.backHome' })}
            </Button>
          </Link>
        }
      />
    </div>
  );
}

