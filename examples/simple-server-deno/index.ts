import { JsonResponse } from '@neogeek/tiny-api-tools/http';

import { handleRoutesWithRequest } from '@neogeek/tiny-api-tools/request';

import type { RouteHandler } from '@neogeek/tiny-api-tools/types';

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
    {
      pattern: '/api/upload',
      method: 'POST',
      handler: (({ body }) => {
        console.log(body);

        return new JsonResponse({
          message: 'Uploaded',
        });
      }) as RouteHandler<{ data: string }>,
    },
  ]);
});
