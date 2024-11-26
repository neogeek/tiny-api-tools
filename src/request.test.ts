import { expect } from 'jsr:@std/expect';

import {
  doesRequestMatchPattern,
  getQueryParamsFromRequest,
  getPathNameFromRequest,
  parsePathValuesFromRequest,
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

Deno.test('does not match path', () => {
  const match = doesRequestMatchPattern(
    new Request(new URL('http://github.com/neogeek/tiny-api-tools')),
    '/:org/:repo/:branch'
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
