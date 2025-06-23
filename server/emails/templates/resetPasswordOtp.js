export default ({ name, otp }) => `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>SmartFare - Reset Password OTP</title>
                </head>
                <body style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    <p>Hello ${name},</p>
                    <p>Your SmartFare password reset OTP is:</p>
                    <h2>${otp}</h2>
                    <p>Please use this OTP within 15 minutes to reset account password.</p>
                    <p>If you didn't request this, you can ignore this message.</p>
                    <p>Safe travels,<br><strong>The SmartFare Team</strong></p>
                </body>
            </html>`;
