import { expect } from 'jsr:@std/expect';

import { httpStatusCodes } from './http-status-codes.ts';

Deno.test('check http status codes have both string and number keys', () => {
  const stringKeys = Object.keys(httpStatusCodes).filter((key) =>
    Number.isNaN(parseInt(key))
  );

  const numberKeys = Object.keys(httpStatusCodes).filter(
    (key) => !Number.isNaN(parseInt(key))
  );

  expect(stringKeys.length).toBe(numberKeys.length);
});
