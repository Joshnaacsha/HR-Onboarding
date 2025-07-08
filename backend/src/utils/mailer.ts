import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

type MailOptions = {
  to: string;
  subject: string;
  text: string;
  cc?: string;
};

export async function sendMail({ to, subject, text, cc }: MailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      cc, // Optional CC
      subject,
      text,
    });

    console.log(`📧 Sent email to ${to}${cc ? ` (cc: ${cc})` : ""} with subject: "${subject}"`);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}
