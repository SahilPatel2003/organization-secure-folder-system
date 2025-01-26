const { makeUserEntity, makeOrganizationEntity } = require("../../entities");

module.exports = function makeAddAdmin({
  usersDb,
  organizationsDb,
  jwt,
  JWTKey,
  crypto,
  createError,
}) {
  return async function addAdmin(organization_name, username, email, password) {
    const emailExists = await usersDb.checkIfEmailExists({ email });
    if (emailExists) {
      throw createError(
        409,
        "This email is already associated with a registered company."
      );
    }
    const orgNameExists = await usersDb.checkIfOrganizationNameExists({
      organization_name,
    });
    if (orgNameExists) {
      throw createError(
        409,
        "This organization_name is already taken. Please choose another one."
      );
    }

    const organizationData = {
      organization_name,
      created_by: email,
    };

    const userData = {
      organization_name,
      username,
      email,
      password,
    };

    const userEntity = await makeUserEntity(userData);
    const organizationEntity = await makeOrganizationEntity(organizationData);
    const { salt, hash } = hashPassword(userEntity.getPassword());
    await usersDb.registerAdmin({
      organization_name: userEntity.getOrganizationName(),
      username: userEntity.getUsername(),
      email: userEntity.getEmail(),
      hash,
      salt,
    });

    const userRows = await usersDb.getUserDetailsUsingEmailAndOrganization_name(
      { email, organization_name }
    );

    const organizationRows = await organizationsDb.getOrganizationId({
      organization_name,
    });
    const { organization_id } = organizationRows[0];
    const { user_id } = userRows[0];

    const token = jwt.sign(
      {
        user_id,
        organization_id,
        organization_name,
        username,
        email,
      },
      JWTKey
    );
    // console.log(token);
    // createSession(req, res, email, false);
  };

  function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");
    return { salt, hash };
  }
};
