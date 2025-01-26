Feature: Send mail to users to invite them to join an organization

  Scenario Outline: Successfully send mail to users
    Given to:"<to>" send-mail
    When the admin sends an invite mail to users
    Then it should return the result: "<result>" for sending invite mail

    Examples:
      | to                                                            | result                  |
      | {\"test@gmail.com\":\"16b2eb4c-f8eb-44b5-bc04-572592d16e2c\"} | Mail sent successfully. |


  Scenario Outline: Unsuccessful send mail to users
    Given to:"<to>" send-mail
    When the admin sends an invite mail to users
    Then it should return the error: "<error>" for sending invite mail


    Examples:
      | to                                                                                                                        | error                                                           |
      |                                                                                                                           | invalid data: 'to' must be a valid JSON object.                 |
      | {}                                                                                                                        | invalid data: \"value\" must have at least 1 key                |
      | {\"test@gmail.com\":\"16b2eb4c-f8eb-44b5-bc04-572592d16e2c\",\"test@gmail.com\":\"c60a40cc-ef95-4205-afe5-c9be0ec2b7d1\"} | Duplicate emails found: test@gmail.com                          |
      | {\"test1@gmail.com\":\"16b2eb4c-f8eb-44b5-bc04-572592d16e2c\"}                                                            | Duplicate emails found within the organization: test1@gmail.com |
      | {\"test@gmail.com\":\"16b2eb4c-f8eb-44b5-bc04-572592d16123\"}                                                             | Role with ID 16b2eb4c-f8eb-44b5-bc04-572592d16123 not found     |

