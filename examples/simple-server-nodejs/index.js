import { createServer } from 'node:http';

import {
  httpStatusCodes,
  httpStatusMessages,
} from '@neogeek/tiny-api-tools/http-status-codes';
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
  } else if (
    req.method === 'GET' &&
    doesUrlMatchPattern(url, '/hello/:name?')
  ) {
    const params = parsePathValuesFromUrl(url, '/hello/:name?');

    res.end(JSON.stringify({ message: `Hello, ${params.name || 'world'}!` }));
  } else {
    res.statusCode = httpStatusCodes.NotFound;
    res.end(
      JSON.stringify({ message: httpStatusMessages[httpStatusCodes.NotFound] })
    );
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
