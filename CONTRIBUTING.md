# Contributing

## Install

Start first by cloning the package and installing the development dependencies:

```sh
cd ecstra && yarn
```

## Tests

You can run the tests using:

```sh
yarn test
```

Alternatively, you can run a single file:

```sh
yarn test -- [PATH_TO_FILE]
```

## Development Server

You can start the development server using:

```sh
yarn start
```

This will listen for changes in the `src/` directory.

## Example Server

In order to try your local changes, you can either use the tests, or create
an example making good use of your feature / bug fix.

You can start the web server for the examples with:

```sh
yarn example
```

You can then navigate to `http://localhost:8080/example/[EXAMPLE_NAME]` to try
it out.

## Local Link

In order to link this package to another one, you can either use `yarn add file:[PATH_TO_ECSTRA]`
with a local path, or `yarn link`.

Just be careful: the package that is published (and so that you should link)
is in the `dist` folder.

```sh
yarn build
cd dist
yarn link # Link the package generated in the `dist` folder
```

In you local application, you can now use the `ecstra` package:

```sh
cd my-app
yarn link ecstra
```

```js
import { World } from 'ecstra';

// You can use Ecstra as if it was a npm-installed dependency
const world = new World();
```

## Benchmark

Before being merged, the code is passed into the benchmark test suite to ensure
no performance has been lost.

To run the benchmark locally, you can use:

```sh
npm run benchmark -- -o [PATH_TO_OUTPUT_FILE]
```

If you wish to compare the benchmark with a previous result, you can use:

```sh
npm run benchmark -- -c [PATH_TO_FILE_TO_COMPARE]
```
