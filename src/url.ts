/**
 * This module contains functions for dealing with URL parsing.
 * @module
 */

export type PathParams<Path extends string> =
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

export const getQueryParamsFromUrl = (
  url: URL
): {
  [k: string]: string;
} => {
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
