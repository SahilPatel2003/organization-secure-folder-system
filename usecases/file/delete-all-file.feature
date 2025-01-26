Feature: Delete all files

    Scenario Outline: Successfully deleted all files
        Given folder_name:"<folder_name>", organization_name:"<organization_name>" delete-all-file
        When tries to delete all file
        Then it should return the result: "<result>" for deleting all file

        Examples:
            | folder_name | organization_name | result                               |
            | a           | TestOrg           | All files were deleted successfully. |


    Scenario Outline: Unsuccessful delete all files
        Given folder_name:"<folder_name>", organization_name:"<organization_name>" delete-all-file
        When tries to delete all file
        Then it should return the error: "<error>" for deleting all file

        Examples:
            | folder_name | organization_name | error                                                         |
            |             | TestOrg           | Invalid data,\"folder_name\" is not allowed to be empty       |
            | a           |                   | Invalid data,\"organization_name\" is not allowed to be empty |
            | notFound    | TestOrg           | The folder not found.                                         |




