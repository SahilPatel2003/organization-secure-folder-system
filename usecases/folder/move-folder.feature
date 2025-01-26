Feature: move folder

    Scenario Outline: Successfully moved folder
        Given source_folder_name:"<source_folder_name>", destination_folder_name:"<destination_folder_name>", organization_name:"<organization_name>" move-folder
        When tries to move folder
        Then it should return the result: "<result>" for moving folder

        Examples:
            | source_folder_name | destination_folder_name | organization_name | result                         |
            | a                  | g                       | TestOrg           | folder was moved successfully. |


    Scenario Outline: Unsuccessful move folder
        Given source_folder_name:"<source_folder_name>", destination_folder_name:"<destination_folder_name>", organization_name:"<organization_name>" move-folder
        When tries to move folder
        Then it should return the error: "<error>" for moving folder


        Examples:
            | source_folder_name   | destination_folder_name   | organization_name | error                                                               |
            |                      | g                         | TestOrg           | Invalid data,\"source_folder_name\" is not allowed to be empty      |
            | a                    |                           | TestOrg           | Invalid data,\"destination_folder_name\" is not allowed to be empty |
            | a                    | g                         |                   | Invalid data,\"organization_name\" is not allowed to be empty       |
            | sourceFolderNotFound | g                         | TestOrg           | Source folder not found.                                            |
            | a                    | destinationFolderNotFound | TestOrg           | Destination folder not found.                                       |


