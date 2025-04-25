# JMETER_MANUAL

## Crawl Summary
Sections include precise headings: 1. GETTING STARTED (Overview, Requirements, Optional, Installation, Running and Configuring JMeter including CLI mode with full command-line options), 2. BUILDING A TEST PLAN (Element management, saving and error reporting), 3. ELEMENTS OF A TEST PLAN (Thread Groups, Controllers with Samplers, Logic Controllers, Test Fragments, Listeners, Timers, Assertions, Config Elements, Pre and Post-Processors, Execution order, Scoping, and Variables), 4. WEB TEST PLAN (Users, HTTP properties, Cookies, HTTP Requests, Listeners, Login), 5. ADVANCED WEB TEST PLAN (Session Handling, Header Manager), 6. DATABASE TEST PLAN (Users, JDBC Requests, Listeners), 7. FTP TEST PLAN (Users, FTP request defaults, FTP Requests, Listeners), 8A/8B. LDAP TEST PLAN (User addition, Login Config, LDAP Request Defaults/Extended Defaults, LDAP Requests, Response Assertions, Listeners), 9. WEBSERVICE TEST PLAN, 10. JMS Point-to-Point, 11. JMS Topic and Programmatic Test Plan, 12. LISTENERS, 13. REMOTE TESTING, 14. DASHBOARD REPORT (Overview, Dashboard Generation, Reporting, Graph Configuration, Enhancements), 15. REAL TIME RESULTS, 16. BEST PRACTICES, 17. TROUBLESHOOTING LOAD TESTING, 18. COMPONENT REFERENCE, 19. PROPERTIES, 20. FUNCTIONS, 21. REGULAR EXPRESSIONS, 22. HINTS AND TIPS, 23. GLOSSARY, 24. CURL (command entry, options, examples), 25. HISTORY/FUTURE.

## Normalised Extract
TABLE OF CONTENTS
  1. GETTING STARTED
    - Overview: Test plan building, load testing execution and analysis.
    - Requirements: Java Version and Operating Systems details.
    - Optional: Java Compiler, SAX XML Parser, Email Support, SSL Encryption, JDBC Driver, JMS client, ActiveMQ JMS libraries.
    - Installation: Steps to install JMeter.
    - Running JMeter: Including classpath configuration, creating test plan from template, proxy configuration, CLI mode usage, server mode, property overrides, logging, full command-line options and shutdown procedures.
    - Configuring JMeter: Detailed configuration parameters.
  2. BUILDING A TEST PLAN
    - Element Management: Adding, removing, loading, saving elements.
    - Configuring Tree Elements: Editing and saving test plans, running tests, stopping tests, error reporting.
  3. ELEMENTS OF A TEST PLAN
    - Thread Group: Defines concurrent user simulation.
    - Controllers: Samplers, Logic Controllers for flow control, Test Fragments for reusable sections.
    - Listeners: Capturing and storing results.
    - Timers: Setting delays between requests.
    - Assertions: Validating responses.
    - Configuration Elements: Global settings for requests.
    - Pre-Processor Elements and Post-Processor Elements: For request modification and result extraction.
    - Execution Order: Sequence details.
    - Scoping Rules and Variable Handling: Properties management and parameterisation.
  4. WEB TEST PLAN
    - User management, default HTTP request properties, cookie support, HTTP Request configuration, listener setup, and login procedures.
  5. ADVANCED WEB TEST PLAN
    - URL Rewriting for session handling and Header Manager usage.
  6. DATABASE TEST PLAN
    - User addition, JDBC Request configuration, listener integration.
  7. FTP TEST PLAN
    - FTP user configuration, default FTP request settings, FTP Request configuration, listener integration.
  8. LDAP TEST PLAN (8A & 8B)
    - User addition, login configuration, LDAP request defaults (and extended defaults), LDAP Request configuration, response assertion, listener integration.
  9. WEBSERVICE TEST PLAN
    - Steps to build and test webservice calls.
  10. JMS TEST PLANS
    - JMS Point-to-Point and JMS Topic test configuration.
  11. PROGRAMMATIC TEST PLAN
    - Methods to build test plans via code.
  12. DASHBOARD REPORT
    - Overview, dashboard generation configuration, report generation steps, default graphs, and improvements.
  13. BEST PRACTICES & TROUBLESHOOTING
    - Detailed guidelines for load testing best practices and troubleshooting commands.

Each section includes explicit configuration options such as CLI parameters (-n, -t, -l) and property override formats (using -Dproperty=value) with expected effects and precise instructions for deployment and testing.


## Supplementary Details
TECHNICAL SPECIFICATIONS AND IMPLEMENTATION DETAILS:
1. CLI Mode: Use command line 'jmeter -n -t <testplan.jmx> -l <results.jtl>' with options:
   - -n for non-GUI mode
   - -t to specify the test plan file
   - -l to log results
   - -Dproperty=value to override configuration properties
2. Classpath Configuration: Ensure JMeter's classpath includes all required libraries for the test elements and plugins.
3. Proxy Setup: Configure proxy settings by specifying proxy host, port via command-line or jmeter.properties file.
4. Server Mode: Start JMeter server using 'jmeter-server' script for distributed testing.
5. Dashboard Report Generation: Configure dashboard in jmeter.properties file; parameters include report generation intervals, default graph types, and output directories.
6. Troubleshooting: Execute 'jmeter -h' for CLI options; check logs in the 'bin' directory for error details; use commands like 'grep ERROR jmeter.log' to filter error messages.

## Reference Details
API SPECIFICATIONS AND METHOD SIGNATURES:

1. CLI Execution API:
   - Method: executeTestPlan(filePath: String, resultsPath: String, options: Map<String,String>): Process
     - Parameters:
         filePath: String (Test plan file in .jmx format)
         resultsPath: String (File path to store results in .jtl format)
         options: Map<String,String> (Additional CLI options like -Dproperty=value, proxy settings)
     - Returns: Process object representing the running test
     - Exceptions: Throws IOException on file not found, IllegalArgumentException for invalid options

2. Configuration API:
   - Method: loadConfiguration(file: String): Config
     - Parameters:
         file: String (Path to jmeter.properties)
     - Returns: Config object with key-value pairs of configuration parameters
     - Example Usage:
         Config cfg = loadConfiguration("jmeter.properties");
         String proxyHost = cfg.get("https.proxyHost");

3. Listener API:
   - Interface: TestResultListener
     - Method: onTestResult(result: TestResult): void
       - Parameters:
           result: TestResult (Contains response data, assertion outcomes, timing information)

4. Code Example for CLI Mode:
   // Example in Java:
   // import necessary classes
   public class JMeterRunner {
       public static void main(String[] args) {
           try {
               Process process = executeTestPlan("test.jmx", "result.jtl", Map.of("-Dhttp.proxyHost", "127.0.0.1", "-Dhttp.proxyPort", "8080"));
               process.waitFor();
               System.out.println("Test executed successfully");
           } catch (Exception e) {
               e.printStackTrace();
           }
       }
   }

5. Best Practices:
   - Always verify Java version compatibility (e.g., Java 8 or higher).
   - Run tests in non-GUI mode for performance.
   - Validate test plan structure before execution with pre-run simulations.
   - Utilize distributed testing via server mode to scale load tests.

6. Troubleshooting Procedures:
   - Command: jmeter -h 
     Expected Output: Detailed help message with all CLI options.
   - Check jmeter.log for error entries using: grep ERROR jmeter.log
   - If properties override fails, verify the command-line arguments using: echo $JVM_ARGS
   - For plugin errors, ensure the classpath includes the required jar files.


## Information Dense Extract
JMETER_USERMANUAL; Sections: 1-Getting Started (Overview, Requirements: Java, OS; Optional: Compiler, SAX, Email, SSL, JDBC, JMS, ActiveMQ), 1.4 Running (Classpath, Template, Proxy, CLI, Server, Properties override, Logging, Shutdown, CLI options); 2-Building Test Plan (Element add/remove, Load/Save, Tree Config, Error reporting); 3-Elements (Thread Group, Controllers [Samplers, Logic, Fragments], Listeners, Timers, Assertions, Config, Pre/Post Processors, Execution order, Scoping, Variables); 4-Web Test Plan (Users, HTTP defaults, Cookies, Requests, Listener, Login); 5-Advanced (URL rewriting, Header Manager); 6-Database (JDBC Requests, Listeners); 7-FTP; 8-LDAP (Basic & Extended: Login, Request Defaults, Response Assertion, Listener); 9-Webservice; 10-JMS (Point-to-Point, Topic); 11-Programmatic; 12-Listeners; 13-Remote Testing; 14-Dashboard Report (Generation, Graphs); Best Practices; CLI API: executeTestPlan(String, String, Map<String,String>) -> Process; Config API: loadConfiguration(String) -> Config; Listener Interface: onTestResult(TestResult); Code example provided; Troubleshooting via 'jmeter -h', log analysis, property verification.

## Sanitised Extract
TABLE OF CONTENTS
  1. GETTING STARTED
    - Overview: Test plan building, load testing execution and analysis.
    - Requirements: Java Version and Operating Systems details.
    - Optional: Java Compiler, SAX XML Parser, Email Support, SSL Encryption, JDBC Driver, JMS client, ActiveMQ JMS libraries.
    - Installation: Steps to install JMeter.
    - Running JMeter: Including classpath configuration, creating test plan from template, proxy configuration, CLI mode usage, server mode, property overrides, logging, full command-line options and shutdown procedures.
    - Configuring JMeter: Detailed configuration parameters.
  2. BUILDING A TEST PLAN
    - Element Management: Adding, removing, loading, saving elements.
    - Configuring Tree Elements: Editing and saving test plans, running tests, stopping tests, error reporting.
  3. ELEMENTS OF A TEST PLAN
    - Thread Group: Defines concurrent user simulation.
    - Controllers: Samplers, Logic Controllers for flow control, Test Fragments for reusable sections.
    - Listeners: Capturing and storing results.
    - Timers: Setting delays between requests.
    - Assertions: Validating responses.
    - Configuration Elements: Global settings for requests.
    - Pre-Processor Elements and Post-Processor Elements: For request modification and result extraction.
    - Execution Order: Sequence details.
    - Scoping Rules and Variable Handling: Properties management and parameterisation.
  4. WEB TEST PLAN
    - User management, default HTTP request properties, cookie support, HTTP Request configuration, listener setup, and login procedures.
  5. ADVANCED WEB TEST PLAN
    - URL Rewriting for session handling and Header Manager usage.
  6. DATABASE TEST PLAN
    - User addition, JDBC Request configuration, listener integration.
  7. FTP TEST PLAN
    - FTP user configuration, default FTP request settings, FTP Request configuration, listener integration.
  8. LDAP TEST PLAN (8A & 8B)
    - User addition, login configuration, LDAP request defaults (and extended defaults), LDAP Request configuration, response assertion, listener integration.
  9. WEBSERVICE TEST PLAN
    - Steps to build and test webservice calls.
  10. JMS TEST PLANS
    - JMS Point-to-Point and JMS Topic test configuration.
  11. PROGRAMMATIC TEST PLAN
    - Methods to build test plans via code.
  12. DASHBOARD REPORT
    - Overview, dashboard generation configuration, report generation steps, default graphs, and improvements.
  13. BEST PRACTICES & TROUBLESHOOTING
    - Detailed guidelines for load testing best practices and troubleshooting commands.

Each section includes explicit configuration options such as CLI parameters (-n, -t, -l) and property override formats (using -Dproperty=value) with expected effects and precise instructions for deployment and testing.

## Original Source
Performance Testing Documentation
https://jmeter.apache.org/usermanual/index.html

## Digest of JMETER_MANUAL

# JMETER USER MANUAL

Date Retrieved: 2023-10-14
Data Size: 70392148 bytes

## Overview
This document presents the technical details extracted from the Apache JMeter User Manual. It includes exact sections such as Getting Started, Building a Test Plan, Elements of a Test Plan, and several specialized test plan configurations (Web, Advanced Web, Database, FTP, LDAP, Extended LDAP, Webservice, JMS, and Programmatic Test Plans).

## Detailed Sections

### 1. GETTING STARTED
- 1.0 Overview
  - Test plan building
  - Load Test running
  - Load Test analysis
  - Let's start
- 1.1 Requirements
  - 1.1.1 Java Version
  - 1.1.2 Operating Systems
- 1.2 Optional Components
  - 1.2.1 Java Compiler
  - 1.2.2 SAX XML Parser
  - 1.2.3 Email Support
  - 1.2.4 SSL Encryption
  - 1.2.5 JDBC Driver
  - 1.2.6 JMS client
  - 1.2.7 Libraries for ActiveMQ JMS
- 1.3 Installation
- 1.4 Running JMeter
  - 1.4.1 JMeter's Classpath
  - 1.4.2 Create Test Plan from Template
  - 1.4.3 Using JMeter behind a proxy
  - 1.4.4 CLI mode
  - 1.4.5 Server Mode
  - 1.4.6 Overriding Properties Via The Command Line
  - 1.4.7 Logging and Error Messages
  - 1.4.8 Full list of command-line options
  - 1.4.9 CLI mode shutdown
- 1.5 Configuring JMeter

### 2. BUILDING A TEST PLAN
- 2.1 Adding and Removing Elements
- 2.2 Loading and Saving Elements
- 2.3 Configuring Tree Elements
- 2.4 Saving the Test Plan
- 2.5 Running a Test Plan
- 2.6 Stopping a Test
- 2.7 Error Reporting

### 3. ELEMENTS OF A TEST PLAN
- 3.1 Thread Group
- 3.2 Controllers
  - 3.2.1 Samplers
  - 3.2.2 Logic Controllers
  - 3.2.3 Test Fragments
- 3.3 Listeners
- 3.4 Timers
- 3.5 Assertions
- 3.6 Configuration Elements
- 3.7 Pre-Processor Elements
- 3.8 Post-Processor Elements
- 3.9 Execution Order
- 3.10 Scoping Rules
- 3.11 Properties and Variables
- 3.12 Using Variables to Parameterise Tests

### 4. BUILDING A WEB TEST PLAN
- 4.1 Adding Users
- 4.2 Adding Default HTTP Request Properties
- 4.3 Adding Cookie Support
- 4.4 Adding HTTP Requests
- 4.5 Adding a Listener to View/Store Test Results
- 4.6 Logging in to a Web-site

### 5. BUILDING AN ADVANCED WEB TEST PLAN
- 5.1 Handling User Sessions with URL Rewriting
- 5.2 Using a Header Manager

### 6. BUILDING A DATABASE TEST PLAN
- 6.1 Adding Users
- 6.2 Adding JDBC Requests
- 6.3 Adding a Listener to View/Store Test Results

### 7. BUILDING AN FTP TEST PLAN
- 7.1 Adding Users
- 7.2 Adding Default FTP Request Properties
- 7.3 Adding FTP Requests
- 7.4 Adding a Listener to View/Store Test Results

### 8A. BUILDING AN LDAP TEST PLAN
- 8A.1 Adding Users
- 8A.2 Adding Login Config Element
- 8A.3 Adding LDAP Request Defaults
- 8A.4 Adding LDAP Requests
- 8A.5 Adding a Response Assertion
- 8A.6 Adding a Listener to View/Store Test Results

### 8B. BUILDING AN EXTENDED LDAP TEST PLAN
- 8B.1 Adding Users
- 8B.2 Adding LDAP Extended Request Defaults
- 8B.3 Adding LDAP Requests
- 8B.4 Adding a Listener to View/Store Test Results

### 9. BUILDING A WEBSERVICE TEST PLAN

### 10. BUILDING A JMS POINT TO POINT TEST PLAN

### 11. BUILDING A JMS TOPIC TEST PLAN

### 11. BUILDING A TEST PLAN PROGRAMMATICALLY

### 12. INTRODUCTION TO LISTENERS

### 13. REMOTE TESTING

### 14. DASHBOARD REPORT
- 14.1 Overview
- 14.2 Configuring Dashboard Generation
- 14.3 Generating Reports
- 14.4 Default Graphs
- 14.5 Improving Report Dashboard

### 15. REAL TIME RESULTS

### 16. BEST PRACTICES

### 17. HELP! MY BOSS WANTS ME TO LOAD TEST OUR WEB APP!

### 18. COMPONENT REFERENCE

### 19. PROPERTIES REFERENCE

### 20. FUNCTIONS

### 21. REGULAR EXPRESSIONS

### 22. HINTS AND TIPS

### 23. GLOSSARY

### 24. CURL
- 24.1 How to enter commands
- 24.2 Supported Curl Options
- 24.3 Warning
- 24.4 Examples

### 25. HISTORY / FUTURE

## Attribution
Crawled from https://jmeter.apache.org/usermanual/index.html



## Attribution
- Source: Performance Testing Documentation
- URL: https://jmeter.apache.org/usermanual/index.html
- License: License: Apache License 2.0
- Crawl Date: 2025-04-25T00:06:26.094Z
- Data Size: 70392148 bytes
- Links Found: 38794

## Retrieved
2025-04-25
