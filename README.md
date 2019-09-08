# apollo-hapi-upload

_File uploads with Apollo + hapi_

This project tests [Apollo Server's file uploads](https://www.apollographql.com/docs/apollo-server/features/file-uploads/) with [hapi](https://hapi.dev) and [apollo-upload-client](https://github.com/jaydenseric/apollo-upload-client).

## Purpose

This repository is a smoke test for [apollo-server-hapi](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-hapi)'s file upload feature. It confirms that something is broken:

```shell
npm run build:server
# ...
npm test
# ...
Failed tests:

  1) file uploads:

      actual expected

      400200

      Expected 400 to equal specified value: 200

      at /Users/creed/dev/apollo-hapi-upload/test/server.js:38:46


1 of 1 tests failed
Test duration: 65 ms
# ...
```

The server's response:

```json
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "GET query missing."
}
```

## Setup

Ensure you have [Node.js](https://nodejs.org/en/) v10.x.x.

1. Clone the repository
2. Install the dependencies:

    ```shell
    cd apollo-hapi-upload
    npm install
    # ...

## Running

This project contains a demo UI built with [Semantic UI](https://github.com/jaydenseric/apollo-upload-client). To run it locally:

1. Build:

    ```shell
    npm run build
    ```
2. Start the server:

    ```shell
    npm start
    ```
3. Open [localhost:3000](http://localhost:3000)

## Tests

This project includes a basic [lab](https://github.com/hapijs/lab) test. To run it:

1. Build the server:

    ```shell
    npm run build:server
    ```
2. Run the test:

    ```shell
    npm test
    ```