# DENIM Reverse Engineering

## Description

This application reverse engineer a microservice architecture.

## Features

Here is a summary of the features currently supported.

### Static Analysis

#### Description

The **static analysis** feature allow the developer to analyze statically one or several GitHub microservice 
repositories. The goal of the analysis id to find locations of code related to some API or database technologies 
likely to change during the evolution phase while implying change propagation of cross-dependent components (e.g., 
other microservices or databases). The result of this analysis will help developer to understand and locate more 
easily the code locations to pay attention to in terms of evolution of API and database technologies.

Here is a summary of languages and technologies currently supported:

#### Implementation status

| Language   | Technology          | Implementation status |
|------------|---------------------|-----------------------|
| JavaScript | Redis <br/> Express | 🌓 <br/> 🌓           |

#### How to?

**__INPUT__**

Invoke the static analysis by using the [POST /static](http://locahost:3000/static) route with the following input 
object. This one represent the list of GitHub repositories to analyze. ⚠️ Please respect the URL with the **.git** 
extension!

```json
[
  "https://github.com/<user>/<repository>.git",
  "https://github.com/<user>/<repository>.git",
  "..."
]
```

**__OUTPUT__**

Consult the response object:

```json
{
  "repositoryList": [
    "https://github.com/<user>/<repository>.git",
    "https://github.com/<user>/<repository>.git",
    "..."
  ],
  "interpretedResults": [
    [
      [
        "https://github.com/<user>/<repository>/blob/main/app.js#L4",
        "javascript-api-score",
        "app.get ... / API Score:4"
      ],
      ...
      [
        "https://github.com/<user>/<repository>.git/blob/main/app.js#L24",
        "javascript-redis-score",
        "redisClient.sadd ... / Redis Score:6"
      ],
      ...
    ],
    ...
  ]
}
```

The `repositoryList` lists the analyzed repositories.

The `interpretedResults` details the result of the static analysis. Each repository is a sub-array. Each 
sub-sub-array is a code location detected. These code locations display (1) a detection type key to distinguish 
between the different types, (2) the exact URL of the code location on [GitHub.com](http://www.github.com), and (3) 
an insight of the detection with a likelihood score. 

## Development

### Setup

- [Install NodeJS](https://nodejs.org/fr/download).
- [Install Docker Desktop](https://docs.docker.com/desktop/windows/install/).
- [Download the last CodeQL CLI binaries zip file](https://github.com/github/codeql-cli-binaries/releases) and extract
  it at `/lib/codeql-cli`).
- [Download last CodeQL libraries](https://github.com/github/codeql) and extract them next to CodeQL CLI at 
  `/lib/codeql-lib`).
- Open the project in an IDE and install the dependencies `npm install`.
- Create an `.env` file with the following content.
  ```shell
  # Windows
  FILE_SYSTEM_SEPARATOR="\"
  ```
  ```shell
  # Linux
  FILE_SYSTEM_SEPARATOR="/"
  ```
- Test the application with `npm run start`. The app runs at [http://localhost:3000](http://localhost:3000).

### Test the app (manually)

Manual test suites are set up thanks through the [Postman](https://www.postman.com/) tool.

The tests are specified in the `/test/manual` directory and are named following the `*.test.js` pattern.

### Test the app (unit testing)

Unit test suites are set up thanks to the Jest JavaScript framework.

The tests are specified in the `/test/unit` directory and are named following the `*.test.js` pattern.

The configuration of Jest is stated in the `/package.json` file.

The tests running computes the code coverage.

#### Launching the tests

Launching unit tests is performed by running the following command line.

```bash
npm run test_unit
```

### Test the app (integration testing)

Integration test suites are set up thanks to the Supertest JavaScript framework.

The tests are specified in the `/test/integration` directory and are named following the `*.test.js` pattern.

The configuration of Jest is stated in the `/package.json` file.

#### Preparing the environment with Docker

Launch the application on Docker (cf. [Dockerize the application](#dockerize-the-application)).

#### Launching the tests

Launching integration tests is performed by running this command line.

```bash
npm run test_integration
```

### Dockerize the application

The project contains a `Dockerfile` at its root in order to create an image of the application.

A `docker-compose.yml` file also exists at the root in order to launch easily a container for the application by running
the following command line.

```bash
docker-compose up
```

Warning! This command must be executed at the location of the `docker-compose.yml` file and have to be run as with the
right privileges (administrator).

### Documentation

An autogenerated documentation is available thanks to SwaggerUI
at [http://localhost:3000/docs](http://localhost:3000/docs).

The documentation is generated thanks by running the following command line.

```bash
npm run swagger
```

### CI/CD

A CI/CD process is set up thanks to GitLab CI/CD.
This one is described in the `.gitlab-ci.yml`.
Learn more about GitLab CI/CD via [this page](https://docs.gitlab.com/ee/ci/).

Here are some advice for a well execution of the CI:

- Right privileges must be granted to Docker on the session on which the CI is executed.

## Technical details

### Technologies

* JavaScript
* Docker

### Libraries

#### Project configuration

* [expressjs](https://www.npmjs.com/package/express) is a NodeJS framework.
* [body-parser](https://www.npmjs.com/package/body-parser) is used for parsing REST API request body.

#### Tests

* [jest](https://www.npmjs.com/package/jest) is used for unit testing.
* [supertest](https://www.npmjs.com/package/supertest) is used for integration testing.

#### Documentation

* [swagger-autogen](https://www.npmjs.com/package/swagger-autogen) is used for SWAGGER documentation.
* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) is used UI SWAGGER documentation.

#### Analysis

* [CodeQL](https://github.com/github/codeql-cli-binaries/releases/tag/v2.13.0) is used for static code analysis.

### Tools

* [npm](https://www.npmjs.com/) is the package manager used.
* [GitLab CI/CD](https://docs.gitlab.com/ee/ci/) is the CI/CD continuous tool used.
* [Docker Desktop](https://docs.docker.com/desktop/windows/install/) is the containerization technology used.
* [Postman](https://www.postman.com/) is the tool for testing manually the API.


## Design details

### Static Analysis

For finding locations of code related to some API or database technologies, some heuristics are defined based on 
pattern and rules matching. These help to compute the likelihood scores.

Redis Likelihood Score Heuristics.

| ID  | Description                                                                          |
|-----|--------------------------------------------------------------------------------------|
| R01 | The method call name is get, set, del, scan, keys, sadd, rpush, setnx, exec, ...     |
| R02 | The method call has a string first argument which is not an API route.               |
| R03 | The method call name contains the string "redis".                                    |
| R04 | The method call receiver name contains the string "redis".                           |
| R05 | The method call is in a file where there is an import containing the string "redis". |
| R06 | The method call is in a file where there is a Redis client assignment.               |
| R07 | The method call receiver is a Redis client assignment.                               |
| R08 | The method call receiver is a variable assigned by a Redis import.                   |
| R09 | The method call is nested in a REST API call node in the abstract syntax tree.       |
| R10 | The method call is an import containing the string "redis".                          |


API Likelihood Score Heuristics.

| ID  | Description                                                                                     |
|-----|-------------------------------------------------------------------------------------------------|
| A01 | The method call name is get, post, put, delete, ... or other.                                   |
| A02 | The method call has a string as first argument.                                                 |
| A03 | The method call has a callback function as second argument.                                     |
| A04 | The method call has a API route-like string as first argument                                   |
| A05 | The method call contains the string "express" or other.                                         |
| A06 | The method call receiver name contains the string "app" or other.                               |
| A07 | The method call is in a file where there is an import containing the string "express" or other. |   
| A08 | The method call is in a file where there is an Express or other client assignment.              |
| A09 | The method call is linked to an Express, Axios, or other client assignment.                     |
| A10 | The method call is an import containing the string "express", "axios", or other.                |