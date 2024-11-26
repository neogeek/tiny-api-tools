import { JsonResponse } from '../../src/http.ts';
import {
  doesRequestMatchPattern,
  parsePathValuesFromRequest,
} from '../../src/request.ts';

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
