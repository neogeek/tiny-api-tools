import {
  httpStatusCodes,
  httpStatusMessages,
} from 'jsr:@neogeek/tiny-api-tools/http-status-codes';
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
    doesRequestMatchPattern(req, '/hello/:name?')
  ) {
    const params = parsePathValuesFromRequest(req, '/hello/:name?');

    return new JsonResponse({ message: `Hello, ${params.name || 'world'}!` });
  }

  return new JsonResponse(
    { message: httpStatusMessages[httpStatusCodes.NotFound] },
    {
      status: httpStatusCodes.NotFound,
    }
  );
});
