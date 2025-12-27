import React from 'react';
import { useIntl } from 'react-intl';
import './View.css';

function About() {
  const intl = useIntl();
  
  return (
    <div className="view-container">
      <h2>{intl.formatMessage({ id: 'about.title' })}</h2>
      <p>{intl.formatMessage({ id: 'about.description' })}</p>
      <div className="info-card">
        <h3>{intl.formatMessage({ id: 'about.techStack' })}</h3>
        <ul>
          <li>{intl.formatMessage({ id: 'about.tech.react' })}</li>
          <li>{intl.formatMessage({ id: 'about.tech.router' })}</li>
          <li>{intl.formatMessage({ id: 'about.tech.vite' })}</li>
          <li>{intl.formatMessage({ id: 'about.tech.garfish' })}</li>
        </ul>
      </div>
    </div>
  );
}

export default About;

