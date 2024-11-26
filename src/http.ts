/**
 * This module contains custom HTTP Responses for use with JSON.
 * @module
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

/**
 * An extended class of Response which automatically stringifies
 * JSON data and sets up the proper headers for a JSON response.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Response for more information.
 */

export class JsonResponse extends Response {
  constructor(json: Json, init: ResponseInit = {}) {
    const headers = new Headers(init.headers);

    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json; charset=utf-8');
    }

    init.headers = headers;

    super(JSON.stringify(json), init);
  }
}
