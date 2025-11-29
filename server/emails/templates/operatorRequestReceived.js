import layout from './layout.js';

export default ({ name, logoUrl }) => {
  const bodyHtml = `
    <h1>Hello, ${name},</h1>
    <p>We have received your bus operator account request.</p>
    <p>The National Transport Commission (NTC) will review your request and contact you via email once it has been approved.</p>
    <p>Safe travels,<br/><strong>The SmartFare Team</strong></p>
  `;

  return layout({
    title: 'SmartFare - Bus Operator Account Request Received',
    logoUrl,
    bodyHtml,
  });
};
