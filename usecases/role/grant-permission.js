module.exports = function makeGrantPermission({
  rolesDb,
  jwt,
  JWTKey,
  url,
  createError,
}) {
  return async function grantPermissionByAdmin(url1) {
    const parsedUrl = url.parse(url1, true);
    const token = parsedUrl.query.token;

    jwt.verify(token, JWTKey, (err) => {
      if (err) {
        throw createError(401, "Invalid token");
      }
    });

    const data = jwt.decode(token);

    const {
      assigned_user_id,
      user_id,
      role_id,
      expiration_time,
      organization_name,
    } = data;

    await rolesDb.assignedRoleDetail({
      assigned_user_id,
      user_id,
      role_id,
      expiration_time,
      organization_name,
    });
  };
};
