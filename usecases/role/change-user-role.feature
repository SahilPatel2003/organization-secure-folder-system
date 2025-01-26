Feature: Change Role By Admin

    Scenario Outline: Successfully changed role
        Given assigned_user_id:"<assigned_user_id>", role_id:"<role_id>", change-user-role
        When the admin change the role
        Then it should return the result: "<result>" for changing role

        Examples:
            | assigned_user_id                     | role_id                              | result                          |
            | 8edab200-3f19-4f2e-9178-c3626d06347b | 755c6251-19b7-4499-88ae-487d7e31a11d | User role updated successfully. |


    Scenario Outline: Unsuccessful change role
        Given assigned_user_id:"<assigned_user_id>", role_id:"<role_id>", change-user-role
        When the admin change the role
        Then it should return the error: "<error>" for changing role


        Examples:
            | assigned_user_id                     | role_id                              | error                                                |
            |                                      | 755c6251-19b7-4499-88ae-487d7e31a11d | Invalid data: \"user_id\" is not allowed to be empty |
            | 8edab200-3f19-4f2e-9178-c3626d0634   | 755c6251-19b7-4499-88ae-487d7e31a11d | Invalid data: \"user_id\" must be a valid GUID       |
            | f821e8ee-4a66-438a-be7c-c36890413e2d |                                      | Invalid data: \"role_id\" is not allowed to be empty |
            | 8edab200-3f19-4f2e-9178-c3626d06347b | 755c6251-19b7-4499-88ae-487d7e31a1   | Invalid data: \"role_id\" must be a valid GUID       |
            | f821e8ee-4a66-438a-be7c-c36890413e22 | 8edab200-3f19-4f2e-9178-c3626d063471 | Assigned user is not present in the organization.    |
            | f821e8ee-4a66-438a-be7c-c36890413e2d | 8edab200-3f19-4f2e-9178-c3626d063471 | Role not found.                                      |



