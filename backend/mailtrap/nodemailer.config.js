import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter object using the default SMTP transport
const createTransporter = () => {
  // If no SMTP credentials are provided, return null (for development mode)
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const fromEmail = process.env.FROM_EMAIL;

export const sendEmail = async (to, subject, html) => {
  // Check if we have SMTP credentials
  const hasCredentials = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  
  // If we don't have credentials in any environment, skip sending
  if (!hasCredentials) {
    console.log("Email sending skipped (no SMTP credentials available)");
    // In development, log what would have been sent
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Would send email to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${html.substring(0, 100)}...`); // Log first 100 characters
    }
    return true;
  }

  const transporter = createTransporter();
  
  // If transporter is null, we're in development without credentials
  if (!transporter) {
    console.log("Email sending skipped (no transporter available)");
    return true;
  }

  try {
    // Send mail with defined transport object
    console.log(`Attempting to send email to: ${to}`);
    console.log(`Using SMTP host: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
    console.log(`From: SpareXchange <${fromEmail}>`);
    
    const info = await transporter.sendMail({
      from: `SpareXchange <${fromEmail}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    // Log specific error details
    if (error.code) {
      console.error(`SMTP Error Code: ${error.code}`);
    }
    if (error.response) {
      console.error(`SMTP Response: ${error.response}`);
    }
    
    // For authentication errors, provide more specific feedback
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your SMTP credentials.');
      console.error('Make sure you are using an App Password, not your regular Gmail password.');
    }
    
    return false;
  }
};
