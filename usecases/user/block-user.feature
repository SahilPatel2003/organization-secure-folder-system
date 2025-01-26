Feature: Block user

  Scenario Outline: Successfully blocked user
    Given blocked_user_id: "<blocked_user_id>" block-user
    When the admin tries to block a user
    Then it should return the result: "<result>" for blocking user

    Examples:
      | blocked_user_id                      | result                     |
      | c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf | User successfully blocked. |


  Scenario Outline: Unsuccessful block user
    Given blocked_user_id: "<blocked_user_id>" block-user
    When the admin tries to block a user
    Then it should return the error: "<error>" for blocking user


    Examples:
      | blocked_user_id | error                                                        |
      |                 | Invalid data: \"blocked_user_id\" is not allowed to be empty |
