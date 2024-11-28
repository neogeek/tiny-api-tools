/**
 * This module contains functions for dealing with request parsing.
 * @module
 */

type PathParams<Path extends string> =
  Path extends `/${infer Param}/${infer Rest}`
    ? Param extends `:${infer Key}`
      ? { [K in Key]: string } & PathParams<`/${Rest}`>
      : PathParams<`/${Rest}`>
    : Path extends `/${infer Param}`
    ? Param extends `:${infer Key}?`
      ? { [K in Key]?: string }
      : Param extends `:${infer Key}`
      ? { [K in Key]: string }
      : Record<string | number | symbol, never>
    : Record<string | number | symbol, never>;

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

  const values = url.pathname.split('/').filter(Boolean);

  const parts = pattern.split('/').filter(Boolean);

  const requiredParts = parts.filter((part) => {
    return part.startsWith(':') && !part.endsWith('?');
  });

  return (
    (values.length === parts.length ||
      values.length === requiredParts.length) &&
    parts.every((part, index) => {
      return !part.startsWith(':') ? part === values[index] : true;
    })
  );
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

export const getQueryParamsFromRequest = (
  req: Request
): {
  [k: string]: string;
} => {
  const { search } = new URL(req.url);

  const params = Object.fromEntries(new URLSearchParams(search).entries());

  return params;
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
  const { pathname } = new URL(req.url);

  return pathname;
};
