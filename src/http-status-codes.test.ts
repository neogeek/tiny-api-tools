import { expect } from 'jsr:@std/expect';

import { httpStatusCodes, httpStatusMessages } from './http-status-codes.ts';

Deno.test(
  'check http status codes have similar counts for string and number keys',
  () => {
    expect(Object.keys(httpStatusMessages).length).toBe(
      Object.keys(httpStatusCodes).length
    );
  }
);

Deno.test(
  'check http status codes have the same string and number keys',
  () => {
    const codeValues = Array.from(new Set(Object.values(httpStatusCodes)));

    const messageValues = Array.from(
      new Set(Object.keys(httpStatusMessages).map(parseFloat))
    );

    const diff = Array.from(new Set(codeValues)).filter(
      (value) => !messageValues.includes(value)
    );

    expect(codeValues.length).toBe(messageValues.length);
    expect(diff.length).toBe(0);
  }
);
