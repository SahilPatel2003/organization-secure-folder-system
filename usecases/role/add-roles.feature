Feature: Create Role By Admin

  Scenario Outline: Successfully created role
    Given name:"<name>", description:"<description>", permissions:"<permissions>", folders:"<folders>" add-role
    When the admin create role
    Then it should return the result: "<result>" for creating role

    Examples:
      | name  | description               | permissions | folders | result                   |
      | role1 | you have this permissions | 1101        | a,b     | Role added successfully. |


  Scenario Outline: Unsuccessful create role
    Given name:"<name>", description:"<description>", permissions:"<permissions>", folders:"<folders>" add-role
    When the admin create role
    Then it should return the error: "<error>" for creating role


    Examples:
      | name  | description               | permissions | folders | error                                                        |
      |       | you have this permissions | 1101        | a,b     | Invalid role data,\"name\" is not allowed to be empty        |
      | role1 |                           | 1101        | a,b     | Invalid role data,\"description\" is not allowed to be empty |
      | role1 | you have this permissions |             | a,b     | Invalid role data,\"permissions\" is not allowed to be empty |
      | role1 | you have this permissions | 1101        |         | Invalid role data,\"folders\" is not allowed to be empty     |


