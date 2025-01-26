Feature: Register admin

  Scenario Outline: Successfully register admin
    Given organization_name:"<organization_name>", username:"<username>", email:"<email>", password:"<password>" create-admin
    When try to add admin
    Then it should return the result: "<result>" for add admin

    Examples:
      | organization_name | username | email              | password  | result                            |
      | TestOrg           | admin    | admin@example1.com | password1 | You have successfully registered. |


  Scenario Outline: Unsuccessful register Admin
    Given organization_name:"<organization_name>", username:"<username>", email:"<email>", password:"<password>" create-admin
    When try to add admin
    Then it should return the error: "<error>" for add admin


    Examples:
      | organization_name | username | email              | password  | error                                                               |
      |                   | admin    | admin@example1.com | password1 | Invalid user data,\"organization_name\" is not allowed to be empty  |
      | TestOrg           |          | admin@example1.com | password1 | Invalid user data,\"username\" is not allowed to be empty           |
      | TestOrg           | admin    |                    | password1 | Invalid user data,\"email\" is not allowed to be empty              |
      | TestOrg           | admin    | admin@example1.com |           | Invalid user data,\"password\" is not allowed to be empty           |
      | TestOrg           | admin    | admin@example2.com | password1 | This email is already associated with a registered company.         |
      | TestOrg1          | admin    | admin@example1.com | password1 | This organization_name is already taken. Please choose another one. |
