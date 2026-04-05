import { afterEach, describe, expect, it, vi } from 'vitest';

const fetchPeruElectionMarket = vi.fn();

vi.mock('../../src/lib/polymarket', () => ({
  fetchPeruElectionMarket,
}));

afterEach(() => {
  vi.resetModules();
  fetchPeruElectionMarket.mockReset();
});

describe('GET /api/polymarket/peru-election.json', () => {
  it('expone headers de diagnóstico cuando devuelve snapshot válido', async () => {
    fetchPeruElectionMarket.mockResolvedValue({
      title: 'Peru Presidential Election Winner',
      slug: 'peru-presidential-election-winner',
      active: true,
      closed: false,
      endDate: '2026-04-12T00:00:00Z',
      updatedAt: '2026-04-05T14:15:48.458545Z',
      sourceUrl: 'https://polymarket.com/es/event/peru-presidential-election-winner',
      volume24h: 10,
      volume: 20,
      liquidity: 30,
      openInterest: 40,
      candidates: [{ name: 'Carlos Álvarez' }, { name: 'Keiko Fujimori' }, { name: 'Rafael López Aliaga' }],
      servedFrom: 'cache',
      stale: true,
      staleReason: 'cache_used',
      fetchedAt: '2026-04-05T14:20:00.000Z',
    });

    const { GET } = await import('../../src/pages/api/polymarket/peru-election.json');
    const response = await GET({} as never);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('x-polymarket-source')).toBe('cache');
    expect(response.headers.get('x-polymarket-stale')).toBe('1');
    expect(body.servedFrom).toBe('cache');
  });

  it('devuelve 503 cuando no existe ningún snapshot usable', async () => {
    fetchPeruElectionMarket.mockRejectedValue(new Error('No pudimos cargar Polymarket ni un respaldo disponible.'));

    const { GET } = await import('../../src/pages/api/polymarket/peru-election.json');
    const response = await GET({} as never);
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(response.headers.get('x-polymarket-source')).toBe('unavailable');
    expect(body.message).toMatch(/respaldo disponible/i);
  });
});
