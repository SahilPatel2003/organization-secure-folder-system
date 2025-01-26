module.exports = function makeFoldersDb({ pool, createError }) {
  async function getFolderDetail({ folder_name, organization_name }) {
    try {
      const checkFolderQuery = `
        SELECT * 
        FROM folders 
        WHERE folder_name = $1 
        AND organization_name = $2
      `;
      const { rows: folder_detail } = await pool.query(checkFolderQuery, [
        folder_name,
        organization_name,
      ]);
      return folder_detail;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to get folder detail");
    }
  }

  async function insertFolderDetails({
    organization_name,
    folder_name,
    parent_folder,
    childrens,
    created_by,
  }) {
    try {
      const insertFolderQuery = `
        INSERT INTO folders (organization_name, folder_name, parent_folder, childrens, created_by)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await pool.query(insertFolderQuery, [
        organization_name,
        folder_name,
        parent_folder,
        childrens,
        created_by,
      ]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to insert folder details");
    }
  }

  async function addFolderAsChildrenIntoParent({
    folder_id,
    email,
    parent_folder_id,
  }) {
    try {
      const updateParentFolderQuery = `
      UPDATE folders 
      SET childrens = childrens || $1::jsonb, modified_by = $2,modified_at = NOW()
      WHERE folder_id = $3
    `;
      await pool.query(updateParentFolderQuery, [
        JSON.stringify([folder_id]),
        email,
        parent_folder_id,
      ]);
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to add folder as children"
      );
    }
  }

  async function findRolesForFolder({ organization_name }) {
    try {
      const findRolesQuery = `
        SELECT role_id, folders
        FROM roles
        WHERE organization_name = $1
      `;
      const { rows: roles } = await pool.query(findRolesQuery, [
        organization_name,
      ]);
      return roles;
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to find roles for folder");
    }
  }

  async function deleteFoldersFromRoles({ updated_folders_string, role_id }) {
    try {
      const updateRoleQuery = `
        UPDATE roles
        SET folders = $1,modified_at = NOW()
        WHERE role_id = $2
      `;
      await pool.query(updateRoleQuery, [
        JSON.stringify(updated_folders_string),
        role_id,
      ]);
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to delete folders from roles"
      );
    }
  }

  async function findFolderUsingParentFolder({ folder_id }) {
    try {
      const getChildFoldersQuery = `
        SELECT folder_id
        FROM folders
        WHERE parent_folder = $1
      `;
      const { rows: childFolders } = await pool.query(getChildFoldersQuery, [
        folder_id,
      ]);
      return childFolders;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to find folder using parent folder"
      );
    }
  }

  async function deleteFolder({ folder_id }) {
    try {
      const deleteFolderQuery = `
        DELETE FROM folders
        WHERE folder_id = $1
      `;
      await pool.query(deleteFolderQuery, [folder_id]);
    } catch (error) {
      console.error(error);
      throw createError(500, "Database Error: Unable to delete folder");
    }
  }

  async function getFolderDetailUsingId({ folder_id }) {
    try {
      const getParentFolderQuery = `
        SELECT *
        FROM folders
        WHERE folder_id = $1
      `;
      const { rows: folderDetail } = await pool.query(getParentFolderQuery, [
        folder_id,
      ]);
      return folderDetail;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to get folder detail using ID"
      );
    }
  }

  async function removeFolderFromParentFolder({
    folder_id,
    email,
    parent_folder,
  }) {
    try {
      const selectQuery = `
      SELECT childrens
      FROM folders
      WHERE folder_id = $1
    `;
      const {rows} = await pool.query(selectQuery, [parent_folder]);

      let childrens = rows[0].childrens || [];

      childrens = childrens.filter((child) => child !== folder_id);

      const updateQuery = `
      UPDATE folders
      SET childrens = $1::jsonb, modified_by = $2,modified_at = NOW()
      WHERE folder_id = $3
    `;
      await pool.query(updateQuery, [
        JSON.stringify(childrens),
        email,
        parent_folder,
      ]);
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to remove folder from parent folder"
      );
    }
  }

  async function addFolderAsChildIntoDestinationParentFolder({
    source_folder_id,
    email,
    destination_folder_id,
  }) {
    try {
      const updateDestinationFolderQuery = `
        UPDATE folders
        SET childrens = (
          SELECT COALESCE(jsonb_agg(child), '[]'::jsonb)
          FROM (
            SELECT *
            FROM jsonb_array_elements_text(childrens) AS child
            UNION ALL
            SELECT $1
          ) AS all_children
        ),
        modified_by = $2,modified_at = NOW()
        WHERE folder_id = $3
      `;
      await pool.query(updateDestinationFolderQuery, [
        source_folder_id,
        email,
        destination_folder_id,
      ]);
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to add folder as child into destination parent folder"
      );
    }
  }

  async function setDestinationParentFolderForMovedFolder({
    destination_folder_id,
    email,
    source_folder_id,
  }) {
    try {
      const moveFolderQuery = `
        UPDATE folders
        SET parent_folder = $1, modified_by = $2,modified_at = NOW()
        WHERE folder_id = $3
      `;
      await pool.query(moveFolderQuery, [
        destination_folder_id,
        email,
        source_folder_id,
      ]);
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to set destination parent folder for moved folder"
      );
    }
  }

  async function getFoldersfromOrganization({ organization_name }) {
    try {
      const folderQuery = `SELECT * FROM folders WHERE organization_name = $1`;
      const { rows: foldersDetail } = await pool.query(folderQuery, [
        organization_name,
      ]);
      return foldersDetail;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve folders for the specified organization"
      );
    }
  }

  async function getTotalFoldersCount({ organization_name }) {
    try {
      const getCountQuery = `
        SELECT COUNT(*) AS total_folders
        FROM folders
        WHERE organization_name = $1
      `;
      const { rows: result } = await pool.query(getCountQuery, [
        organization_name,
      ]);
      return result[0];
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve total count of folders for the specified organization"
      );
    }
  }

  async function getRangeFoldersFromOrganization({
    organization_name,
    from_index,
    to_index,
  }) {
    try {
      const getFoldersQuery = `
        SELECT *
        FROM folders
        WHERE organization_name = $1
        LIMIT $2 OFFSET $3
      `;
      const { rows: folders } = await pool.query(getFoldersQuery, [
        organization_name,
        to_index - from_index + 1,
        from_index,
      ]);
      return folders;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to retrieve folders for the specified range and organization"
      );
    }
  }

  async function searchFolderNameWithOrganization({
    folder_name_prefix,
    organization_name,
    from_index,
    to_index,
  }) {
    try {
      const searchFoldersQuery = `
        SELECT *
        FROM folders
        WHERE organization_name = $1 AND folder_name LIKE $2
        LIMIT $3 OFFSET $4
      `;
      const { rows: folders } = await pool.query(searchFoldersQuery, [
        organization_name,
        `${folder_name_prefix}%`,
        to_index - from_index + 1,
        from_index,
      ]);
      return folders;
    } catch (error) {
      console.error(error);
      throw createError(
        500,
        "Database Error: Unable to search folders with the specified prefix and range"
      );
    }
  }

  async function getParentFolderDetail({ parent_folder, organization_name }) {
    try {
      const folder_detail = getFolderDetail({
        folder_name: parent_folder,
        organization_name,
      });
      return folder_detail;
    } catch (error) {
      throw error;
    }
  }

  async function getFolderDetailAfterCreated({
    folder_name,
    organization_name,
  }) {
    try {
      const folder_detail = getFolderDetail({ folder_name, organization_name });
      return folder_detail;
    } catch (error) {
      throw error;
    }
  }

  return Object.freeze({
    getFolderDetail,
    insertFolderDetails,
    addFolderAsChildrenIntoParent,
    findRolesForFolder,
    deleteFoldersFromRoles,
    findFolderUsingParentFolder,
    deleteFolder,
    getFolderDetail,
    removeFolderFromParentFolder,
    getFolderDetailUsingId,
    addFolderAsChildIntoDestinationParentFolder,
    setDestinationParentFolderForMovedFolder,
    getFoldersfromOrganization,
    getTotalFoldersCount,
    getRangeFoldersFromOrganization,
    searchFolderNameWithOrganization,
    getParentFolderDetail,
    getFolderDetailAfterCreated,
  });
};
