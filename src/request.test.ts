import { expect } from 'jsr:@std/expect';

import { httpStatusCodes } from './http-status-codes.ts';
import { JsonResponse } from './http.ts';
import {
  doesRequestMatchPattern,
  getQueryParamsFromRequest,
  getPathNameFromRequest,
  parsePathValuesFromRequest,
  handleRoutesWithRequest,
} from './request.ts';

Deno.test('match path', () => {
  const match = doesRequestMatchPattern(
    new Request(new URL('http://github.com/neogeek/tiny-api-tools')),
    '/:org/:repo'
  );

  expect(match).toBe(true);
});

Deno.test('match path with optional values', () => {
  const match = doesRequestMatchPattern(
    new Request(new URL('http://github.com/neogeek/tiny-api-tools')),
    '/:org/:repo/:branch?'
  );

  expect(match).toBe(true);
});

Deno.test('does not match path (extra params)', () => {
  const match = doesRequestMatchPattern(
    new Request(new URL('http://github.com/neogeek/tiny-api-tools')),
    '/:org/:repo/:branch'
  );

  expect(match).toBe(false);
});

Deno.test('does not match path (extra values)', () => {
  const match = doesRequestMatchPattern(
    new Request(new URL('http://github.com/neogeek/tiny-api-tools/main')),
    '/:org/:repo'
  );

  expect(match).toBe(false);
});

Deno.test('get search params from request', () => {
  const params = getQueryParamsFromRequest(
    new Request(new URL('https://github.com/search?q=test&type=repositories'))
  );

  expect(params.q).toBe('test');
  expect(params.type).toBe('repositories');
});

Deno.test('get pathname from request', () => {
  const pathname = getPathNameFromRequest(
    new Request(new URL('https://github.com/search?q=test&type=repositories'))
  );

  expect(pathname).toBe('/search');
});

Deno.test('parse path name from request', () => {
  const values = parsePathValuesFromRequest(
    new Request(new URL('http://github.com/neogeek/tiny-api-tools/main')),
    '/:org/:repo/:branch'
  );

  expect(values.org).toBe('neogeek');
  expect(values.repo).toBe('tiny-api-tools');
  expect(values.branch).toBe('main');
});

Deno.test('parse path name from request with optional values', () => {
  const values = parsePathValuesFromRequest(
    new Request(new URL('http://github.com/neogeek/tiny-api-tools')),
    '/:org/:repo/:branch?'
  );

  expect(values.org).toBe('neogeek');
  expect(values.repo).toBe('tiny-api-tools');
  expect(values.branch).toBe(undefined);
});

const generateMockRoutes = async (request: Request) =>
  await handleRoutesWithRequest(request, [
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
  ]);

Deno.test('test handling routes', async () => {
  const request = new Request(new URL('http://localhost:8080/'));

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8'
  );
  expect(response.status).toBe(httpStatusCodes.OK);
  expect(body).toBe('{"version":"1.0.0"}');
});

Deno.test('test handling routes with out pattern values', async () => {
  const request = new Request(new URL('http://localhost:8080/hello'));

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8'
  );
  expect(response.status).toBe(httpStatusCodes.OK);
  expect(body).toBe('{"message":"Hello, world!"}');
});

Deno.test('test handling routes with pattern values', async () => {
  const request = new Request(new URL('http://localhost:8080/hello/scott'));

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8'
  );
  expect(response.status).toBe(httpStatusCodes.OK);
  expect(body).toBe('{"message":"Hello, scott!"}');
});

Deno.test('test handling routes not found', async () => {
  const request = new Request(new URL('http://localhost:8080/missing'));

  const response = await generateMockRoutes(request);

  const body = await response.text();

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8'
  );
  expect(response.status).toBe(httpStatusCodes.NotFound);
  expect(body).toBe('{"message":"Not Found"}');
});
