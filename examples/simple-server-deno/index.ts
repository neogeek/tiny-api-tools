import { JsonResponse } from 'jsr:@neogeek/tiny-api-tools/http';

import { handleRoutesWithRequest } from 'jsr:@neogeek/tiny-api-tools/request';

Deno.serve({ port: 8080 }, async (req) => {
  return await handleRoutesWithRequest(req, [
    {
      pattern: '/',
      handler: () => new JsonResponse({ version: '1.0.0' }),
    },
    {
      pattern: '/hello/:name?',
      handler: ({ values }) =>
        new JsonResponse({
          message: `Hello, ${values.name || 'world'}!`,
        }),
    },
  ]);
});
