Feature: Get role details

    Scenario Outline: Successfully got role details
        Given role_id:"<role_id>" to  get-role-detail
        When tries to get role details
        Then it should return the result: "<result>" for getting role details

        Examples:
            | role_id                              | result                                                                                                                                                                                                                                                                                                                                                 |
            | 8edab200-3f19-4f2e-9178-c3626d06347b | {\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"TestOrg\",\"name\":\"roles3\",\"description\":\"you have this permissions\",\"permissions\":\"1111\",\"folders\":\"c\",\"created_at\":\"2024-05-31T08:32:38.000Z\",\"modified_at\":\"2024-06-01T08:32:38.000Z\",\"created_by\":\"c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf\"} |


    Scenario Outline: Unsuccessful get role details
        Given role_id:"<role_id>" to  get-role-detail
        When tries to get role details
        Then it should return the error: "<error>" for getting role details


        Examples:
            | role_id                              | error                                               |
            |                                      | Invalid data,\"role_id\" is not allowed to be empty |
            | 99dab200-3f19-4f2e-9178-c3626d06347b | Role not found                                      |



