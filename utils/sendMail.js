import { createTransport } from "nodemailer";

export const sendMail = async (email, subject, html) => {
  const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from: `"Battisputali" <${process.env.SMTP_USER}>`,  // Professional email format
    to: email,
    subject,
    html, // Email body in HTML format
  });
};
