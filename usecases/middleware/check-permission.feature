Feature: verify user or admin and check permissions for user

    Scenario Outline: Successfully verified user
        Given path:"<path>", token:"<token>", data:"<data>" check-permissions
        When tries to verify user
        Then it should return the result: "<result>" for verified user

        Examples:
            | path               | token                                                                                                                                         | data                           | result                      |
            | drive/createFolder | {\"user_id\":\"f821e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"parent_folder\":\"a\"}      | User verified successfully. |
            | drive/deletefolder | {\"user_id\":\"f821e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"folder_name\":\"a\"}        | User verified successfully. |
            | drive/moveFolder   | {\"user_id\":\"f821e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"source_folder_name\":\"a\"} | User verified successfully. |
            | drive/createfolder | {\"user_id\":\"ff21e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"222c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"parent_folder\":\"c\"}      | User verified successfully. |
            | drive/deletefolder | {\"user_id\":\"ff21e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"22226251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"folder_name\":\"c\"}        | User verified successfully. |



    Scenario Outline: Unsuccessful verify user
        Given path:"<path>", token:"<token>", data:"<data>" check-permissions
        When tries to verify user
        Then it should return the error: "<error>" for unverify user


        Examples:
            | path               | token                                                                                                                                         | data                                  | error                                              |
            |                    | {\"user_id\":\"f821e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"parent_folder\":\"a\"}             | Invalid data,\"path\" is not allowed to be empty   |
            | drive/createfolder |                                                                                                                                               | {\"parent_folder\":\"a\"}             | Invalid data,\"token\" is not allowed to be empty  |
            | drive/createfolder | {\"user_id\":\"f821e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} |                                       | Invalid data,\"data\" must be of type object       |
            | drive/createfolder | {\"user_id\":\"f821e8ee-4a66-438a-be7c-c36890413e22\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"parent_folder\":\"a\"}             | Invalid token                                      |
            | drive/createfolder | {\"user_id\":\"ff21e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"parent_folder\":\"notFound\"}      | Parent folder not found.                           |
            | drive/createfolder | {\"user_id\":\"ff21e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"parent_folder\":\"root\"}          | You don't have permission to access this resource. |
            | drive/moveFolder   | {\"user_id\":\"ff21e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"source_folder_name\":\"notFound\"} | Source folder not found.                           |
            | drive/deletefolder | {\"user_id\":\"ff21e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"folder_name\":\"notFound\"}        | The folder you are trying to delete was not found  |
            | drive/createfolder | {\"user_id\":\"ff21e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"225c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"parent_folder\":\"root\"}          | You don't have permission to access this resource. |
            | drive/moveFolder   | {\"user_id\":\"ff21e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"335c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"source_folder_name\":\"root\"}     | You don't have permission to access this resource. |
            | drive/deletefolder | {\"user_id\":\"ff21e8ee-4a66-438a-be7c-c36890413e2d\",\"role_id\":\"445c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"testorg\"} | {\"folder_name\":\"root\"}            | You don't have permission to access this resource. |