Feature: search folder names and get folders into range

    Scenario Outline: Successfully got folders
        Given organization_name:"<organization_name>", folder_name_prefix:"<folder_name_prefix>", from_index:"<from_index>", to_index:"<to_index>" search-folder-name
        When tries to search folder names and get folders into range
        Then it should return the result: "<result>" for get searched folders

        Examples:
            | organization_name | folder_name_prefix | from_index | to_index | result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
            | TestOrg           |                    |            |          | {\"folders\":[{\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"folder_name\":\"a\",\"parent_folder\":\"root\",\"childrens\":[\"d0b7459d-baba-4e6c-a04a-eedb46ec3119\"]},{\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"folder_name\":\"aaa\",\"parent_folder\":\"root\",\"childrens\":[\"p0b7459d-baba-4e6c-a04a-eedb46ec3119\"]},{\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"folder_name\":\"b\",\"parent_folder\":\"root\",\"childrens\":[\"p0b7459d-baba-4e6c-a04a-eedb46ec3119\"]}],\"total_folders\":3} |
            | TestOrg           | a                  |            |          | {\"folders\":[{\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"folder_name\":\"a\",\"parent_folder\":\"root\",\"childrens\":[\"d0b7459d-baba-4e6c-a04a-eedb46ec3119\"]},{\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"folder_name\":\"aaa\",\"parent_folder\":\"root\",\"childrens\":[\"p0b7459d-baba-4e6c-a04a-eedb46ec3119\"]}],\"total_folders\":3}                                                                                                                                                                                                      |
            | TestOrg           | a                  | 1          | 1        | {\"folders\":[{\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"folder_name\":\"aaa\",\"parent_folder\":\"root\",\"childrens\":[\"p0b7459d-baba-4e6c-a04a-eedb46ec3119\"]}],\"total_folders\":3}                                                                                                                                                                                                                                                                                                                                                                                                           |
            | TestOrg           | a                  | 0          | 3        | {\"folders\":[{\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"folder_name\":\"a\",\"parent_folder\":\"root\",\"childrens\":[\"d0b7459d-baba-4e6c-a04a-eedb46ec3119\"]},{\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"folder_name\":\"aaa\",\"parent_folder\":\"root\",\"childrens\":[\"p0b7459d-baba-4e6c-a04a-eedb46ec3119\"]}],\"total_folders\":3}                                                                                                                                                                                                      |


    Scenario Outline: Unsuccessful get folders
        Given organization_name:"<organization_name>", folder_name_prefix:"<folder_name_prefix>", from_index:"<from_index>", to_index:"<to_index>" search-folder-name
        When tries to search folder names and get folders into range
        Then it should return the error: "<error>" for get searched folders


        Examples:
            | organization_name | folder_name_prefix | from_index | to_index | error                                                         |
            |                   | a                  | 0          | 0        | Invalid data,\"organization_name\" is not allowed to be empty |
            | TestOrg1          | a                  | 0          | 1        | Organization not found                                        |
            | TestOrg           | a                  | 0          | -1       | Invalid to_index specified                                    |
            | TestOrg           | a                  | 3          | 2        | Invalid to_index specified                                    |
            | TestOrg           | a                  | -1         | 3        | Invalid from_index specified                                  |
            | TestOrg           | a                  | aaa        | 2        | Invalid from_index specified                                  |
            | TestOrg           | a                  | 2          | bbb      | Invalid to_index specified                                    |
            | folderNotFound    | a                  | 0          | 3        | No folder found in the specified range and organization.      |



