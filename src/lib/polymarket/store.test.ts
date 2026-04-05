import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { persistSnapshot, readPersistedSnapshot, readSeedSnapshot } from './store';
import type { PolymarketEventSnapshot } from './types';

const snapshot: PolymarketEventSnapshot = {
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
  candidates: [
    { name: 'Carlos Álvarez', slug: 'carlos', probability: 30.05, bestBid: 30, bestAsk: 30.1, lastTradePrice: 31.4, hourChange: 0, dayChange: 0, volume24h: 10, volume: 10, liquidity: 10, yesTokenId: 'carlos' },
    { name: 'Keiko Fujimori', slug: 'keiko', probability: 25, bestBid: 24.9, bestAsk: 25.1, lastTradePrice: 25, hourChange: 0, dayChange: 0, volume24h: 10, volume: 10, liquidity: 10, yesTokenId: 'keiko' },
    { name: 'Rafael López Aliaga', slug: 'rla', probability: 15.5, bestBid: 15, bestAsk: 16, lastTradePrice: 15, hourChange: 0, dayChange: 0, volume24h: 10, volume: 10, liquidity: 10, yesTokenId: 'rla' },
  ],
};

describe('polymarket store', () => {
  it('devuelve null si no hay token para Blob', async () => {
    await expect(readPersistedSnapshot({ token: '' })).resolves.toBeNull();
    await expect(persistSnapshot(snapshot, { token: '' })).resolves.toBe(false);
  });

  it('lee un snapshot persistido desde Blob con dependencias inyectadas', async () => {
    const blobGet = async () => ({
      statusCode: 200 as const,
      stream: new Response(JSON.stringify(snapshot)).body,
      headers: new Headers(),
      blob: {
        url: 'https://blob.example/latest.json',
        downloadUrl: 'https://blob.example/latest.json?download=1',
        pathname: 'polymarket/peru-election-winner/latest.json',
        contentDisposition: 'inline',
        cacheControl: 'max-age=0',
        uploadedAt: new Date(),
        etag: 'etag',
        contentType: 'application/json',
        size: 1,
      },
    });

    await expect(readPersistedSnapshot({ token: 'token', blobGet: blobGet as never })).resolves.toMatchObject({
      slug: snapshot.slug,
      candidates: expect.arrayContaining([
        expect.objectContaining({ name: 'Carlos Álvarez' }),
      ]),
    });
  });

  it('lee el seed local desde disco', async () => {
    const dir = join(tmpdir(), `polymarket-seed-${Date.now()}`);
    await mkdir(dir, { recursive: true });
    const seedPath = new URL(`file://${join(dir, 'seed.json')}`);
    await writeFile(seedPath, JSON.stringify(snapshot), 'utf8');

    await expect(readSeedSnapshot({ seedPath })).resolves.toMatchObject({
      slug: snapshot.slug,
      candidates: expect.arrayContaining([
        expect.objectContaining({ name: 'Carlos Álvarez' }),
      ]),
    });
  });
});
