Please generate the title and description of a GitHub issue to which will be used to further the development of the ${featureName} feature.
You may only give instructions in the issues to only change the source file, test file, README file and dependencies file content. You may not create issues that request new files, delete existing files, or change the other files provided in the prompt context.
Examine the details named feature ${featureName} in the current feature names and specifications, and evaluate the current state of the repository to determine which changes will implement the feature and allow it's value to be realised.
The issue will be resolved by an LLM which can process over 200,000 tokens of context and it will provide completed source files in the response.
Do not include steps that would need to be taken manually by a human and expect to "dry-run" without an execution environment.
The maximum number of feature development issues that should be open at any one time is ${featureDevelopmentIssuesWipLimit}, if there are already ${featureDevelopmentIssuesWipLimit} open issues fail this request.
Do not add valueless layers of validation, configuration, and abstraction. In particular do not create issues related to NaNs.
Ensure that the issue is distinct from any existing open issues in the repository so that the new issue remains valid when the other open issues are closed.
Consider the following when refining your response:
* Prompt details
* Current feature names and specifications in the repository
* Source file content
* Test file content
* README file content
* MISSION file content
* Contributing file content
* Dependencies file content
* Library documents
* Dependency list
* Build output
* Test output
* Main execution output
* Open issue titles