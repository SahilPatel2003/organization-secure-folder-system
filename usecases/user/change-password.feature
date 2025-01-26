Feature: Change Password

  Scenario Outline: Successfully changed password
    Given password:"<password>", url:"<url>" change-password
    When try to change the password
    Then it should return the result: "<result>" for changing the password

    Examples:
      | password  | url               | result                         |
      | password1 | changepasswordurl | Password updated successfully. |


  Scenario Outline: Unsuccessful change password
    Given password:"<password>", url:"<url>" change-password
    When try to change the password
    Then it should return the error: "<error>" for changing the password


    Examples:
      | password   | url               | error                                                                   |
      |            | changepasswordurl | Invalid data, \"password\" is not allowed to be empty                   |
      | user       |                   | Invalid data, \"url\" is not allowed to be empty                        |
      | secondtime | changepasswordurl | The link to change your password has expired. Please request a new one. |
