module.exports = function makeResetPassword({
  usersDb,
  jwt,
  JWTKey,
  nodemailer,
  Joi,
  createError,
}) {
  return async function resetPasswordByUser(organization_name, email) {
    const organizationNameAndEmail = Joi.object({
      organization_name: Joi.string().max(255).required(),
      email: Joi.string().email().max(255).required(),
    });

    const { error, value } = organizationNameAndEmail.validate({
      organization_name,
      email,
    });

    if (error) {
      throw createError(400, `Invalid user data, ${error.details[0].message}`);
    }

    const token = jwt.sign({ organization_name, email }, JWTKey, {
      expiresIn: "15m",
    });

    await usersDb.setPasswordChanged({ organization_name, email });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border: 1px solid #dee2e6;
                }
                h1 {
                    color: #007bff;
                    text-align: center;
                    margin-bottom: 20px;
                }
                p {
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                .reset-container {
                  display: flex;
                  justify-content: center; /* Center horizontally */
                  margin-top: 20px; /* Adjust as needed */
              }
              
              a.reset-button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff; /* Button background color */
                  color: #ffffff; /* Text color */
                  text-decoration: none;
                  border-radius: 5px;
                  border: none; /* Remove border */
                  cursor: pointer;
                  transition: background-color 0.3s;
              }
              
              a.reset-button:hover {
                  background-color: #0056b3; /* Darker shade on hover */
              }
                
              
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Reset</h1>
                <p>Dear User,</p>
                <p>You have requested to reset your password. Click the link below to proceed:</p>
                <div class="reset-container">
                <a href="http://localhost:5500/frontend/change-password.html?token=${token}" class="reset-button">Reset Password</a>
            </div>
    
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Thank you,</p>
                <p>Salesmate</p>
            </div>
        </body>
        </html>
        
          `,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        throw createError(500, "Failed to send email.");
      }
    });
  };
};
