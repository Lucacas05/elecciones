import { fetchLivePeruElectionMarketSnapshot } from './fetch-live';
import { readPersistedSnapshot, persistSnapshot, readSeedSnapshot } from './store';
import type {
  LoggerLike,
  PolymarketEventSnapshot,
  PolymarketEventSnapshotResponse,
  PolymarketSnapshotSource,
  PolymarketStaleReason,
} from './types';

export * from './types';
export { fetchLivePeruElectionMarketSnapshot } from './fetch-live';
export { normalizeGammaEvent, assertValidSnapshot, sortPolymarketCandidates } from './normalize';
export { parseStoredSnapshot, persistSnapshot, readPersistedSnapshot, readSeedSnapshot } from './store';

export class PolymarketUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'PolymarketUnavailableError';
  }
}

export interface FetchPeruElectionMarketDependencies {
  fetchLiveSnapshot?: typeof fetchLivePeruElectionMarketSnapshot;
  readPersistedSnapshot?: typeof readPersistedSnapshot;
  persistSnapshot?: typeof persistSnapshot;
  readSeedSnapshot?: typeof readSeedSnapshot;
  logger?: LoggerLike;
  now?: () => Date;
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { message: String(error) };
}

function buildResponse(
  snapshot: PolymarketEventSnapshot,
  servedFrom: PolymarketSnapshotSource,
  staleReason: PolymarketStaleReason,
  fetchedAt: string,
): PolymarketEventSnapshotResponse {
  return {
    ...snapshot,
    servedFrom,
    stale: servedFrom !== 'live',
    staleReason,
    fetchedAt,
  };
}

export async function fetchPeruElectionMarket({
  fetchLiveSnapshot = fetchLivePeruElectionMarketSnapshot,
  readPersistedSnapshot: readPersisted = readPersistedSnapshot,
  persistSnapshot: persist = persistSnapshot,
  readSeedSnapshot: readSeed = readSeedSnapshot,
  logger = console,
  now = () => new Date(),
}: FetchPeruElectionMarketDependencies = {}): Promise<PolymarketEventSnapshotResponse> {
  const fetchedAt = now().toISOString();

  try {
    const liveSnapshot = await fetchLiveSnapshot({ logger });

    try {
      await persist(liveSnapshot);
    } catch (error) {
      logger.warn?.('[polymarket] No se pudo persistir el último snapshot válido', {
        error: serializeError(error),
      });
    }

    return buildResponse(liveSnapshot, 'live', 'none', fetchedAt);
  } catch (liveError) {
    logger.error?.('[polymarket] Falló el upstream live; intentando snapshot persistido', {
      error: serializeError(liveError),
    });

    try {
      const cachedSnapshot = await readPersisted();
      if (cachedSnapshot) {
        logger.warn?.('[polymarket] Sirviendo snapshot persistido', {
          source: 'cache',
          staleReason: 'cache_used',
        });
        return buildResponse(cachedSnapshot, 'cache', 'cache_used', fetchedAt);
      }
    } catch (cacheError) {
      logger.error?.('[polymarket] No se pudo leer el snapshot persistido', {
        error: serializeError(cacheError),
      });
    }

    try {
      const seedSnapshot = await readSeed();
      logger.warn?.('[polymarket] Sirviendo seed local de emergencia', {
        source: 'seed',
        staleReason: 'seed_used',
      });
      return buildResponse(seedSnapshot, 'seed', 'seed_used', fetchedAt);
    } catch (seedError) {
      logger.error?.('[polymarket] No se pudo leer el seed local de emergencia', {
        error: serializeError(seedError),
      });
      throw new PolymarketUnavailableError('No pudimos cargar Polymarket ni un respaldo disponible.', {
        cause: seedError instanceof Error ? seedError : undefined,
      });
    }
  }
}
