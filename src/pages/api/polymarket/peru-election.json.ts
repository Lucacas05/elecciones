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
        'cache-control': payload.servedFrom === 'live' ? 'public, max-age=30, s-maxage=30' : 'no-store',
        'x-polymarket-source': payload.servedFrom,
        'x-polymarket-stale': payload.stale ? '1' : '0',
      },
    });
  } catch (error) {
    console.error('[polymarket] No se pudo cargar el mercado de Perú', error);

    return new Response(
      JSON.stringify({
        message:
          error instanceof Error
            ? error.message
            : 'No pudimos cargar Polymarket ni un respaldo disponible.',
      }),
      {
        status: 503,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
          'x-polymarket-source': 'unavailable',
          'x-polymarket-stale': '1',
        },
      },
    );
  }
};
