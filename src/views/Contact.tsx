import React from 'react';
import { useIntl } from 'react-intl';
import './View.css';

function Contact() {
  const intl = useIntl();
  
  return (
    <div className="view-container">
      <h2>{intl.formatMessage({ id: 'contact.title' })}</h2>
      <p>{intl.formatMessage({ id: 'contact.description' })}</p>
      <div className="contact-card">
        <h3>{intl.formatMessage({ id: 'contact.way' })}</h3>
        <p>{intl.formatMessage({ id: 'contact.email' })}: {intl.formatMessage({ id: 'contact.emailValue' })}</p>
        <p>{intl.formatMessage({ id: 'contact.phone' })}: {intl.formatMessage({ id: 'contact.phoneValue' })}</p>
      </div>
    </div>
  );
}

export default Contact;

