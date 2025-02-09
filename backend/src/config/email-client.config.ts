import nodemailer from "nodemailer";
import { envConfig } from "./env.config.js";

// Create Transporter Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Zoho SMTP Host
  port: 465, // Secure SSL Port
  secure: true, // Use TLS
  auth: {
    user: envConfig.GOOGLE_SMTP_USER,
    pass: envConfig.GOOGLE_SMTP_PASSWORD,
  },
});

// Verify the transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Transporter Error:", error);
  } else {
    console.log("SMTP Transporter Ready ✉️");
  }
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: `${envConfig.ORG_NAME} <${envConfig.GOOGLE_SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}:`, info.messageId);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
};

// Export Transporter for Advanced Use Cases
export { transporter };
