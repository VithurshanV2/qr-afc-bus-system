export default ({ name, otp }) => `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>SmartFare - Account Verification OTP</title>
                </head>
                <body style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    <p>Hello ${name},</p>
                    <p>Your verification One-Time Password (OTP) is:</p>
                    <h2>${otp}</h2>
                    <p>Please use this OTP to verify your SmartFare account within the next 24 hours.</p>
                    <p>If you did not request this email, please ignore it.</p>
                    <p>Safe travels,<br><strong>The SmartFare Team</strong></p>
                </body>
            </html>
`;
