import { describe, expect, it } from 'vitest';
import { normalizeGammaEvent } from './normalize';
import type { GammaEvent } from './types';

function buildMarket({
  question,
  probability,
  tokenId,
  active = true,
  volume24hr = 0,
}: {
  question: string;
  probability: number;
  tokenId: string;
  active?: boolean;
  volume24hr?: number;
}) {
  return {
    question,
    active,
    closed: false,
    outcomes: '["Yes", "No"]',
    outcomePrices: JSON.stringify([String(probability), String(1 - probability)]),
    clobTokenIds: JSON.stringify([tokenId, `${tokenId}-no`]),
    volume24hr,
    volume: 0,
    liquidity: 0,
    bestBid: probability,
    bestAsk: probability + 0.001,
    lastTradePrice: probability,
    oneHourPriceChange: 0,
    oneDayPriceChange: 0,
  };
}

describe('normalizeGammaEvent', () => {
  it('normaliza, ordena y excluye placeholders', () => {
    const raw: GammaEvent = {
      title: 'Peru Presidential Election Winner',
      slug: 'peru-presidential-election-winner',
      active: true,
      closed: false,
      endDate: '2026-04-12T00:00:00Z',
      updatedAt: '2026-04-05T14:15:48.458545Z',
      markets: [
        buildMarket({
          question: 'Will candidate B win the 2026 Peruvian presidential election?',
          probability: 0.99,
          tokenId: 'placeholder',
          active: false,
        }),
        buildMarket({
          question: 'Will Rafael López Aliaga win the 2026 Peruvian presidential election?',
          probability: 0.155,
          tokenId: 'rla',
          volume24hr: 10,
        }),
        buildMarket({
          question: 'Will Carlos Álvarez win the 2026 Peruvian presidential election?',
          probability: 0.3005,
          tokenId: 'carlos',
          volume24hr: 20,
        }),
        buildMarket({
          question: 'Will Keiko Fujimori win the 2026 Peruvian presidential election?',
          probability: 0.25,
          tokenId: 'keiko',
          volume24hr: 15,
        }),
      ],
    };

    const snapshot = normalizeGammaEvent(raw);

    expect(snapshot.candidates).toHaveLength(3);
    expect(snapshot.candidates.map((candidate) => candidate.name)).toEqual([
      'Carlos Álvarez',
      'Keiko Fujimori',
      'Rafael López Aliaga',
    ]);
    expect(snapshot.candidates[0]?.probability).toBeCloseTo(30.05, 2);
    expect(snapshot.candidates[0]?.yesTokenId).toBe('carlos');
  });

  it('parsea arrays serializados como string JSON', () => {
    const raw: GammaEvent = {
      title: 'Peru Presidential Election Winner',
      slug: 'peru-presidential-election-winner',
      active: true,
      closed: false,
      markets: [
        buildMarket({ question: 'Will Carlos Álvarez win the 2026 Peruvian presidential election?', probability: 0.3005, tokenId: 'carlos' }),
        buildMarket({ question: 'Will Keiko Fujimori win the 2026 Peruvian presidential election?', probability: 0.25, tokenId: 'keiko' }),
        buildMarket({ question: 'Will Rafael López Aliaga win the 2026 Peruvian presidential election?', probability: 0.155, tokenId: 'rla' }),
      ],
    };

    const snapshot = normalizeGammaEvent(raw);

    expect(snapshot.candidates.every((candidate) => typeof candidate.yesTokenId === 'string' && candidate.yesTokenId.length > 0)).toBe(true);
  });

  it('falla si quedan menos de 3 candidatos válidos', () => {
    const raw: GammaEvent = {
      title: 'Peru Presidential Election Winner',
      slug: 'peru-presidential-election-winner',
      active: true,
      closed: false,
      markets: [
        buildMarket({ question: 'Will Carlos Álvarez win the 2026 Peruvian presidential election?', probability: 0.3005, tokenId: 'carlos' }),
        buildMarket({ question: 'Will another candidate win the 2026 Peruvian presidential election?', probability: 0.2, tokenId: 'other', active: false }),
        buildMarket({ question: 'Will candidate B win the 2026 Peruvian presidential election?', probability: 0.1, tokenId: 'placeholder', active: false }),
      ],
    };

    expect(() => normalizeGammaEvent(raw)).toThrow(/al menos 3 candidatos válidos/i);
  });
});
