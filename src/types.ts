/**
 * This module contains common type definitions.
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

export type RequestParams = { [key: string]: string };

export type RequestValues = { [key: string]: string };

export type RouteHandler = ({
  params,
  values,
}: {
  params: RequestParams;
  values: RequestValues;
}) => Response | Promise<Response>;
