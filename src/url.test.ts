import { expect } from 'jsr:@std/expect';

import {
  doesUrlMatchPattern,
  getQueryParamsFromUrl,
  getPathNameFromUrl,
  parsePathValuesFromUrl,
} from './url.ts';

Deno.test('match path', () => {
  const match = doesUrlMatchPattern(
    new URL('http://github.com/neogeek/tiny-api-tools'),
    '/:org/:repo'
  );

  expect(match).toBe(true);
});

Deno.test('match path with optional values', () => {
  const match = doesUrlMatchPattern(
    new URL('http://github.com/neogeek/tiny-api-tools'),
    '/:org/:repo/:branch?'
  );

  expect(match).toBe(true);
});

Deno.test('does not match path (extra params)', () => {
  const match = doesUrlMatchPattern(
    new URL('http://github.com/neogeek/tiny-api-tools'),
    '/:org/:repo/:branch'
  );

  expect(match).toBe(false);
});

Deno.test('does not match path (extra values)', () => {
  const match = doesUrlMatchPattern(
    new URL('http://github.com/neogeek/tiny-api-tools/main'),
    '/:org/:repo'
  );

  expect(match).toBe(false);
});

Deno.test('get search params from URL', () => {
  const params = getQueryParamsFromUrl(
    new URL('https://github.com/search?q=test&type=repositories')
  );

  expect(params.q).toBe('test');
  expect(params.type).toBe('repositories');
});

Deno.test('get pathname from URL', () => {
  const pathname = getPathNameFromUrl(
    new URL('https://github.com/search?q=test&type=repositories')
  );

  expect(pathname).toBe('/search');
});

Deno.test('parse path name from URL', () => {
  const values = parsePathValuesFromUrl(
    new URL('http://github.com/neogeek/tiny-api-tools/main'),
    '/:org/:repo/:branch'
  );

  expect(values.org).toBe('neogeek');
  expect(values.repo).toBe('tiny-api-tools');
  expect(values.branch).toBe('main');
});

Deno.test('parse path name from URL with optional values', () => {
  const values = parsePathValuesFromUrl(
    new URL('http://github.com/neogeek/tiny-api-tools'),
    '/:org/:repo/:branch?'
  );

  expect(values.org).toBe('neogeek');
  expect(values.repo).toBe('tiny-api-tools');
  expect(values.branch).toBe(undefined);
});
