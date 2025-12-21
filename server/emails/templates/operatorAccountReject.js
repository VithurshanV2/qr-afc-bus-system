import layout from './layout.js';

export default ({ name, logoUrl, remarks }) => {
  const bodyHtml = `
    <h1>Hello, ${name},</h1>
    <p>We regret to inform you that your bus operator account request has been rejected by the National Transport Commission (NTC).</p>

    ${remarks ? `<p><strong>Remarks:</strong><br/>${remarks}</p>` : `<p>If you need further clarification, please reply to this email.</p>`}
    
    <p>You may submit a new request after addressing the above concerns.</p>
    <p>Safe travels,<br/><strong>The SmartFare Team</strong></p>
  `;

  return layout({
    title: 'SmartFare - Bus Operator Account Request Rejected',
    logoUrl,
    bodyHtml,
  });
};
