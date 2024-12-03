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
