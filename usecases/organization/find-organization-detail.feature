Feature: Get organization details

    Scenario Outline: Successfully got organization details
        Given organization_name:"<organization_name>" get organization details
        When tries to get organization details
        Then it should return the result: "<result>" for getting organization details

        Examples:
            | organization_name | result                                                                                                                                                                         |
            | TestOrg           | {\"organization_id\":\"f821e8ee-4a66-438a-be7c-c36890413e2d\",\"organization_name\":\"TestOrg\",\"created_by\":\"test@gmail.com\",\"created_at\":\"2024-05-31T08:26:06.000Z\"} |


    Scenario Outline: Unsuccessful get organization details
        Given organization_name:"<organization_name>" get organization details
        When tries to get organization details
        Then it should return the error: "<error>" for getting organization details


        Examples:
            | organization_name | error                                                         |
            |                   | Invalid data,\"organization_name\" is not allowed to be empty |
            | TestOrg1          | Organization not found                                        |

