Feature: Send mail to admin to request permission to assign a different role for a specific time to another user

    Scenario Outline: Successfully assigned role
        Given assigned_user_id:"<assigned_user_id>", role_id:"<role_id>", expiration_time:"<expiration_time>" take-permission-from-admin
        When the user tries to send an email to the admin to change the role of another user
        Then it should return the result: "<result>" for sending mail

        Examples:
            | assigned_user_id                     | role_id                              | expiration_time     | result                                             |
            | 8edab200-3f19-4f2e-9178-c3626d06347b | 755c6251-19b7-4499-88ae-487d7e31a11d | 2024-05-28 21:50:00 | Permission request sent successfully to the admin. |


    Scenario Outline: Unsuccessful assign role
        Given assigned_user_id:"<assigned_user_id>", role_id:"<role_id>", expiration_time:"<expiration_time>" take-permission-from-admin
        When the user tries to send an email to the admin to change the role of another user
        Then it should return the error: "<error>" for sending mail


        Examples:
            | assigned_user_id                     | role_id                              | expiration_time     | error                                                                        |
            |                                      | 755c6251-19b7-4499-88ae-487d7e31a11d | 2024-05-28 21:50:00 | Invalid data: \"assigned_user_id\" is not allowed to be empty                |
            | 8edab200-3f19-4f2e-9178-c3626d0634   | 755c6251-19b7-4499-88ae-487d7e31a11d | 2024-05-28 21:50:00 | Invalid data: \"assigned_user_id\" must be a valid GUID                      |
            | 8edab200-3f19-4f2e-9178-c3626d06347b |                                      | 2024-05-28 21:50:00 | Invalid data: \"role_id\" is not allowed to be empty                         |
            | 8edab200-3f19-4f2e-9178-c3626d06347b | 755c6251-19b7-4499-88ae-487d7e31a1   | 2024-05-28 21:50:00 | Invalid data: \"role_id\" must be a valid GUID                               |
            | 8edab200-3f19-4f2e-9178-c3626d06347b | 755c6251-19b7-4499-88ae-487d7e31a11d |                     | Invalid data: \"expiration_time\" is not allowed to be empty                 |
            | 8edab200-3f19-4f2e-9178-c3626d06347b | 755c6251-19b7-4499-88ae-487d7e31a11d | 2024-05-28 50:00    | Invalid data: expiration_time with value fails to match the required pattern |
            | 8edab200-3f19-4f2e-9178-c3626d063477 | 755c6251-19b7-4499-88ae-487d7e31a11d | 2024-05-28 21:50:00 | Assigned user_id not found for the given organization.                       |
            | 8edab200-3f19-4f2e-9178-c3626d06347b | 755c6251-19b7-4499-88ae-487d7e31a111 | 2024-05-28 21:50:00 | Role not found for the given organization.                                   |
