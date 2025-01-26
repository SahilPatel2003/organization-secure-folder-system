module.exports = function makeTakePermissionFromAdmin({
  rolesDb,
  organizationsDb,
  usersDb,
  jwt,
  JWTKey,
  nodemailer,
  createError,
  Joi,
}) {
  return async function takePermissionFromAdmin(
    assigned_user_id,
    role_id,
    expiration_time,
    token
  ) {
    const schema = Joi.object({
      assigned_user_id: Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .required(),
      role_id: Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .required(),
      expiration_time: Joi.string()
        .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
        .required(),
    });

    const { error, value } = schema.validate({
      assigned_user_id,
      role_id,
      expiration_time,
    });

    if (error) {
      let errorMessage = error.details[0].message;
      if (errorMessage.includes("required pattern"))
        errorMessage =
          "expiration_time with value fails to match the required pattern";
      throw createError(400, `Invalid data: ${errorMessage}`);
    }

    const data = jwt.decode(token);

    const { organization_name, user_id, email, username } = data;

    const assigned_user_detail = await usersDb.getAssignedUserEmailAndUsername({
      assigned_user_id,
    });

    if (assigned_user_detail.length === 0) {
      throw createError(
        404,
        "Assigned user_id not found for the given organization."
      );
    }

    const roleDetail = await rolesDb.getRoleDetail({ role_id });

    if (roleDetail.length === 0) {
      throw createError(404, "Role not found for the given organization.");
    }

    const roleDetails = roleDetail[0];
    const { name, description, permissions, folders } = roleDetails;

    const admin_detail = await organizationsDb.getAdminName({
      organization_name,
    });
    const admin_email_id = admin_detail[0].created_by;

    const timeWithT = expiration_time.replace(" ", "T");

    const utcTime = new Date(timeWithT).toISOString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const token1 = jwt.sign(
      {
        assigned_user_id,
        user_id,
        role_id,
        expiration_time: utcTime,
        organization_name,
      },
      JWTKey
    );

    const mailOptions = {
      from: email,
      to: admin_email_id,
      subject: `Permission Request: Assign Role to ${assigned_user_detail[0].username}`,
      html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Permission Request: Assign Role to ${assigned_user_detail[0].username}</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: 50px auto;
                      padding: 20px;
                      background-color: #fff;
                      border-radius: 8px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      border: 2px solid #007bff;
                  }
                  h1 {
                      color: #007bff;
                      text-align: center;
                      margin-bottom: 20px;
                  }
                  p {
                      margin-bottom: 15px;
                      line-height: 1.6;
                  }
                  ul {
                      list-style-type: none;
                      padding: 0;
                  }
                  li {
                      margin-bottom: 10px;
                  }
                  .request-container {
                      text-align: center;
                      margin-top: 20px;
                  }
                  .request-button {
                      display: inline-block;
                      padding: 12px 24px;
                      background-color: #007bff;
                      color: #fff;
                      text-decoration: none;
                      border-radius: 4px;
                      transition: background-color 0.3s, transform 0.3s;
                      font-size: 16px;
                      font-weight: bold;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  }
                  
                  .request-button:hover {
                      background-color: #0056b3;
                      transform: translateY(-2px);
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Permission Request: Assign Role to ${assigned_user_detail[0].username}</h1>
                  <p>Dear Admin,</p>
                  <p>The user ${username} requests permission to assign the following role to ${assigned_user_detail[0].email}:</p>
                  <ul>
                      <li><strong>Role Name:</strong> ${name}</li>
                      <li><strong>Description:</strong> ${description}</li>
                      <li><strong>Permissions:</strong> ${permissions}</li>
                      <li><strong>Folders:</strong> ${folders}</li>
                  </ul>
                  <p>Click the button below to grant permission:</p>
                  <div class="request-container">
                      <a href="http://localhost:5500/frontend/grant-permission.html?token=${token1}" class="request-button">Grant Permission</a>
                  </div>
                  <p>If you did not expect this request, please ignore this email.</p>
                  <p>Thank you,</p>
                  <p>${username}</p>
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
    // console.log(
    //   `Permission request sent successfully to the admin.token=${token1}`
    // );
  };
};
