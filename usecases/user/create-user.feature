Feature: Register user

  Scenario Outline: Successfully register user
    Given username:"<username>", password:"<password>" create-user
    When try to add user
    Then it should return the result: "<result>" for add user

    Examples:
      | username | password  | result                            |
      | user     | password1 | You have successfully registered. |


  Scenario Outline: Unsuccessful register user
    Given username:"<username>", password:"<password>" create-user
    When try to add user
    Then it should return the error: "<error>" for add user


    Examples:
      | username | password  | error                                                     |
      |          | password3 | Invalid user data,\"username\" is not allowed to be empty |
      | user     |           | Invalid user data,\"password\" is not allowed to be empty |
      | user     | password2 | You are already registered, now you can't do it.          |
