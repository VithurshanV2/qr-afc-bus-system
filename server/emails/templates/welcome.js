import layout from './layout.js';

export default ({ name, email, logoUrl }) => {
  const bodyHtml = `
    <h1>Welcome, ${name}!</h1>
    <p>Welcome to <strong>SmartFare</strong>, your digital companion for convenient and secure bus travel across Sri Lanka.</p>
    <p>Your account has been successfully created using the email: <strong>${email}</strong></p>
    <p>Thank you for joining us. We hope you enjoy a smoother and smarter commuting experience.</p>
    <p>Safe travels,<br/><strong>The SmartFare Team</strong></p>
  `;

  return layout({ title: 'Welcome to SmartFare', logoUrl, bodyHtml });
};
