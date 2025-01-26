module.exports = function makeLoginUser({
  usersDb,
  organizationsDb,
  jwt,
  JWTKey,
  crypto,
  createError,
  Joi,
}) {
  return async function loginUser(
    organization_name,
    email,
    password,
    rememberMe
  ) {
    const dataSchema = Joi.object({
      organization_name: Joi.string().max(255).required(),
      email: Joi.string().email().max(255).required(),
      password: Joi.string().max(255).required(),
    });

    const { error, value } = dataSchema.validate({
      organization_name,
      email,
      password,
    });

    if (error) {
      throw createError(400, `Invalid input data: ${error.details[0].message}`);
    }

    const orgRows = await organizationsDb.getOrganizationId({
      organization_name,
    });
    if (orgRows.length === 0) {
      throw createError(
        404,
        "Organization not found. Please provide a valid organization name."
      );
    }

    const organization_id = orgRows[0].organization_id;

    const userRows = await usersDb.getUserDetailsUsingEmailAndOrganization_name(
      { email, organization_name }
    );

    if (userRows.length === 0) {
      throw createError(
        404,
        "User not found in the specified organization. Please check your credentials."
      );
    }

    if (userRows[0].user_status === 2) {
      throw createError(403, "You are blocked by the admin.");
    }

    const user = userRows[0];
    const { user_id, role_id, username, hash, salt } = user;

    if (verifyPassword(password, hash, salt)) {
      const token = jwt.sign(
        {
          organization_id,
          organization_name,
          user_id,
          role_id,
          username,
          email,
        },
        JWTKey
      );
      // createSession(req, res, email, rememberMe);
      //  console.log(
      //    `Success: Logged in successfully. Your JWT token is: ${token}`
      //  );
    } else {
      throw createError(401, "Incorrect password.");
    }
  };

  function verifyPassword(password, hash, salt) {
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");
    return hash === hashedPassword;
  }
};
