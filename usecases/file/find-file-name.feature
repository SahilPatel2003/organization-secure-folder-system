Feature: search file names and get files into range

    Scenario Outline: Successfully got files
        Given organization_name:"<organization_name>", file_name_prefix:"<file_name_prefix>", from_index:"<from_index>", to_index:"<to_index>" search-file-name
        When tries to search file names and get files into range
        Then it should return the result: "<result>" for get searched files

        Examples:
            | organization_name | file_name_prefix | from_index | to_index | result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
            | TestOrg           |                  |            |          | {\"files\":[{\"file_id\":\"d618f0e1-99f7-4d84-8fa0-9841a3432647\",\"file_name\":\"firebase\",\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"size\":125223,\"type\":\"image/png\",\"path\":\"images/Frame 427321239.png\"},{\"file_id\":\"d618f0e1-99f7-4d84-8fa0-9841a3432647\",\"file_name\":\"firebase1\",\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"size\":125223,\"type\":\"image/png\",\"path\":\"images/Frame 427321239.png\"},{\"file_id\":\"d618f0e1-99f7-4d84-8fa0-9841a3432647\",\"file_name\":\"base\",\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"size\":125223,\"type\":\"image/png\",\"path\":\"images/Frame 427321239.png\"}],\"total_files\":3} |

            | TestOrg | firebase |   |   | {\"files\":[{\"file_id\":\"d618f0e1-99f7-4d84-8fa0-9841a3432647\",\"file_name\":\"firebase\",\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"size\":125223,\"type\":\"image/png\",\"path\":\"images/Frame 427321239.png\"},{\"file_id\":\"d618f0e1-99f7-4d84-8fa0-9841a3432647\",\"file_name\":\"firebase1\",\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"size\":125223,\"type\":\"image/png\",\"path\":\"images/Frame 427321239.png\"}],\"total_files\":3} |
            | TestOrg | firebase | 1 | 1 | {\"files\":[{\"file_id\":\"d618f0e1-99f7-4d84-8fa0-9841a3432647\",\"file_name\":\"firebase1\",\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"size\":125223,\"type\":\"image/png\",\"path\":\"images/Frame 427321239.png\"}],\"total_files\":3}                                                                                                                                                                                                                                                           |
            | TestOrg | a        | 0 | 3 | {\"files\":[{\"file_id\":\"d618f0e1-99f7-4d84-8fa0-9841a3432647\",\"file_name\":\"firebase\",\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"size\":125223,\"type\":\"image/png\",\"path\":\"images/Frame 427321239.png\"},{\"file_id\":\"d618f0e1-99f7-4d84-8fa0-9841a3432647\",\"file_name\":\"firebase1\",\"folder_id\":\"76aa1dd2-9b08-479b-8a1f-ef1f972d5d52\",\"organization_name\":\"TestOrg\",\"size\":125223,\"type\":\"image/png\",\"path\":\"images/Frame 427321239.png\"}],\"total_files\":3} |


    Scenario Outline: Unsuccessful get files
        Given organization_name:"<organization_name>", file_name_prefix:"<file_name_prefix>", from_index:"<from_index>", to_index:"<to_index>" search-file-name
        When tries to search file names and get files into range
        Then it should return the error: "<error>" for get searched files


        Examples:
            | organization_name | file_name_prefix | from_index | to_index | error                                                         |
            |                   | a                | 0          | 0        | Invalid data,\"organization_name\" is not allowed to be empty |
            | TestOrg1          | a                | 0          | 1        | Organization not found                                        |
            | TestOrg           | a                | 0          | -1       | Invalid to_index specified                                    |
            | TestOrg           | a                | 3          | 2        | Invalid to_index specified                                    |
            | TestOrg           | a                | -1         | 3        | Invalid from_index specified                                  |
            | TestOrg           | a                | aaa        | 2        | Invalid from_index specified                                  |
            | TestOrg           | a                | 2          | bbb      | Invalid to_index specified                                    |
            | fileNotFound      | a                | 0          | 3        | No files found with the specified criteria.                   |



