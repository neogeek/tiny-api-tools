/**
 * This module contains functions for dealing with URL parsing.
 * @module
 */

import { httpStatusMessages, httpStatusCodes } from './http-status-codes.ts';
import { JsonResponse } from './http.ts';

import type { PathParams, RequestParams, RouteHandler } from './types.ts';

/**
 * Parses key value pairs out of a URL using a string pattern.
 *
 * ```typescript
 * const values = parsePathValuesFromUrl(
 *   new URL('http://github.com/neogeek/tiny-api-tools/main'),
 *   '/:org/:repo/:branch'
 * );
 *
 * console.log(values); // { org: 'neogeek', repo: 'tiny-api-tools', branch: 'main' }
 * ```
 *
 * @param url The URL object.
 * @param pattern Pattern to match against. See documentation for how to create pattern strings.
 * @returns A key value pair object.
 */

export const parsePathValuesFromUrl = <Path extends string>(
  url: URL,
  pattern: Path
): PathParams<Path> => {
  const values = url.pathname.split('/').filter(Boolean);

  const parts = pattern.split('/').filter(Boolean);

  const result: Record<string, string> = {};

  parts.forEach((part, index) => {
    if (part.startsWith(':') && values[index]) {
      result[part.replace(/^:|\?$/g, '')] = values[index];
    }
  });

  return result as PathParams<Path>;
};

/**
 * Does the URL match the route pattern string?
 *
 * ```typescript
 * if (doesUrlMatchPattern(
 *   new URL('http://github.com/neogeek/tiny-api-tools'),
 *   '/:org/:repo/:branch?'
 * )) {
 *   console.log('Pattern matched!');
 * }
 * ```
 *
 * @param url The URL object.
 * @param pattern Pattern to match against. See documentation for how to create pattern strings.
 * @returns Boolean result of test.
 */

export const doesUrlMatchPattern = (url: URL, pattern: string): boolean => {
  const values = url.pathname.split('/').filter(Boolean);

  const params = pattern.split('/').filter(Boolean);

  const valid = params.map((param, index) => {
    const value = values[index];

    if (!param) {
      return false;
    }

    if (!param.startsWith(':')) {
      return value === param;
    } else if (!param.endsWith('?')) {
      return value !== undefined;
    } else {
      return true;
    }
  });

  return values.length <= params.length && valid.every(Boolean);
};

/**
 * Parse query params from a URL.
 *
 * ```typescript
 * const params = getQueryParamsFromUrl(
 *   new URL('https://github.com/search?q=test&type=repositories')
 * );
 *
 * console.log(params); // { q: 'test', type: 'repositories' }
 * ```
 *
 * @param url The URL object.
 * @returns Key value pair object.
 */

export const getQueryParamsFromUrl = (url: URL): RequestParams => {
  const params = Object.fromEntries(new URLSearchParams(url.search).entries());

  return params;
};

/**
 * Get the path name from a URL.
 *
 * ```typescript
 * const pathname = getPathNameFromUrl(
 *   new URL('https://github.com/search?q=test&type=repositories')
 * );
 *
 * console.log(pathname) // /search
 * ```
 *
 * @param url The URL object.
 * @returns Path name.
 */

export const getPathNameFromUrl = (url: URL): string => {
  const { pathname } = url;

  return pathname;
};

/**
 * Handle routes automatically using an array of route patterns and handlers.
 *
 * ```typescript
 * const response = await handleRoutesWithUrl('GET', url, [
 *   {
 *     pattern: '/',
 *     handler: () => new JsonResponse({ version: '1.0.0' }),
 *   },
 *   {
 *     pattern: '/hello/:name?',
 *     handler: ({ values }) => {
 *       return new JsonResponse({
 *         message: `Hello, ${values.name || 'world'}!`,
 *       });
 *     },
 *   },
 * ]);
 * ```
 *
 * @param method HTTP method of request.
 * @param url The URL object.
 * @param routes Array of route configs.
 * @param routes.method HTTP method of request.
 * @param routes.pattern Pattern to match against. See documentation for how to create pattern strings.
 * @param routes.handler Route handler callback.
 * @returns HTTP Response object.
 */

export const handleRoutesWithUrl = async (
  method: string,
  url: URL,
  routes: {
    method?: string;
    pattern: string;
    handler: RouteHandler;
  }[]
): Promise<Response> => {
  const route = routes
    .filter(
      (route) =>
        (!route.method || route.method === method) &&
        doesUrlMatchPattern(url, route.pattern)
    )
    .find(Boolean);

  if (route) {
    const params = getQueryParamsFromUrl(url);
    const values = parsePathValuesFromUrl(url, route.pattern);

    try {
      return await route.handler({ params, values });
    } catch {
      return new JsonResponse({
        message: httpStatusMessages[httpStatusCodes.InternalServerError],
        status: httpStatusCodes.InternalServerError,
      });
    }
  }

  return new JsonResponse(
    { message: httpStatusMessages[httpStatusCodes.NotFound] },
    {
      status: httpStatusCodes.NotFound,
    }
  );
};
