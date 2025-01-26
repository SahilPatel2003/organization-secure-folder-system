const { downloadFileByUser } = require("../../usecases/file");

module.exports = function makeDownloadFileAction({ response }) {
  return async function downloadFile(req, res) {
    try {
      const { organization_name, folder_name, file_name } = req.params;
      const result = await downloadFileByUser(
        organization_name,
        folder_name,
        file_name
      );

      const { header, fileName, buffer } = result;

      res.setHeader("Content-Type", header);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.end(buffer);
    } catch (error) {
      console.error("Error: ", error.message);
      await response(
        res,
        "error",
        error.statusCode || 500,
        "application/json",
        error.message || "Internal Server Error"
      );
    }
  };
};
