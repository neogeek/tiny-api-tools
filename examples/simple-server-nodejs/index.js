import { createServer } from 'node:http';

import { JsonResponse } from '@neogeek/tiny-api-tools/http';
import { handleRoutesWithUrl } from '@neogeek/tiny-api-tools/url';

const PORT = process.env.PORT || 8080;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}/`);

  const response = await handleRoutesWithUrl(req.method, url, [
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

  res.statusCode = response.status;
  res.setHeaders(response.headers);
  res.end(await response.text());
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
