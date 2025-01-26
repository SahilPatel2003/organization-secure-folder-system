const response=require("../../utils/response")

const makePostFolderAction=require("./create-folder")
const makeDeleteFolderAction=require("./delete-folder")
const makeMoveFolderAction=require("./move-folder")
const makeGetAllFoldersAction=require("./get-all-folders")
const makeGetFolderAction=require("./get-folder")
const makeSearchFolderName=require("./search-folder-name")


const postFolder=makePostFolderAction({response});
const deleteFolder=makeDeleteFolderAction({response});
const moveFolder=makeMoveFolderAction({response});
const getAllFolders=makeGetAllFoldersAction({response});
const getFolder=makeGetFolderAction({response});
const searchFolderName=makeSearchFolderName({response});


module.exports=Object.freeze({
    postFolder,
    deleteFolder,
    moveFolder,
    getAllFolders,
    getFolder,
    searchFolderName
})



