import transporter from '../config/nodemailer.js';
import welcomeTemplate from './templates/welcome.js';

export async function sendWelcomeEmail({ to, name, email }) {
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

    html: welcomeTemplate({ name, email }),
  });
}
