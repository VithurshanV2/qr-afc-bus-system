import layout from './layout.js';

export default ({ name, logoUrl }) => {
  const bodyHtml = `
    <h1>Hello, ${name},</h1>
    <p>Your bus operator account has been <strong>deactivated</strong> temporarily.</p>
    <p>For any inquiries or clarifications, please contact the National Transport Commission (NTC).
    <p>Safe travels,<br/><strong>The SmartFare Team</strong></p>
  `;

  return layout({
    title: 'SmartFare - Bus Operator Account Deactivated',
    logoUrl,
    bodyHtml,
  });
};
