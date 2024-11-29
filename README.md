# Tiny API Tools

> A set of functions for building tiny APIs in JavaScript.

[![Test](https://github.com/neogeek/tiny-api-tools/actions/workflows/test.workflow.yml/badge.svg)](https://github.com/neogeek/tiny-api-tools/actions/workflows/test.workflow.yml)
[![Publish](https://github.com/neogeek/tiny-api-tools/actions/workflows/publish.workflow.yml/badge.svg)](https://github.com/neogeek/tiny-api-tools/actions/workflows/publish.workflow.yml)
[![JSR](https://jsr.io/badges/@neogeek/tiny-api-tools)](https://jsr.io/@neogeek/tiny-api-tools)
[![JSR Score](https://jsr.io/badges/@neogeek/tiny-api-tools/score)](https://jsr.io/@neogeek/tiny-api-tools)

## Install

### Deno

```bash
deno add jsr:@neogeek/tiny-api-tools
```

### NPM

```bash
npx jsr add @neogeek/tiny-api-tools
```

## Usage

### Deno

```typescript
import { httpStatusCodes } from 'jsr:@neogeek/tiny-api-tools/http-status-codes';
import { JsonResponse } from 'jsr:@neogeek/tiny-api-tools/http';
import {
  doesRequestMatchPattern,
  parsePathValuesFromRequest,
} from 'jsr:@neogeek/tiny-api-tools/request';

Deno.serve({ port: 8080 }, (req) => {
  if (req.method === 'GET' && doesRequestMatchPattern(req, '/')) {
    return new JsonResponse({ version: '1.0.0' });
  } else if (
    req.method === 'GET' &&
    doesRequestMatchPattern(req, '/hello/:name')
  ) {
    const params = parsePathValuesFromRequest(req, '/hello/:name');

    return new JsonResponse({ message: `Hello, ${params.name || 'world'}!` });
  }

  return new JsonResponse(
    { message: 'Not found' },
    {
      status: httpStatusCodes.NotFound,
    }
  );
});
```

### Node.js

```javascript
import { createServer } from 'node:http';

import { httpStatusCodes } from '@neogeek/tiny-api-tools/http-status-codes';
import {
  doesUrlMatchPattern,
  parsePathValuesFromUrl,
} from '@neogeek/tiny-api-tools/url';

const PORT = process.env.PORT || 3000;

const server = createServer((req, res) => {
  if (!req.url) {
    res.statusCode = httpStatusCodes.InternalServerError;
    res.end(JSON.stringify({ message: 'Internal Server Error' }));

    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}/`);

  if (req.method === 'GET' && doesUrlMatchPattern(url, '/')) {
    res.end(JSON.stringify({ version: '1.0.0' }));
  } else if (req.method === 'GET' && doesUrlMatchPattern(url, '/hello/:name')) {
    const params = parsePathValuesFromUrl(url, '/hello/:name');

    res.end(JSON.stringify({ message: `Hello, ${params.name || 'world'}!` }));
  } else {
    res.statusCode = httpStatusCodes.NotFound;
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

## Request Pattern

Request patterns are similar to how routes are defined in frameworks like express.

Each pattern consists of static names `/version` and variable names `/:username`. These can be used in any order you would like.

Variable name at the end of a pattern can be made optional by using a `?` character at the end of the pattern like this `/:org/:repo/:branch?`.

Trailing slashes are not required and won't prevent matching if the request doesn't include it.
