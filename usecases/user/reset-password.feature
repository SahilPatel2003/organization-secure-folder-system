Feature: Send mail for reset password

  Scenario Outline: Successfully send reset password mail
    Given organization_name:"<organization_name>", email:"<email>" reset-password
    When sends a reset password mail
    Then it should return the result: "<result>" for send mail reset password

    Examples:
      | organization_name | username | email              | result                                  |
      | TestOrg           | admin    | admin@example1.com | Password reset email sent successfully. |


  Scenario Outline: Unsuccessfully send reset password mail
    Given organization_name:"<organization_name>", email:"<email>" reset-password
    When sends a reset password mail
    Then it should return the error: "<error>" for send mail reset password


    Examples:
      | organization_name | email              | error                                                               |
      |                   | admin@example1.com | Invalid user data, \"organization_name\" is not allowed to be empty |
      | TestOrg           |                    | Invalid user data, \"email\" is not allowed to be empty             |

