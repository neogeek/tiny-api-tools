import { expect } from 'jsr:@std/expect';

import { httpStatusCodes, httpStatusMessages } from './http-status-codes.ts';

Deno.test('check http status codes have both string and number keys', () => {
  expect(Object.keys(httpStatusMessages).length).toBe(
    Object.keys(httpStatusCodes).length
  );
});
