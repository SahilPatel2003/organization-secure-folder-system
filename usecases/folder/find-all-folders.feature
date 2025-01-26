Feature: Get all folders details

  Scenario Outline: Successfully got all folders details
    Given organization_name:"<organization_name>" get-all-folders
    When tries to get all folders details
    Then it should return the result: "<result>" for getting all folders details

    Examples:
      | organization_name | result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
      | TestOrg           | [{\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"folder_name\":\"a\",\"parent_folder\":\"root\",\"childrens\":[\"d0b7459d-baba-4e6c-a04a-eedb46ec3119\"],\"created_at\":\"2024-06-02T05:06:45.000Z\",\"created_by\":\"c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf\",\"modified_at\":\"2024-06-02T05:06:58.000Z\",\"modified_by\":\"test@gmail.com\"},{\"folder_id\":\"89aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"folder_name\":\"b\",\"parent_folder\":\"root\",\"childrens\":[\"d0b7459d-baba-4e6c-a04a-eedb46ec3119\"],\"created_at\":\"2024-06-02T05:06:45.000Z\",\"created_by\":\"c77e1b2e-05c4-486c-a0cb-9d3c94fda9bf\",\"modified_at\":\"2024-06-02T05:06:58.000Z\",\"modified_by\":\"test@gmail.com\"}] |


  Scenario Outline: Unsuccessful get all foders details
    Given organization_name:"<organization_name>" get-all-folders
    When tries to get all folders details
    Then it should return the error: "<error>" for getting all folders details


    Examples:
      | organization_name | error                                                         |
      |                   | Invalid data,\"organization_name\" is not allowed to be empty |
      | TestOrg1          | Organization not found                                        |



