const { makePasswordAndUsernameEntity } = require("../../entities");

module.exports = function makeAddUser({ usersDb, crypto, url, createError }) {
  return async function addUser(username, password) {
    // When a user receives an email and clicks on the invitation_button to update their password, a token is appended to the URL.
    // This token needs to be fetched from the URL to obtain the user_id associated with the registration of the password.
    // Once the token is extracted from the URL, it can be used to decode and retrieve information such as the user_id.
    // This user_id can then be used to fetch additional information about the user who registered the password.

    // const parsedUrl = url.parse(req.url, true);
    // const token = parsedUrl.query.token;
    // let data;
    //   jwt.verify(token, JWTKey, (err, decoded) => {
    //     if (err) {
    //       console.error("Error verifying token:", err);
    //     } else {
    //       data = decoded;
    //     }
    //   });

    //  const {user_id}=data;

    const user_id = "c7f028d9-387f-476e-acc9-665cbe1eb260";

    const result = await usersDb.getUserDetail({ user_id });
    if (result[0].hash) {
      throw createError(
        403,
        "You are already registered, now you can't do it."
      );
    }

    const passwordAndUsernameData = {
      username,
      password,
    };

    const passwordAndUsernameEntity = await makePasswordAndUsernameEntity(
      passwordAndUsernameData
    );

    const { salt, hash } = hashPassword(
      passwordAndUsernameEntity.getPassword()
    );

    await usersDb.updateUser({
      username: passwordAndUsernameEntity.getUsername(),
      hash,
      salt,
      user_id,
    });
  };

  function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");
    return { salt, hash };
  }
};
