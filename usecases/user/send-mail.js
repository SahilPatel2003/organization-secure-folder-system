const { makeUserEntity } = require("../../entities");

module.exports = function makeSendMail({
  usersDb,
  rolesDb,
  uuidv4,
  jwt,
  JWTKey,
  nodemailer,
  permissionMap,
  Joi,
  createError,
}) {
  return async function sendMailByAdmin(to, token) {
    try {
      const verifyMailsAndRoldId = JSON.parse(to);
      const emailUuidSchema = Joi.object()
        .pattern(
          Joi.string().email().required(),
          Joi.string()
            .guid({ version: ["uuidv4", "uuidv5"] })
            .required()
        )
        .min(1)
        .required();

      const { error, value } = emailUuidSchema.validate(verifyMailsAndRoldId);

      if (error) {
        throw createError(400, `invalid data: ${error.details[0].message}`);
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw createError(
          400,
          "invalid data: 'to' must be a valid JSON object."
        );
      } else {
        throw err;
      }
    }

    const data = jwt.decode(token);

    const { organization_name, username, user_id, email } = data;
    const from = email;

    const keyValuePairs = to.slice(1, -1).split(",");

    const emailRolePairs = {};
    const duplicateEmails = [];

    for (const pair of keyValuePairs) {
      const [email, roleId] = pair.split(":");

      const cleanEmail = email.trim().replace(/['"]+/g, "");
      const cleanRoleId = roleId.trim().replace(/['"]+/g, "");

      if (emailRolePairs.hasOwnProperty(cleanEmail)) {
        duplicateEmails.push(cleanEmail);
      } else {
        emailRolePairs[cleanEmail] = cleanRoleId;
      }
    }

    if (duplicateEmails.length > 0) {
      const errorMessage = `Duplicate emails found: ${duplicateEmails.join(
        ", "
      )}`;
      throw createError(400, errorMessage);
    }

    const orgEmails = await usersDb.getEmailsByOrganization({
      organization_name,
    });

    const orgEmailSet = new Set(orgEmails.map((user) => user.email));
    const duplicateOrgEmails = [];

    for (const email in emailRolePairs) {
      if (orgEmailSet.has(email)) {
        duplicateOrgEmails.push(email);
      }
    }

    if (duplicateOrgEmails.length > 0) {
      throw createError(
        400,
        `Duplicate emails found within the organization: ${duplicateOrgEmails.join(
          ", "
        )}`
      );
    }

    const uniqueRoleIds = Array.from(new Set(Object.values(emailRolePairs)));
    const roleDetails = {};
    for (const roleId of uniqueRoleIds) {
      try {
        const roleDetail = await rolesDb.getRoleDetail({ role_id: roleId });
        roleDetails[roleId] = roleDetail[0];
      } catch (error) {
        throw createError(404, `Role with ID ${roleId} not found`);
      }
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    for (const [email, roleId] of Object.entries(emailRolePairs)) {
      const registered_user_id = uuidv4();
      const permissionIndex = parseInt(roleDetails[roleId].permissions, 2);
      const permissionDescription = permissionMap[permissionIndex];
      const token = jwt.sign(
        {
          registered_user_id,
        },
        JWTKey,
        {
          expiresIn: "5d",
        }
      );
      const mailOptions = {
        from,
        to: email,
        subject: "Invitation to join Organization",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Invitation to Join Organization</title>
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
                      border: 2px solid #007bff; /* Add border */
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
                  .invite-container {
                      text-align: center;
                      margin-top: 20px;
                  }
                  .invite-button {
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
                  
                  .invite-button:hover {
                    background-color: #0056b3;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Invitation to Join Organization</h1>
                  <p>Dear User,</p>
                  <p>You have been invited to join our organization. Below are the details of the role assigned to you:</p>
                  <ul>
                      <li><strong>Role Name:</strong> ${roleDetails[roleId].name}</li>
                      <li><strong>Description:</strong> ${roleDetails[roleId].description}</li>
                      <li><strong>Permissions:</strong> ${permissionDescription}</li>
                      <li><strong>Folders:</strong> ${roleDetails[roleId].folders}</li>
                  </ul>
                  <p>Click the button below to accept the invitation:</p>
                  <div class="invite-container">
                      <a href="http://localhost:5500/frontend/accept-invitation.html?token=${token}" class="invite-button">Accept Invitation</a>
                  </div>
                  <p>If you did not expect this invitation, please ignore this email.</p>
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

      const userData = {
        organization_name,
        role_id: roleId,
        email,
        created_by: user_id,
      };

      const userEntity = await makeUserEntity(userData);

      await usersDb.registerUser({
        organization_name: userEntity.getOrganizationName(),
        role_id: userEntity.getRoleId(),
        email: userEntity.getEmail(),
        created_by: userEntity.getCreatedBy(),
      });
    }
  };
};
