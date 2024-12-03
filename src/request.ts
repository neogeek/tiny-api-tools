/**
 * This module contains functions for dealing with request parsing.
 * @module
 */

import {
  parsePathValuesFromUrl,
  doesUrlMatchPattern,
  getQueryParamsFromUrl,
  getPathNameFromUrl,
} from './url.ts';

import type { PathParams, RequestParams } from './types.ts';

/**
 * Parses key value pairs out of the URL of a request using a string pattern.
 *
 * ```typescript
 * const values = parsePathValuesFromRequest(
 *   new Request(new URL('http://github.com/neogeek/tiny-api-tools/main')),
 *   '/:org/:repo/:branch'
 * );
 *
 * console.log(values); // { org: 'neogeek', repo: 'tiny-api-tools', branch: 'main' }
 * ```
 *
 * @param req The request object.
 * @param pattern Pattern to match against. See documentation for how to create pattern strings.
 * @returns A key value pair object.
 */

export const parsePathValuesFromRequest = <Path extends string>(
  req: Request,
  pattern: Path
): PathParams<Path> => {
  const url = new URL(req.url);

  return parsePathValuesFromUrl(url, pattern);
};

/**
 * Does the request match the route pattern string?
 *
 * ```typescript
 * if (doesRequestMatchPattern(
 *   new Request(new URL('http://github.com/neogeek/tiny-api-tools')),
 *   '/:org/:repo/:branch?'
 * )) {
 *   console.log('Pattern matched!');
 * }
 * ```
 *
 * @param req The request object.
 * @param pattern Pattern to match against. See documentation for how to create pattern strings.
 * @returns Boolean result of test.
 */

export const doesRequestMatchPattern = (
  req: Request,
  pattern: string
): boolean => {
  const url = new URL(req.url);

  return doesUrlMatchPattern(url, pattern);
};

/**
 * Parse query params from the URL of a request.
 *
 * ```typescript
 * const params = getQueryParamsFromRequest(
 *   new Request(new URL('https://github.com/search?q=test&type=repositories'))
 * );
 *
 * console.log(params); // { q: 'test', type: 'repositories' }
 * ```
 *
 * @param req The request object.
 * @returns Key value pair object.
 */

export const getQueryParamsFromRequest = (req: Request): RequestParams => {
  const url = new URL(req.url);

  return getQueryParamsFromUrl(url);
};

/**
 * Get the path name from the URL of a request.
 *
 * ```typescript
 * const pathname = getPathNameFromRequest(
 *   new Request(new URL('https://github.com/search?q=test&type=repositories'))
 * );
 *
 * console.log(pathname) // /search
 * ```
 *
 * @param req The request object.
 * @returns Path name.
 */

export const getPathNameFromRequest = (req: Request): string => {
  const url = new URL(req.url);

  return getPathNameFromUrl(url);
};
