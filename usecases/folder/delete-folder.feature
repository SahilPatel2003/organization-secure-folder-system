Feature: delete folder

    Scenario Outline: Successfully deleted folder
        Given folder_name:"<folder_name>", organization_name:"<organization_name>" delete-folder
        When tries to delete folder
        Then it should return the result: "<result>" for deleting the folder

        Examples:
            | folder_name | organization_name | result                      |
            | a           | testorg           | Folder delted successfully. |
            | b           | testorg           | Folder delted successfully. |



    Scenario Outline: Unsuccessful create folder
        Given folder_name:"<folder_name>", organization_name:"<organization_name>" delete-folder
        When tries to delete folder
        Then it should return the error: "<error>" for deleting the folder


        Examples:
            | folder_name | organization_name | error                                                                |
            |             | testorg           | Invalid folder data,\"folder_name\" is not allowed to be empty       |
            | a           |                   | Invalid folder data,\"organization_name\" is not allowed to be empty |
            | notfound    | testorg           | The folder you are trying to delete was not found                    |

