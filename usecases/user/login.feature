Feature: Login user

  Scenario Outline: Successfully login user
    Given organization_name:"<organization_name>", email:"<email>", password:"<password>", rememberMe:"<rememberMe>" login
    When the user attempts to login
    Then it should return the result: "<result>" for login

    Examples:
      | organization_name | email             | password  | rememberMe | result                       |
      | TestOrg           | user1@example.com | password1 | false      | User logged in successfully. |
      | TestOrg           | user1@example.com | password1 | true       | User logged in successfully. |


  Scenario Outline: Unsuccessful login user
    Given organization_name:"<organization_name>", email:"<email>", password:"<password>", rememberMe:"<rememberMe>" login
    When the user attempts to login
    Then it should return the error: "<error>" for login


    Examples:
      | organization_name | email              | password   | rememberMe | error                                                                        |
      |                   | admin@example1.com | password1  | false      | Invalid input data: \"organization_name\" is not allowed to be empty         |
      | TestOrg           |                    | password1  | false      | Invalid input data: \"email\" is not allowed to be empty                     |
      | TestOrg           | admin@example1.com |            | false      | Invalid input data: \"password\" is not allowed to be empty                  |
      | TestOrg           | admin@example1.com |            | false      | Invalid input data: \"password\" is not allowed to be empty                  |
      | not-found         | admin@example1.com | password1  | false      | Organization not found. Please provide a valid organization name.            |
      | TestOrg           | notfound@gmail.com | password1  | false      | User not found in the specified organization. Please check your credentials. |
      | TestOrg           | admin@example1.com | notMatched | false      | Incorrect password.                                                          |

