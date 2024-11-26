import { expect } from 'jsr:@std/expect';

import { JsonResponse } from './http.ts';

Deno.test('json response', async () => {
  const response = new JsonResponse({ message: 'Hello, world!' });

  expect(await response.text()).toBe('{"message":"Hello, world!"}');
});

Deno.test('json response default status', () => {
  const response = new JsonResponse({ message: 'Hello, world!' });

  expect(response.status).toBe(200);
});

Deno.test('json response custom status', () => {
  const response = new JsonResponse(
    { message: 'Hello, world!' },
    { status: 404 }
  );

  expect(response.status).toBe(404);
});

Deno.test('json response default header', () => {
  const response = new JsonResponse({ message: 'Hello, world!' });

  expect(response.headers.get('content-type')).toBe(
    'application/json; charset=utf-8'
  );
});

Deno.test('json response custom header', () => {
  const response = new JsonResponse(
    { message: 'Hello, world!' },
    {
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
    }
  );

  expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
});
