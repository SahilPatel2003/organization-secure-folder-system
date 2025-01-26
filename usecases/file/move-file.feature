Feature: Move file

    Scenario Outline: Successfully moved file
        Given file_name:"<file_name>", destination_folder:"<destination_folder>", organization_name:"<organization_name>", source_folder_name:"<source_folder_name>" move-file
        When tries to move file
        Then it should return the result: "<result>" for moving file

        Examples:
            | file_name | destination_folder | organization_name | source_folder_name | result                       |
            | firebase  | b                  | TestOrg           | a                  | File was moved successfully. |


    Scenario Outline: Unsuccessful move file
        Given file_name:"<file_name>", destination_folder:"<destination_folder>", organization_name:"<organization_name>", source_folder_name:"<source_folder_name>" move-file
        When tries to move file
        Then it should return the error: "<error>" for moving file

        Examples:
            | file_name | destination_folder | organization_name | source_folder_name | error                                                          |
            |           | b                  | TestOrg           | a                  | Invalid data,\"file_name\" is not allowed to be empty          |
            | firebase  |                    | TestOrg           | a                  | Invalid data,\"destination_folder\" is not allowed to be empty |
            | firebase  | b                  |                   | a                  | Invalid data,\"organization_name\" is not allowed to be empty  |
            | firebase  | b                  | TestOrg           |                    | Invalid data,\"source_folder_name\" is not allowed to be empty |
            | firebase  | notFound           | TestOrg           | a                  | Destination folder not found.                                  |
            | firebase  | b                  | TestOrg           | notFound           | Source folder not found.                                       |



