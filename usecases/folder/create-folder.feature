Feature: create folder

    Scenario Outline: Successfully created folder
        Given folder_name:"<folder_name>", parent_folder:"<parent_folder>", organization_name:"<organization_name>" create-folder
        When tries to create folder
        Then it should return the result: "<result>" for creating the folder

        Examples:
            | folder_name | parent_folder | organization_name | result                       |
            | a           | root          | testorg           | Folder created successfully. |
            | b           | a             | testorg           | Folder created successfully. |
            | c           | a             | testorg           | Folder created successfully. |
            | e           | root          | testorg           | Folder created successfully. |


    Scenario Outline: Unsuccessful create folder
        Given folder_name:"<folder_name>", parent_folder:"<parent_folder>", organization_name:"<organization_name>" create-folder
        When tries to create folder
        Then it should return the error: "<error>" for creating the folder


        Examples:
            | folder_name | parent_folder | organization_name | error                                                                        |
            |             | root          | testorg           | Invalid folder data,\"folder_name\" is not allowed to be empty               |
            | a           |               | testorg           | Invalid folder data,\"parent_folder\" is not allowed to be empty             |
            | a           | root          |                   | Invalid folder data,\"organization_name\" is not allowed to be empty         |
            | dublicate   | root          | testorg           | You don't have permission to create this resource because it already exists. |
            | c           | e             | testorg           | Parent folder not found.                                                     |
