Feature: Delete file

    Scenario Outline: Successfully deleted file
        Given file_name:"<file_name>", folder_name:"<folder_name>", organization_name:"<organization_name>" delete-file
        When tries to delete file
        Then it should return the result: "<result>" for deleting file

        Examples:
            | file_name | folder_name | organization_name | result                         |
            | firebase  | a           | TestOrg           | file was deleted successfully. |


    Scenario Outline: Unsuccessful delete file
        Given file_name:"<file_name>", folder_name:"<folder_name>", organization_name:"<organization_name>" delete-file
        When tries to delete file
        Then it should return the error: "<error>" for deleting file


        Examples:
            | file_name    | folder_name | organization_name | error                                                         |
            |              | a           | TestOrg           | Invalid data,\"file_name\" is not allowed to be empty         |
            | firebase     |             | TestOrg           | Invalid data,\"folder_name\" is not allowed to be empty       |
            | firebase     | a           |                   | Invalid data,\"organization_name\" is not allowed to be empty |
            | firebase     | notFound    | TestOrg           | Folder not found.                                             |
            | fileNotFound | a           | TestOrg           | File not found in the specified folder.                       |




