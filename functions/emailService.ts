// // services/emailService.ts

// import sgMail from '@sendgrid/mail';

// // Set your SendGrid API Key here
// sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// export const sendWelcomeEmail = async (email: string) => {
//     const msg = {
//         to: email,
//         from: 'your-email@example.com', // Your verified sender email
//         subject: 'Welcome to Our Newsletter!',
//         text: 'Thank you for subscribing to our newsletter. Stay tuned for updates!',
//         html: '<strong>Thank you for subscribing to our newsletter. Stay tuned for updates!</strong>',
//     };

//     try {
//         await sgMail.send(msg);
//         console.log('Email sent successfully to:', email);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };
