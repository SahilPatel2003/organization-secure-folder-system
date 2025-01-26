module.exports = function makeChangePassword({
  usersDb,
  jwt,
  JWTKey,
  url,
  crypto,
  Joi,
  createError,
}) {
  return async function changePassword(password, url1) {
    const passwordAndUrl = Joi.object({
      password: Joi.string().max(255).required(),
      url: Joi.string().max(255).required(),
    });

    const { error, value } = passwordAndUrl.validate({ password, url: url1 });

    if (error) {
      throw createError(400, `Invalid data, ${error.details[0].message}`);
    }

    const parsedUrl = url.parse(url1, true);
    const token = parsedUrl.query.token;

    jwt.verify(token, JWTKey, async (err) => {
      if (err) {
        throw createError(401, "Invalid token");
      }
    });

    const data = jwt.decode(token);

    const { organization_name, email } = data;

    const user_detail =
      await usersDb.getUserDetailsUsingEmailAndOrganization_name({
        email,
        organization_name,
      });

    const is_password_changed = user_detail[0].is_password_changed;
    if (!is_password_changed) {
      const { salt, hash } = hashPassword(password);
      await usersDb.changePassword({ hash, salt, email, organization_name });
    } else {
      throw createError(
        401,
        "The link to change your password has expired. Please request a new one."
      );
    }
  };

  function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");
    return { salt, hash };
  }
};
