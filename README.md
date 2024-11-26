# Tiny API Tools

> A set of functions for building tiny APIs in JavaScript.

[![Test](https://github.com/neogeek/tiny-api-tools/actions/workflows/test.workflow.yml/badge.svg)](https://github.com/neogeek/tiny-api-tools/actions/workflows/test.workflow.yml)
[![Publish](https://github.com/neogeek/tiny-api-tools/actions/workflows/publish.workflow.yml/badge.svg)](https://github.com/neogeek/tiny-api-tools/actions/workflows/publish.workflow.yml)
[![jsr](https://jsr.io/badges/@neogeek/tiny-api-tools)](https://jsr.io/@neogeek/tiny-api-tools)

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

```typescript
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
      status: 404,
    }
  );
});
```

## Request Pattern

Request patterns are similar to how routes are defined in frameworks like express.

Each pattern consists of static names `/version` and variable names `/:username`. These can be used in any order you would like.

Variable name at the end of a pattern can be made optional by using a `?` character at the end of the pattern like this `/:org/:repo/:branch?`.

Trailing slashes are not required and won't prevent matching if the request doesn't include it.
