import layout from './layout.js';

export default ({ name, logoUrl, activationLink }) => {
  const bodyHtml = `
    <h1>Hello, ${name},</h1>
    <p>A Transport Authority admin account has been created for you on SmartFare.</p>
    <p>Please activate your account and set your password using the link below:</p>
    <p><a href="${activationLink}" target="_blank">Activate your SmartFare Admin Account</a></p>
    <p>This activation link is valid for 24 hours.</p>
    <p>Safe travels,<br/><strong>The SmartFare Team</strong></p>
  `;

  return layout({
    title: 'SmartFare - Admin Account Created',
    logoUrl,
    bodyHtml,
  });
};
