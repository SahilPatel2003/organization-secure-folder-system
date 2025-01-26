Feature: Grant permission from admin

    Scenario Outline: Successfully granted permission
        Given url:"<url>", grant-permission
        When the admin grants permission
        Then it should return the result: "<result>" for granting permission

        Examples:
            | url                | result                      |
            | grantpermissionurl | Role assigned successfully. |


    Scenario Outline: Unsuccessful grant permission
        Given url:"<url>", grant-permission
        When the admin grants permission
        Then it should return the error: "<error>" for granting permission

        Examples:
            | url                 | error          |
            | grantpermissionurl1 | Invalid token. |
