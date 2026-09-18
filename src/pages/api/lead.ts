import type { APIRoute } from 'astro';

export const prerender = false;

const CRM_ENDPOINT = 'https://apicrm.evolveresales.com.br/api/v1/leads';

export const POST: APIRoute = async ({ request }) => {
  const token = import.meta.env.CRM_API_TOKEN;

  if (!token) {
    return new Response(JSON.stringify({ error: 'Lead capture is not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.name || !body.email) {
    return new Response(JSON.stringify({ error: 'name and email are required.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response = await fetch(CRM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const status = response.ok ? 200 : 502;
  return new Response(JSON.stringify({ ok: response.ok }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};
