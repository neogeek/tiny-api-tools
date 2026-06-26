import { expect } from '@std/expect';

import { httpStatusCodes } from './http-status-codes.ts';
import { JsonResponse } from './http.ts';
import {
  doesUrlMatchPattern,
  getPathNameFromUrl,
  getQueryParamsFromUrl,
  handleRoutesWithUrl,
  parsePathValuesFromUrl,
} from './url.ts';

import type { RouteHandler } from './types.ts';

Deno.test('match path', () => {
  const match = doesUrlMatchPattern(
    new URL('http://github.com/neogeek/tiny-api-tools'),
    '/:org/:repo',
  );

  expect(match).toBe(true);
});

Deno.test('match path with optional values', () => {
  const match = doesUrlMatchPattern(
    new URL('http://github.com/neogeek/tiny-api-tools'),
    '/:org/:repo/:branch?',
  );

  expect(match).toBe(true);
});

Deno.test('does not match path (extra params)', () => {
  const match = doesUrlMatchPattern(
    new URL('http://github.com/neogeek/tiny-api-tools'),
    '/:org/:repo/:branch',
  );

  expect(match).toBe(false);
});

Deno.test('does not match path (extra values)', () => {
  const match = doesUrlMatchPattern(
    new URL('http://github.com/neogeek/tiny-api-tools/main'),
    '/:org/:repo',
  );

  expect(match).toBe(false);
});

Deno.test('get search params from URL', () => {
  const params = getQueryParamsFromUrl(
    new URL('https://github.com/search?q=test&type=repositories'),
  );

  expect(params.q).toBe('test');
  expect(params.type).toBe('repositories');
});

Deno.test('get pathname from URL', () => {
  const pathname = getPathNameFromUrl(
    new URL('https://github.com/search?q=test&type=repositories'),
  );

  expect(pathname).toBe('/search');
});

Deno.test('parse path name from URL', () => {
  const values = parsePathValuesFromUrl(
    new URL('http://github.com/neogeek/tiny-api-tools/main'),
    '/:org/:repo/:branch',
  );

  expect(values.org).toBe('neogeek');
  expect(values.repo).toBe('tiny-api-tools');
  expect(values.branch).toBe('main');
});

Deno.test('parse path name from URL with optional values', () => {
  const values = parsePathValuesFromUrl(
    new URL('http://github.com/neogeek/tiny-api-tools'),
    '/:org/:repo/:branch?',
  );

  expect(values.org).toBe('neogeek');
  expect(values.repo).toBe('tiny-api-tools');
  expect(values.branch).toBe(undefined);
});

const generateMockRoutes = async (req: Request) => {
  const url = new URL(req.url);

  return await handleRoutesWithUrl(req, url, [
    {
      pattern: '/',
      handler: () => new JsonResponse({ version: '1.0.0' }),
    },
    {
      pattern: '/hello/:name?',
      handler: ({ values }) => {
        return new JsonResponse({
          message: `Hello, ${values.name || 'world'}!`,
        });
      },
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
};

Deno.test('test handling routes', async () => {
  const request = new Request('http://localhost:8080/', {
    method: 'GET',
  });

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8',
  );
  expect(response.status).toBe(httpStatusCodes.OK);
  expect(body).toBe('{"version":"1.0.0"}');
});

Deno.test('test handling routes with out pattern values', async () => {
  const request = new Request('http://localhost:8080/hello', {
    method: 'GET',
  });

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8',
  );
  expect(response.status).toBe(httpStatusCodes.OK);
  expect(body).toBe('{"message":"Hello, world!"}');
});

Deno.test('test handling routes with pattern values', async () => {
  const request = new Request('http://localhost:8080/hello/scott', {
    method: 'GET',
  });

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8',
  );
  expect(response.status).toBe(httpStatusCodes.OK);
  expect(body).toBe('{"message":"Hello, scott!"}');
});

Deno.test('test handling routes not found', async () => {
  const request = new Request('http://localhost:8080/missing', {
    method: 'GET',
  });

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8',
  );
  expect(response.status).toBe(httpStatusCodes.NotFound);
  expect(body).toBe('{"message":"Not Found"}');
});

Deno.test('test post (text) route', async () => {
  const request = new Request('http://localhost:8080/api/upload', {
    method: 'POST',
    body: 'hello world',
  });

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8',
  );
  expect(response.status).toBe(httpStatusCodes.OK);
  expect(body).toBe('{"message":"Uploaded"}');
});

Deno.test('test post (json) route', async () => {
  const request = new Request('http://localhost:8080/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({}),
  });

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8',
  );
  expect(response.status).toBe(httpStatusCodes.OK);
  expect(body).toBe('{"message":"Uploaded"}');
});

Deno.test('test post (form data) route', async () => {
  const formData = new FormData();
  formData.append('key', 'value');

  const request = new Request('http://localhost:8080/api/upload', {
    method: 'POST',
    body: formData,
  });

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8',
  );
  expect(response.status).toBe(httpStatusCodes.OK);
  expect(body).toBe('{"message":"Uploaded"}');
});

Deno.test('test post (file) route', async () => {
  const formData = new FormData();
  formData.append('key', 'value');

  const request = new Request('http://localhost:8080/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/octet-stream',
    },
    body: new Blob(['Hello, world.'], { type: 'application/octet-stream' }),
  });

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8',
  );
  expect(response.status).toBe(httpStatusCodes.OK);
  expect(body).toBe('{"message":"Uploaded"}');
});
