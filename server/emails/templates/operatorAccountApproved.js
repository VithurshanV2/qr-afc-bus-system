import layout from './layout.js';

export default ({ name, logoUrl, activationLink }) => {
  const bodyHtml = `
    <h1>Hello, ${name},</h1>
    <p>Your bus operator account request has been <strong>approved</strong> by the National Transport Commission (NTC).</p>
    <p>Please activate your account using the link below:</p>
    <p><a href="${activationLink}" target="_blank">Activate your SmartFare Account</a></p>
    <p>This activation link is valid for 24 hours.</p>
    <p>Safe travels,<br/><strong>The SmartFare Team</strong></p>
  `;

  return layout({
    title: 'SmartFare - Bus Operator Account Request Approved',
    logoUrl,
    bodyHtml,
  });
};
