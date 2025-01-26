async function response(res, result, statusCode, type, message) {
  res.writeHead(statusCode, { "Content-Type": type });

  if (result === "success") {
      if (typeof message === "object") {
          res.end(JSON.stringify({ data: message }));
      } else {
          res.end(JSON.stringify({ success: message }));
      }
  } else {
      res.end(JSON.stringify({ error: message }));
  }
}

module.exports = response;
