Feature: Download file

    Scenario Outline: Successfully downloaded file
        Given organization_name:"<organization_name>", folder_name:"<folder_name>", file_name:"<file_name>" download-file
        When tries to download file
        Then it should return the result: "<result>" for downloading file

        Examples:
            | organization_name | folder_name | file_name | result           |
            | TestOrg           | a           | firebase  | File downloaded. |


    Scenario Outline: Unsuccessful download file
        Given organization_name:"<organization_name>", folder_name:"<folder_name>", file_name:"<file_name>" download-file
        When tries to download file
        Then it should return the error: "<error>" for downloading file


        Examples:
            | organization_name | folder_name | file_name    | error                                                         |
            |                   | a           | firebase     | Invalid data,\"organization_name\" is not allowed to be empty |
            | TestOrg           |             | firebase     | Invalid data,\"folder_name\" is not allowed to be empty       |
            | TestOrg           | a           |              | Invalid data,\"file_name\" is not allowed to be empty         |
            | TestOrg           | notFound    | firebase     | Folder not found in the specified organization.               |
            | TestOrg           | firebase    | fileNotFound | File not found in the specified folder.                       |




