Feature: Get all users from organization

    Scenario Outline: Successfully got all users from organization
        Given organization_name:"<organization_name>" get all users from organization
        When tries to get all users form organization
        Then it should return the result: "<result>" for getting all users from organization

        Examples:
            | organization_name | result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
            | TestOrg           | [{\"user_id\":\"8a21822b-df66-42d5-90df-fa7b2bfdb589\",\"organization_name\":\"TestOrg\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"username\":\"ass\",\"email\":\"mandanisahil@gmail.com\",\"is_admin\":1,\"user_status\":0,\"created_at\":\"2024-06-01T09:21:03.000Z\",\"created_by\":\"c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf\",\"invitation_accepted_at\":\"2024-06-0T09:21:03.000Z\",\"modified_at\":\"2024-06-01T09:21:03.000Z\"},{\"user_id\":\"8a21822b-df66-42d5-90df-fa7b2bfdb589\",\"organization_name\":\"TestOrg\",\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"username\":\"nayan\",\"email\":\"mandanisahil@gmail.com\",\"is_admin\":0,\"user_status\":0,\"created_at\":\"2024-06-01T09:21:03.000Z\",\"created_by\":\"c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf\",\"invitation_accepted_at\":\"2024-06-0T09:21:03.000Z\",\"modified_at\":\"2024-06-01T09:21:03.000Z\"}] |


    Scenario Outline: Unsuccessful get all users from organization
        Given organization_name:"<organization_name>" get all users from organization
        When tries to get all users form organization
        Then it should return the error: "<error>" for getting all users from organization


        Examples:
            | organization_name | error                                                         |
            |                   | Invalid data,\"organization_name\" is not allowed to be empty |
            | TestOrg1          | organization not found                                        |

