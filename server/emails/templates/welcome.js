export default ({ name, email }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to SmartFare</title>
    </head>
    <body style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Hello ${name},</p>
      <p>Welcome to <strong>SmartFare</strong>, your digital companion for convenient and secure bus travel across Sri Lanka.</p>
      <p>Your account has been successfully created using the email: <strong>${email}</strong></p>
      <p>Thank you for joining us. We hope you enjoy a smoother and smarter commuting experience.</p>
      <p>Safe travels,<br /><strong>The SmartFare Team</strong></p>
    </body>
  </html>
`;
