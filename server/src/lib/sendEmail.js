import nodemailer from "nodemailer";

export const sendResetEmail = async (email, resetToken) => {
  // Create a transporter using a service other than Gmail if possible
  // SendGrid, Mailgun, or AWS SES are better options for transactional emails
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Consider changing this
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: "TB-Recruitment <support@tb.com>",
    to: email,
    subject: "Forgot Your Password?",
    text: `
      Sir or Madam,
      
      We have received your password change request. This email contains the information needed to change your password.
      
      Please copy and paste this link to reset your password:
      ${resetLink}
      
      If you did not request a password change, please ignore this email.
      Best regards,
      Human Resources Department
      Travel Blog
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
