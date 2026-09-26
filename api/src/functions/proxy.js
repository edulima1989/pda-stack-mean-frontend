const { app } = require('@azure/functions');

const BACKEND_URL = process.env.BACKEND_URL || 'http://3.136.128.2';

app.http('proxy', {
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  authLevel: 'anonymous',
  route: '{*path}',
  handler: async (request, context) => {
    const { search } = new URL(request.url);
    const target = `${BACKEND_URL}/api/${request.params.path ?? ''}${search}`;
    const hasBody = request.method !== 'GET';

    try {
      const res = await fetch(target, {
        method: request.method,
        headers: { 'content-type': request.headers.get('content-type') ?? 'application/json' },
        body: hasBody ? await request.text() : undefined,
      });
      return {
        status: res.status,
        headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
        body: await res.text(),
      };
    } catch (err) {
      context.error(`Proxy error to ${target}`, err);
      return {
        status: 502,
        jsonBody: { error: { message: 'No se pudo conectar con el backend' } },
      };
    }
  },
});
