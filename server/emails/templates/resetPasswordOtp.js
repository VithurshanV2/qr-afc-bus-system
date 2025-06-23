import layout from './layout.js';

export default ({ name, otp, logoUrl }) => {
  const bodyHtml = `
    <p>Hello ${name},</p>
    <p>Your SmartFare password reset OTP is:</p>
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
    <p>Please use this OTP within 15 minutes to reset account password.</p>
    <p>If you didn't request this, you can ignore this message.</p>
    <p>Safe travels,<br><strong>The SmartFare Team</strong></p>
    `;

  return layout({
    title: 'SmartFare - Reset Password OTP',
    logoUrl,
    bodyHtml,
  });
};
