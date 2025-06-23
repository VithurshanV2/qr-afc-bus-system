export default ({ title, logoUrl, bodyHtml }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          font-family: Outfit, Arial, sans-serif;
          background: #f6f6f6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(to right, #fde68a, #fb923c);
          padding: 20px;
          text-align: center;
        }
        .header img {
          max-width: 200px;
        }
        .content {
          padding: 30px;
        }
        .content h1 {
          color: #fb923c;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .content p {
          line-height: 1.6;
        }
        .footer {
          background: #f3f4f6;
          text-align: center;
          padding: 15px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="SmartFare Logo" />
        </div>
        <div class="content">
          ${bodyHtml}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SmartFare. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`;
