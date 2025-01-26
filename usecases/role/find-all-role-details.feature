Feature: Get all roles details of organization

  Scenario Outline: Successfully got all roles details
    Given organization_name:"<organization_name>" get-all-role-details
    When tries to get all roles details
    Then it should return the result: "<result>" for getting all roles details

    Examples:
      | organization_name | result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
      | TestOrg           | [{\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"TestOrg\",\"name\":\"roles3\",\"description\":\"you have this permissions\",\"permissions\":\"1111\",\"folders\":\"c\",\"created_at\":\"2024-05-31T08:32:38.000Z\",\"modified_at\":\"2024-06-01T08:32:38.000Z\",\"created_by\":\"c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf\"},{\"role_id\":\"755c6251-19b7-4499-88ae-487d7e31a11d\",\"organization_name\":\"TestOrg\",\"name\":\"roles3\",\"description\":\"you have this permissions\",\"permissions\":\"1111\",\"folders\":\"c\",\"created_at\":\"2024-05-31T08:32:38.000Z\",\"modified_at\":\"2024-06-01T08:32:38.000Z\",\"created_by\":\"c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf\"}] |


  Scenario Outline: Unsuccessful get all roles  details
    Given organization_name:"<organization_name>" get-all-role-details
    When tries to get all roles details
    Then it should return the error: "<error>" for getting all roles details


    Examples:
      | organization_name | error                                                         |
      |                   | Invalid data,\"organization_name\" is not allowed to be empty |
      | TestOrg1          | organization not found                                        |
      | NoRoles           | Roles not found                                               |



