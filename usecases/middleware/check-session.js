module.exports = function makeCheckSession({
  createError,
}) {
  return async function checkSession(cookieHeader) {
    // if (cookieHeader) {
    //   const cookies = cookieHeader.split("; ").reduce((acc, cookie) => {
    //     const [name, value] = cookie.split("=");
    //     acc[name] = value;
    //     return acc;
    //   }, {});

    //   const sessionId = cookies["session_id"];
    //   if (!sessionId) {
    //     console.error("session_id not present");
    //     throw createError(404, "session_id not present");
    //   }
    // } else {
    //   console.error("session_id not present");
    //   throw createError(404, "session_id not present");
    // }
  };
};
