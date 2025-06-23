import layout from './layout.js';

export default ({ name, otp, logoUrl }) => {
  const bodyHtml = `
    <p>Hello ${name},</p>
    <p>Your verification One-Time Password (OTP) is:</p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="
        display: inline-block;
        font-size: 28px;
        letter-spacing: 4px;
        font-weight: bold;
        background-color: #fef3c7;
        color: #b45309;
        padding: 12px 20px;
        border-radius: 8px;
        border: 1px solid #fcd34d;
      ">
        ${otp}
      </span>
    </div>
    <p>Please use this OTP to verify your SmartFare account within the next 24 hours.</p>
    <p>If you did not request this email, please ignore it.</p>
    <p>Safe travels,<br><strong>The SmartFare Team</strong></p>
  `;

  return layout({
    title: 'SmartFare - Account Verification OTP',
    logoUrl,
    bodyHtml,
  });
};
