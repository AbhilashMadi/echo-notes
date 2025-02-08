import { Resend } from "resend";
import { envConfig } from "./env.config.js";
import { EmailTemplate } from "@/templates/otp-template.js";


export const resend = new Resend(envConfig.RESEND_API_KEY);
export default resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['delivered@resend.dev'],
  subject: 'hello world',
  react: <EmailTemplate firstName="John" />,
})