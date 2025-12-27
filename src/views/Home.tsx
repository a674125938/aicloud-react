import { useIntl } from 'react-intl';
import AntdDemo from '../components/AntdDemo';
import './View.css';

function Home() {
  const intl = useIntl();
  
  return (
    <div className="view-container">
      <h2 className="text-2xl font-bold mb-4 text-primary">{intl.formatMessage({ id: 'home.title' })}</h2>
      <p className="text-gray-600 mb-6">{intl.formatMessage({ id: 'home.description' })}</p>
      <div className="feature-list grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="feature-item p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-primary">{intl.formatMessage({ id: 'home.feature.react19' })}</h3>
          <p className="text-gray-600">{intl.formatMessage({ id: 'home.feature.react19Desc' })}</p>
        </div>
        <div className="feature-item p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-primary">{intl.formatMessage({ id: 'home.feature.router' })}</h3>
          <p className="text-gray-600">{intl.formatMessage({ id: 'home.feature.routerDesc' })}</p>
        </div>
        <div className="feature-item p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-primary">{intl.formatMessage({ id: 'home.feature.garfish' })}</h3>
          <p className="text-gray-600">{intl.formatMessage({ id: 'home.feature.garfishDesc' })}</p>
        </div>
        <div className="feature-item p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-primary">{intl.formatMessage({ id: 'home.feature.zustand' })}</h3>
          <p className="text-gray-600">{intl.formatMessage({ id: 'home.feature.zustandDesc' })}</p>
        </div>
      </div>
      
      
      <div className="mt-8">
        <AntdDemo />
      </div>
    </div>
  );
}

export default Home;

