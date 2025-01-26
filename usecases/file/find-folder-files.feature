Feature: Get all files of folder

    Scenario Outline: Successfully got folders files
        Given organization_name:"<organization_name>", folder_name:"<folder_name>" get-folder-files
        When tries to get folder files details
        Then it should return the result: "<result>" for getting all file details of folder

        Examples:
            | organization_name | folder_name | result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
            | TestOrg           | a           | [{\"file_id\":\"d618f0e1-99f7-4d84-8fa0-9841a3432647\",\"file_name\":\"firebase\",\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"size\":125223,\"type\":\"image/png\",\"path\":\"images/Frame 427321239.png\",\"created_at\":\"2024-06-03T06:45:42.000Z\",\"created_by\":\"c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf\",\"modified_at\":\"2024-06-04T06:45:42.000Z\",\"modified_by\":\"c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf\"},{\"file_id\":\"d618f0e1-99f7-4d84-8fa0-9841a3432647\",\"file_name\":\"google\",\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"size\":125223,\"type\":\"image/png\",\"path\":\"images/Frame 427321239.png\",\"created_at\":\"2024-06-03T06:45:42.000Z\",\"created_by\":\"c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf\",\"modified_at\":\"2024-06-04T06:45:42.000Z\",\"modified_by\":\"c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf\"}] |


    Scenario Outline: Unsuccessful get file details
        Given organization_name:"<organization_name>", folder_name:"<folder_name>" get-folder-files
        When tries to get folder files details
        Then it should return the error: "<error>" for getting all file details of folder


        Examples:


            | organization_name | folder_name | error                                                        |
            |                   | a           | Invalid data,\"organizationName\" is not allowed to be empty |
            | TestOrg           |             | Invalid data,\"folder_name\" is not allowed to be empty      |
            | notFound          | a           | Organization not found                                       |
            | TestOrg           | notFound    | folder not found                                             |
            | TestOrg           | nofiles     | No files found in the folder.                                |
