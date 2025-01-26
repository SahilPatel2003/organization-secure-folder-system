module.exports = function makeFilesDb({ pool, createError }) {
  async function getFileDetail({ file_name, folder_id }) {
    try {
      const checkFileQuery = `
        SELECT * 
        FROM files 
        WHERE file_name = $1
        AND folder_id = $2
      `;
      const { rows: file_detail } = await pool.query(checkFileQuery, [
        file_name,
        folder_id,
      ]);
      return file_detail;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to get file detail");
    }
  }

  async function insertFileDetails({
    file_name,
    folder_id,
    organization_name,
    size,
    type,
    path,
    created_by,
  }) {
    try {
      const insertFileQuery = `
        INSERT INTO files (file_name, folder_id, organization_name, size, type, path, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      await pool.query(insertFileQuery, [
        file_name,
        folder_id,
        organization_name,
        size,
        type,
        path,
        created_by,
      ]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to insert file details");
    }
  }

  async function deleteFile({ file_name, folder_id }) {
    try {
      const deleteFileQuery = `
        DELETE FROM files
        WHERE file_name = $1 AND folder_id = $2
      `;
      await pool.query(deleteFileQuery, [file_name, folder_id]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to delete file");
    }
  }

  async function moveFileFromFolder({
    destination_folder_id,
    user_id,
    file_name,
    source_folder_id,
  }) {
    try {
      const updateFileParentQuery = `
        UPDATE files
        SET folder_id = $1, modified_by = $2,modified_at = NOW()
        WHERE file_name = $3 AND folder_id = $4
      `;
      await pool.query(updateFileParentQuery, [
        destination_folder_id,
        user_id,
        file_name,
        source_folder_id,
      ]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to move file");
    }
  }

  async function deleteAllFiles({ folder_id }) {
    try {
      const deleteFileQuery = `
        DELETE FROM files
        WHERE folder_id = $1
      `;
      await pool.query(deleteFileQuery, [folder_id]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to delete all files");
    }
  }

  async function getFolderFiles({ folder_id }) {
    try {
      const fileQuery = `SELECT * FROM files WHERE folder_id = $1`;
      const { rows: folderFiles } = await pool.query(fileQuery, [folder_id]);
      return folderFiles;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve files for the specified folder"
      );
    }
  }

  async function getFile({ file_name, folder_id }) {
    try {
      const fileQuery = `SELECT * FROM files WHERE file_name = $1 AND folder_id = $2`;
      const { rows: filesDetail } = await pool.query(fileQuery, [
        file_name,
        folder_id,
      ]);
      return filesDetail;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve the specified file"
      );
    }
  }

  async function getOrganizationFiles(organizationName) {
    try {
      const fileQuery = `SELECT * FROM files WHERE organization_name = $1`;
      const { rows: files } = await pool.query(fileQuery, [organizationName]);
      return files;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve files for the specified organization"
      );
    }
  }

  async function getTotalCountOfFiles({ organization_name }) {
    try {
      const getCountQuery = `
        SELECT COUNT(*) AS total_files
        FROM files
        WHERE organization_name = $1
      `;
      const { rows: countResult } = await pool.query(getCountQuery, [
        organization_name,
      ]);
      return countResult[0];
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve total count of files for the specified organization"
      );
    }
  }

  async function getRangeFilesFromOrganization({
    organization_name,
    from_index,
    to_index,
  }) {
    try {
      const getFilesQuery = `
        SELECT *
        FROM files
        WHERE organization_name = $1
        LIMIT $2 OFFSET $3
      `;
      const { rows: files } = await pool.query(getFilesQuery, [
        organization_name,
        to_index - from_index + 1,
        from_index,
      ]);
      return files;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve files for the specified range and organization"
      );
    }
  }

  async function searchFileNameWithOrganization({
    file_name_prefix,
    organization_name,
    from_index,
    to_index,
  }) {
    try {
      const searchFilesQuery = `
        SELECT *
        FROM files
        WHERE organization_name = $1 AND file_name LIKE $2
        LIMIT $3 OFFSET $4
      `;
      const { rows: files } = await pool.query(searchFilesQuery, [
        organization_name,
        `${file_name_prefix}%`,
        to_index - from_index + 1,
        from_index,
      ]);
      return files;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to search files with the specified prefix and range"
      );
    }
  }

  return Object.freeze({
    getFileDetail,
    insertFileDetails,
    deleteFile,
    moveFileFromFolder,
    deleteAllFiles,
    getFile,
    getFolderFiles,
    getOrganizationFiles,
    getTotalCountOfFiles,
    getRangeFilesFromOrganization,
    searchFileNameWithOrganization,
  });
};
