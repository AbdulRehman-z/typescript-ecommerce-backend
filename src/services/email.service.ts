// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "your_email_service_provider",
  auth: {
    user: "your_email_address",
    pass: "your_email_password",
  },
});

// Generate a reset token
const generateResetToken = async () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const token = buffer.toString("hex");
        resolve(token);
      }
    });
  });
};

// Send reset email
const sendResetEmail = async (email, resetToken) => {
  try {
    // Compose the email
    const mailOptions = {
      from: "your_email_address",
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetToken}`,
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log("Reset email sent:", result);
  } catch (error) {
    console.error("Error sending reset email:", error);
    // Handle error and provide appropriate feedback to the user
  }
};
