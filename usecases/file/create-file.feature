Feature: Create file

  Scenario Outline: Successfully created file
    Given file_name:"<file_name>", path:"<path>", parent_folder:"<parent_folder>", organization_name:"<organization_name>" create-file
    When tries to create file
    Then it should return the result: "<result>" for creating file

    Examples:
      | file_name | path                       | parent_folder | organization_name | result                     |
      | firebase  | images/Frame 427321239.png | a             | TestOrg           | file created successfully. |


  Scenario Outline: Unsuccessful create file
    Given file_name:"<file_name>", path:"<path>", parent_folder:"<parent_folder>", organization_name:"<organization_name>" create-file
    When tries to create file
    Then it should return the error: "<error>" for creating file


    Examples:
      | file_name     | path                       | parent_folder | organization_name | error                                                                                       |
      |               | images/Frame 427321239.png | a             | TestOrg           | Invalid file data,\"file_name\" is not allowed to be empty                                  |
      | firebase      |                            | a             | TestOrg           | Invalid file data,\"size\" is required                                                      |
      | firebase      | images/Frame 427321239.png |               | TestOrg           | Parent folder not found.                                                                    |
      | firebase      | images/Frame 427321239.png | a             |                   | Invalid file data,\"organization_name\" is not allowed to be empty                          |
      | dublicatefile | images/Frame 427321239.png | a             | TestOrg           | You don't have permission to create this resource because it already exists in same folder. |
      | firebase      | images/max 427321239.png   | x             |                   | File size exceeds the limit of 20 MB                                                        |
      | firebase      | ppt/Frame 427321239.ppt    | x             |                   | Unsupported file type. Only PNG images, PDF documents, and plain text files are allowed.    |
