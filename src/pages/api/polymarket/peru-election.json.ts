import type { APIRoute } from 'astro';
import { fetchPeruElectionMarket } from '../../../lib/polymarket';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const payload = await fetchPeruElectionMarket();

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=30, s-maxage=30',
      },
    });
  } catch (error) {
    console.error('[polymarket] No se pudo cargar el mercado de Perú', error);

    return new Response(
      JSON.stringify({
        message: 'No se pudo cargar Polymarket en este momento.',
      }),
      {
        status: 502,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        },
      },
    );
  }
};
