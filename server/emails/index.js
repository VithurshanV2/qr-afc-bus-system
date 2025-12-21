import transporter from '../config/nodemailer.js';
import welcomeTemplate from './templates/welcome.js';
import verifyOtpTemplate from './templates/verifyOtp.js';
import resetPasswordOtpTemplate from './templates/resetPasswordOtp.js';
import operatorRequestReceivedTemplate from './templates/operatorRequestReceived.js';
import operatorAccountApproved from './templates/operatorAccountApproved.js';
import operatorAccountReject from './templates/operatorAccountReject.js';

const logoUrl = process.env.EMAIL_LOGO_URL;

export async function sendWelcomeEmail({ to, name, email }) {
  const html = welcomeTemplate({ name, email, logoUrl });

  return transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject: 'Welcome to SmartFare',
    text: `Hello ${name}, 
            Welcome to SmartFare, your digital companion for convenient and secure bus travel across Sri Lanka. 

            Your account has been successfully created using the email: ${email} 
            
            Thank you for joining us. We hope you enjoy a smoother and smarter commuting experience.
            
            Safe travels,
            The SmartFare Team`,

    html,
  });
}

export async function sendVerificationOtp({ to, name, otp }) {
  const html = verifyOtpTemplate({ name, otp, logoUrl });

  return transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject: 'SmartFare - Account Verification OTP',
    text: `Hello ${name}, 

            Your verification One-Time Password (OTP) is: ${otp} 
            
            Please use this OTP to verify your SmartFare account within the next 24 hours.

            If you did not request this email, please ignore it.
            
            Safe travels,
            The SmartFare Team`,

    html,
  });
}

export async function sendPasswordResetOtp({ to, name, otp }) {
  const html = resetPasswordOtpTemplate({ name, otp, logoUrl });

  return transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject: 'SmartFare - Reset Password OTP',
    text: `Hello ${name}, 

            Your SmartFare password reset OTP is: ${otp} 
            
            Please use this OTP within 15 minutes to reset account password.

            If you didn't request this, you can ignore this message.
            
            Safe travels,
            The SmartFare Team`,
    html,
  });
}

export async function sendOperatorRequestReceived({ to, name }) {
  const html = operatorRequestReceivedTemplate({ name, logoUrl });

  return transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject: 'SmartFare - Bus Operator Account Request Received',
    text: `Hello, ${name},

            We have received your bus operator account request. 
            
            The National Transport Commission (NTC) will review your request and contact you via email once it has been approved.
            
            Safe travels,
            The SmartFare Team`,
    html,
  });
}

export async function sendOperatorAccountApproved({
  to,
  name,
  activationLink,
}) {
  const html = operatorAccountApproved({ name, logoUrl, activationLink });

  return transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject: 'SmartFare - Bus Operator Account Request Approved',
    text: `Hello, ${name},

    Your bus operator account request has been approved by the National Transport Commission (NTC).

    Please activate your account using the link below:
    ${activationLink}

    This activation link is valid for 24 hours.

    Safe travels,
    The SmartFare Team`,
    html,
  });
}

export async function sendOperatorAccountReject({ to, name, remarks }) {
  const html = operatorAccountReject({ name, logoUrl, remarks });

  return transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject: 'SmartFare - Bus Operator Account Request Rejected',
    text: `Hello, ${name},

    We regret to inform you that your bus operator account request has been rejected by the National Transport Commission (NTC).

    ${remarks ? `Remarks:\n${remarks}\n` : 'If you need further clarification, please reply to this email.'}

    You may submit a new request after addressing the above concerns.

    Safe travels,
    The SmartFare Team`,
    html,
  });
}
