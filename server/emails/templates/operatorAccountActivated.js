import layout from './layout.js';

export default ({ name, logoUrl }) => {
  const bodyHtml = `
    <h1>Hello, ${name},</h1>
    <p>Your bus operator account request has been <strong>activated</strong> back by the National Transport Commission (NTC).</p>
    <p>Safe travels,<br/><strong>The SmartFare Team</strong></p>
  `;

  return layout({
    title: 'SmartFare - Bus Operator Account Activated',
    logoUrl,
    bodyHtml,
  });
};
